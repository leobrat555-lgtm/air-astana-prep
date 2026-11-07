import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const hasApiKey = Boolean(
  process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
  process.env.GEMINI_API_KEY.length > 5
);

let ai: GoogleGenAI | null = null;
if (hasApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (e) {
    console.warn('GoogleGenAI initialization warning:', e);
  }
}

// Helper to resolve AI client: accepts client-provided x-gemini-api-key or server fallback
function getAiClient(req: Request): GoogleGenAI | null {
  const customKey = (req.headers['x-gemini-api-key'] as string) || (req.body?.apiKey as string);
  if (customKey && typeof customKey === 'string' && customKey.trim().length > 10) {
    try {
      return new GoogleGenAI({
        apiKey: customKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Custom Gemini key initialization failed:', e);
    }
  }
  return ai;
}

// Helper to run with timeout
async function withTimeout<T>(promise: Promise<T>, ms: number = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI request timeout')), ms)),
  ]);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Endpoint to validate a personal Gemini API key
  app.post('/api/ai/validate-key', async (req: Request, res: Response) => {
    try {
      const client = getAiClient(req);
      if (!client) {
        return res.status(400).json({ valid: false, error: 'Ключ не указан' });
      }

      const response = await withTimeout(
        client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: 'Say OK',
        }),
        3500
      );

      if (response && response.text) {
        return res.json({ valid: true, message: 'Ключ успешно активирован!' });
      }
      return res.status(400).json({ valid: false, error: 'Не получен ответ от модели' });
    } catch (err: any) {
      return res.status(400).json({ valid: false, error: err.message || 'Ошибка валидации ключа' });
    }
  });

  // AI Instructor Endpoint: Socratic Hint
  app.post('/api/ai/hint', async (req: Request, res: Response) => {
    try {
      const { questionText, options, track, category, language = 'en' } = req.body;
      const client = getAiClient(req);

      if (client) {
        const langInstruction = language === 'ru' 
          ? 'Respond in clear, professional Russian (Aviation / Engineering technical style).'
          : 'Respond in concise, professional English.';

        const systemPrompt = `You are a Senior Air Astana Flight & Engineering Instructor evaluating a candidate for the ${track === 'ab-initio' ? 'Ab-Initio Cadet Pilot' : 'Apprentice EASA Part-66 Engineer'} selection program.
The student is requesting a hint on a test question.
CRITICAL RULE: NEVER disclose the correct option letter, the exact final answer, or eliminate options directly.
Instead, use the Socratic method:
1. Identify the core physical law, aerodynamic rule, mathematical shortcut (e.g. 3:1 rule, Rule of 60, Ohm's law, Pascal's principle), or aviation regulation involved.
2. Provide a 2-step mental breakdown explaining HOW the candidate should set up their calculation or reasoning.
3. Keep it brief (under 120 words), encouraging and rigorous.
${langInstruction}`;

        const prompt = `Question: "${questionText}"
Available Options: ${JSON.stringify(options)}
Category: ${category}

Provide a Socratic hint to guide the candidate.`;

        const response = await withTimeout(
          client.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: { systemInstruction: systemPrompt },
          }),
          4000
        );

        if (response.text) {
          return res.json({ hint: response.text });
        }
      }
    } catch (error: any) {
      console.warn('AI Hint fallback:', error.message || error);
    }

    // Realistic Intelligent Fallback
    const { category, language = 'en' } = req.body;
    let fallback = '';
    if (language === 'ru') {
      if (category?.includes('Clearance') || category?.includes('Phraseology')) {
        fallback = '1. Выделите обязательные элементы readback: эшелон/высота, курс и условия доклада (FL180).\n2. Вспомните стандарт ICAO Doc 9432: подтверждается только назначенное диспетчером действие без самовольных изменений.';
      } else if (category?.includes('Math') || category?.includes('Descent')) {
        fallback = '1. Примените правило 3-градусной глиссады: Вертикальная скорость = Путевая скорость (GS) × 5.\n2. Для 140 узлов: разделите пополам (70) и умножьте на 10.';
      } else if (category?.includes('Hydraulic') || category?.includes('Pascal')) {
        fallback = '1. Закон Паскаля гласит: давление P = F1 / A1 передается равномерно во все точки замкнутой системы.\n2. Выходная сила F2 = P × A2. Определите отношение площадей поршней.';
      } else {
        fallback = '1. Сначала изолируйте физическую величину или нормативный пункт ICAO / EASA.\n2. Отбросьте экстремальные крайние значения и примените правило проверки размерностей.';
      }
    } else {
      if (category?.includes('Clearance') || category?.includes('Phraseology')) {
        fallback = 'Step 1: Identify all mandatory ICAO readback elements: Level/Altitude (FL290), Heading (060), and Reporting conditions (passing FL180).\nStep 2: Rule of thumb: Never alter an assigned heading or omit altitude clearances.';
      } else if (category?.includes('Math') || category?.includes('Descent')) {
        fallback = 'Step 1: Apply the 3° glidepath rule: Rate of Descent = Groundspeed × 5.\nStep 2: Mental math trick: Halve the groundspeed and append a zero (e.g., 140 / 2 = 70 → 700 fpm).';
      } else if (category?.includes('Hydraulic') || category?.includes('Pascal')) {
        fallback = 'Step 1: Pascal’s Principle: Fluid pressure P = F1 / A1 is equal at the output cylinder.\nStep 2: Calculate the mechanical advantage ratio (A2 / A1) and multiply by the input force.';
      } else {
        fallback = 'Step 1: Identify the governing principle or SOP constraint first.\nStep 2: Eliminate distractors that violate conservative airline safety limits or unit consistency.';
      }
    }

    return res.json({ hint: fallback });
  });

  // AI Instructor Endpoint: Post-Answer Deep Debrief
  app.post('/api/ai/debrief', async (req: Request, res: Response) => {
    try {
      const { questionText, options, selectedOption, correctOption, track, language = 'en' } = req.body;
      const client = getAiClient(req);

      if (client) {
        const langInstruction = language === 'ru'
          ? 'Provide the debrief in Russian (using standard aviation/EASA terminology in Russian with English acronyms where appropriate).'
          : 'Provide the debrief in English.';

        const systemPrompt = `You are an Air Astana Chief Pilot and Lead EASA Part-66 Technical Instructor.
Deliver a comprehensive post-question debrief for the candidate:
1. Explain WHY the correct option is technically/physically/grammatically sound.
2. Explain WHY the other distractors fail or what common cadet trap they represent.
3. Provide a practical mental shortcut or Air Astana operational rule-of-thumb (e.g., quick crosswind mental trigonometry, fuel reserve buffer, safety wire direction of pull).
4. State whether the candidate was correct or incorrect and give 1 tip for high-pressure testing.
${langInstruction}`;

        const prompt = `Candidate selected: "${selectedOption}"
Correct answer: "${correctOption}"
Question: "${questionText}"
All options: ${JSON.stringify(options)}
Program: ${track === 'ab-initio' ? 'Air Astana Ab-Initio Pilot Cadet' : 'Air Astana Apprentice EASA Part-66 Engineer'}`;

        const response = await withTimeout(
          client.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: { systemInstruction: systemPrompt },
          }),
          4000
        );

        if (response.text) {
          return res.json({ debrief: response.text });
        }
      }
    } catch (error: any) {
      console.warn('AI Debrief fallback:', error.message || error);
    }

    const { correctOption, selectedOption, language = 'en' } = req.body;
    const isMatch = selectedOption === correctOption;
    let debrief = '';

    if (language === 'ru') {
      debrief = `${isMatch ? '✓ Отличный выбор!' : 'Обратите внимание:'} Правильный ответ: "${correctOption}".
1. Анализ логики: Этот вариант строго соответствует эксплуатационным стандартам Air Astana и руководству ICAO / EASA Part-145.
2. Анализ дистракторов: Типичная ошибка на этапе отбора — спешка и невнимательность к ключевым ограничениям (например, разница между WARNING и CAUTION или пропуск одного из параметров readback).
3. Эксплуатационный совет: На скрининге Air Astana ценится четкость формулировок и мгновенная перепроверка контрольных цифр.`;
    } else {
      debrief = `${isMatch ? '✓ Verified Correct!' : 'Operational Debrief:'} The target answer is "${correctOption}".
1. Core Logic: Fully adheres to Air Astana Standard Operating Procedures and ICAO/EASA Annex compliance.
2. Distractor Trap: Common candidate trap involves jumping to the first plausible number without verifying all flight parameters or confusing warnings with cautions.
3. Cockpit/Hangar Habit: Always double-check units and maintain situational discipline under strict countdown timers.`;
    }

    return res.json({ debrief });
  });

  // AI Instructor Endpoint: Dynamic Question Generator
  app.post('/api/ai/generate-question', async (req: Request, res: Response) => {
    try {
      const { track, moduleType, category, difficulty = 'Medium' } = req.body;
      const client = getAiClient(req);

      if (client) {
        const systemPrompt = `You are the Air Astana Selection Board Examination Designer.
Generate a brand-new, realistic, high-standard assessment question for the ${track === 'ab-initio' ? 'Ab-Initio Cadet Pilot Program (SHL / COMPASS / ICAO English standards)' : 'Apprentice EASA Part-66 Engineer Program (EASA M1/M2/M3, AMM, SHL)'}.
Requirements:
- Strict English language for the question and options (matches real airline screening).
- Realistic figures (e.g., A320/A321neo fuel flows, KC callsigns, EASA Part-66 standards, real atmospheric or electrical values).
- 4 clear options with exactly ONE verifiably correct answer and 3 plausible distractors.
- Detailed step-by-step technical explanation.`;

        const prompt = `Generate 1 realistic ${difficulty} difficulty question for Track: ${track}, Module: ${moduleType}, Category: ${category || 'General Aptitude'}.`;

        const response = await withTimeout(
          client.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  contextPassage: { type: Type.STRING, description: 'Optional table data, NOTAM, AMM text, or scenario passage' },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswerIndex: { type: Type.INTEGER, description: '0-based index of correct option' },
                  explanation: { type: Type.STRING },
                  category: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  formulaShortcut: { type: Type.STRING, description: 'Speed calculation or mnemonic trick' },
                },
                required: ['question', 'options', 'correctAnswerIndex', 'explanation', 'category', 'difficulty'],
              },
            },
          }),
          4000
        );

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.question) {
          if (!parsed.id) parsed.id = `dyn-${Date.now()}`;
          return res.json({ question: parsed });
        }
      }
    } catch (error: any) {
      console.warn('AI Question Generator fallback:', error.message || error);
    }

    const generatedItems = [
      {
        id: `dyn-${Date.now()}-1`,
        question: 'An Air Astana Airbus A321neo burns fuel at an average rate of 2,400 kg/hr in cruise. If the aircraft departs Almaty with 9,200 kg and lands in Astana after 1 hour 45 minutes of flight, what is the landing fuel weight?',
        contextPassage: '1 hour 45 minutes = 1.75 hours.',
        options: ['4,800 kg', '5,000 kg', '5,200 kg', '5,500 kg'],
        correctAnswerIndex: 1,
        explanation: 'Burned = 2,400 * 1.75 = 4,200 kg. Landing Fuel = 9,200 - 4,200 = 5,000 kg.',
        category: 'SHL Numerical Reasoning',
        difficulty: 'Medium',
        formulaShortcut: '2,400 * 1 = 2,400. 2,400 * 0.75 = 1,800. 2,400 + 1,800 = 4,200. 9,200 - 4,200 = 5,000 kg.',
      },
      {
        id: `dyn-${Date.now()}-2`,
        question: 'In an aircraft DC electrical circuit operating at 28 Volts, two landing light filaments are wired in parallel. Filament 1 has a resistance of 7 Ohms, and Filament 2 has a resistance of 14 Ohms. What is the total circuit current draw?',
        contextPassage: 'Parallel Resistance: 1/R_total = 1/R1 + 1/R2.',
        options: ['4 Amps', '6 Amps', '8 Amps', '10 Amps'],
        correctAnswerIndex: 1,
        explanation: 'I1 = 28 / 7 = 4 A. I2 = 28 / 14 = 2 A. Total current I = I1 + I2 = 4 + 2 = 6 Amperes.',
        category: 'EASA M3 Electrical Fundamentals',
        difficulty: 'Medium',
        formulaShortcut: 'Branch currents: 28/7 = 4, 28/14 = 2. Total = 4 + 2 = 6 A.',
      },
      {
        id: `dyn-${Date.now()}-3`,
        question: 'Runway 23 (magnetic heading 230°) has a reported tower surface wind of 260° at 24 knots. What is the crosswind component acting on the aircraft on short final?',
        contextPassage: 'Angular difference = 260° - 230° = 30°.',
        options: ['8 knots', '12 knots', '16 knots', '21 knots'],
        correctAnswerIndex: 1,
        explanation: 'Angle difference = 30°. sin(30°) = 0.5. Crosswind = 24 * 0.5 = 12 knots.',
        category: 'COMPASS Speed Mental Math',
        difficulty: 'Medium',
        formulaShortcut: 'Rule of 60: 30° off runway heading corresponds to exactly 50% of the total wind speed (24 / 2 = 12 kts).',
      },
    ];

    const picked = generatedItems[Math.floor(Math.random() * generatedItems.length)];
    return res.json({ question: picked });
  });

  // AI Instructor Endpoint: Live Mock Interviewer (STAR Method)
  app.post('/api/ai/interview-eval', async (req: Request, res: Response) => {
    try {
      const { question, answer, track, competency } = req.body;
      const client = getAiClient(req);

      if (client) {
        const systemPrompt = `You are a Senior Air Astana Interview Board Member (Lead Captain / Chief Technical Officer alongside Air Astana Talent Acquisition).
Evaluate the candidate's interview answer using the STAR method:
- Situation (Context, environment)
- Task (Challenge, responsibility)
- Action (Specific proactive steps, Crew Resource Management / Teamwork, adherence to SOPs)
- Result (Quantified outcome, lessons learned)

Additionally, grade against Air Astana Core Values:
- Safety first without compromise
- Integrity and accountability
- Calm decision making under pressure
- Constructive communication / Speaking up (Assertiveness & Open Cockpit/Hangar Culture)`;

        const prompt = `Candidate Program: ${track === 'ab-initio' ? 'Air Astana Pilot Cadet (Ab-Initio)' : 'Air Astana EASA Part-66 Apprentice'}
Competency being tested: ${competency}
Interview Question: "${question}"
Candidate's Response: "${answer}"

Deliver a strict, constructive score (1 to 10) and comprehensive feedback.`;

        const response = await withTimeout(
          client.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  overallScore: { type: Type.INTEGER, description: 'Score out of 10' },
                  starScores: {
                    type: Type.OBJECT,
                    properties: {
                      situation: { type: Type.INTEGER, description: '1-10' },
                      task: { type: Type.INTEGER, description: '1-10' },
                      action: { type: Type.INTEGER, description: '1-10' },
                      result: { type: Type.INTEGER, description: '1-10' },
                    },
                    required: ['situation', 'task', 'action', 'result'],
                  },
                  airAstanaMindsetRating: { type: Type.STRING, description: 'Excellent / Good / Needs Development' },
                  strengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  areasForImprovement: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  executiveSummary: { type: Type.STRING },
                  modelAnswerRefinement: { type: Type.STRING, description: 'How an exemplary Air Astana candidate would structure this answer' },
                },
                required: ['overallScore', 'starScores', 'strengths', 'areasForImprovement', 'executiveSummary', 'modelAnswerRefinement'],
              },
            },
          }),
          4000
        );

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.overallScore) {
          return res.json(parsed);
        }
      }
    } catch (error: any) {
      console.warn('AI Interview fallback:', error.message || error);
    }

    const ans = (req.body.answer || '').toLowerCase();
    const hasSafety = ans.includes('safe') || ans.includes('sop') || ans.includes('checklist') || ans.includes('crm');
    const hasResult = ans.includes('result') || ans.includes('outcome') || ans.includes('debrief');
    const hasAction = ans.includes('action') || ans.includes('called') || ans.includes('spoke') || ans.includes('verified');

    const situationScore = ans.length > 50 ? 8 : 6;
    const taskScore = ans.length > 80 ? 8 : 7;
    const actionScore = hasAction ? 9 : 7;
    const resultScore = hasResult ? 8 : 6;
    const overall = Math.round((situationScore + taskScore + actionScore + resultScore) / 4);

    return res.json({
      overallScore: overall,
      starScores: {
        situation: situationScore,
        task: taskScore,
        action: actionScore,
        result: resultScore,
      },
      airAstanaMindsetRating: overall >= 8 ? 'Strong Safety Culture Alignment' : 'Solid Professional Foundation',
      strengths: [
        'Structured thinking following the STAR protocol',
        hasSafety ? 'Proactive adherence to Safety Management System (SMS) principles' : 'Clear professional terminology',
        'Demonstrates self-awareness under pressure',
      ],
      areasForImprovement: [
        'Include specific quantifiable metrics in the Result phase (e.g., flight turnaround time, exact altitude clearance, fuel saved)',
        'Emphasize two-way closed-loop communication (readback & hearback)',
      ],
      executiveSummary: 'Demonstrates good cockpit/hangar maturity and non-punitive safety reporting awareness. Focus on assertive communication without being confrontational.',
      modelAnswerRefinement: 'Refine your Result section by explaining how you documented the event or debriefed the team to prevent recurrence across the fleet.',
    });
  });

  // AI Instructor Endpoint: Weakness & Performance Analyzer
  app.post('/api/ai/weakness-analysis', async (req: Request, res: Response) => {
    try {
      const { stats, track, answeredCount } = req.body;
      const client = getAiClient(req);

      if (client) {
        const systemPrompt = `You are the Lead Air Astana Training Director.
Analyze the candidate's diagnostic assessment statistics and output a targeted training plan for their upcoming Air Astana screening exam.`;

        const prompt = `Candidate track: ${track}
Total Questions Completed: ${answeredCount}
Category breakdown & accuracy: ${JSON.stringify(stats)}

Provide a structured weakness diagnosis and actionable 3-step prescription.`;

        const response = await withTimeout(
          client.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  weakestDomain: { type: Type.STRING },
                  strongestDomain: { type: Type.STRING },
                  readinessIndexPercentage: { type: Type.INTEGER },
                  diagnosticNotes: { type: Type.STRING },
                  recommendedModuleId: { type: Type.STRING },
                  actionSteps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  airAstanaTip: { type: Type.STRING },
                },
                required: ['weakestDomain', 'strongestDomain', 'readinessIndexPercentage', 'diagnosticNotes', 'recommendedModuleId', 'actionSteps', 'airAstanaTip'],
              },
            },
          }),
          4000
        );

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.weakestDomain) {
          return res.json(parsed);
        }
      }
    } catch (error: any) {
      console.warn('AI Weakness fallback:', error.message || error);
    }

    const { track } = req.body;
    return res.json({
      weakestDomain: track === 'ab-initio' ? 'Speed Mental Math (ROD / Fuel / Wind)' : 'EASA M3 Electrical Circuits',
      strongestDomain: track === 'ab-initio' ? 'Aviation English & ATC Phraseology' : 'AMM Technical Procedures & Warnings',
      readinessIndexPercentage: 79,
      diagnosticNotes: track === 'ab-initio'
        ? 'Strong grasp of ICAO phraseology and NOTAM reading. Rapid mental arithmetic (ROD = GS x 5, 3:1 descent slope) under 20-second countdown needs further drill to prevent cognitive saturation in the simulator.'
        : 'Good adherence to AMM safety warnings. Mechanical and electrical Ohm calculations require rapid branch analysis without calculator dependence.',
      recommendedModuleId: track === 'ab-initio' ? 'cognitive' : 'psychometrics',
      actionSteps: [
        'Drill Rate of Descent (ROD = GS x 5) until mental calculation is instantaneous (< 3 seconds)',
        'Practice Rule of 60 mental trigonometry for crosswind components (30° = 50%, 45° = 70%, 60° = 85%)',
        'Review EASA Part-66 Module 3 Ohm’s Law and parallel resistance formulas',
      ],
      airAstanaTip: 'Air Astana selection board tests emphasize immediate verbal confidence. Hesitating on mental math signals cognitive overload.',
    });
  });

  // AI Endpoint: Aviation Fact & Theory Generator
  app.post('/api/ai/fact', async (req: Request, res: Response) => {
    try {
      const { track, category } = req.body;
      const client = getAiClient(req);

      if (client) {
        const systemPrompt = `You are a Senior Air Astana Flight & Technical Training Captain.
Generate 1 ultra-interesting, practical aviation fact or technical theory nugget for an ${track === 'ab-initio' ? 'Ab-Initio Pilot Cadet' : 'EASA Part-66 Apprentice Engineer'} candidate at Air Astana.
Include the practical operational principle and why it matters during real flight operations or hangar maintenance.
Keep the explanation clear, engaging, and maximum 3 sentences in Russian.
Also generate a category tag in English (e.g., "✈️ Aerodynamics & Speed", "🌤️ Meteorology & ATC", "🔧 EASA Part-66 Tech", "⚙️ Jet Engine & Turbofans") and a short title.`;

        const prompt = `Generate 1 fresh aviation fact for ${track} track in category: ${category || 'random'}.`;

        const response = await withTimeout(
          client.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  snippet: { type: Type.STRING },
                  deepTheory: { type: Type.STRING },
                  blitzQuestion: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                    },
                    required: ['question', 'options', 'correctIndex', 'explanation'],
                  },
                },
                required: ['category', 'title', 'snippet', 'deepTheory', 'blitzQuestion'],
              },
            },
          }),
          4000
        );

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.snippet) {
          return res.json({ fact: parsed });
        }
      }
    } catch (e: any) {
      console.warn('AI Fact fallback:', e.message || e);
    }

    const { track } = req.body;
    if (track === 'ab-initio') {
      return res.json({
        fact: {
          category: '✈️ Pilot Fact & Aerodynamics',
          title: 'Эффект сжимаемости и число Маха (Critical Mach)',
          snippet: 'При приближении к скорости звука поток воздуха над верхней поверхностью крыла разгоняется быстрее скорости самого лайнера. Достижение локальной скорости M=1.0 вызывает волновое сопротивление (wave drag) и бафтинг.',
          deepTheory: 'На современных лайнерах Air Astana A320neo и Boeing 767 используется стреловидное крыло и сверхкритический профиль, чтобы отодвинуть критическое число Маха (M_crit) до M=0.82-0.86.',
          blitzQuestion: {
            question: 'What aerodynamic feature on modern airliners delays the onset of supersonic shockwaves over the upper wing surface?',
            options: ['Thicker cambered airfoil', 'Supercritical swept-back wing profile', 'Fixed trailing-edge slats', 'Symmetrical non-cambered fin'],
            correctIndex: 1,
            explanation: 'Сверхкритический профиль и стреловидность уменьшают ускорение потока над крылом, сдвигая появление скачка уплотнения к более высоким числам Маха.',
          },
        },
      });
    }

    return res.json({
      fact: {
        category: '🔧 EASA Part-66 Tech',
        title: 'Управление моментом затяжки и калибровка ключей',
        snippet: 'При использовании насадок-удлинителей на динамометрическом ключе эффективное плечо рычага увеличивается. Если не пересчитать заданный момент по формуле S = T * [L / (L + E)], болт будет критически перетянут.',
        deepTheory: 'В авиации превышение крутящего момента ведет к пластической деформации резьбы и усталостному разрушению крепежа под циклической вибрацией двигателя или планера.',
        blitzQuestion: {
          question: 'If an extension is attached inline to a torque wrench, what happens to the actual torque applied to the fastener if the handle setting is unchanged?',
          options: ['Applied torque decreases', 'Applied torque increases significantly', 'Applied torque remains exactly identical', 'Only shear stress is affected'],
          correctIndex: 1,
          explanation: 'Удлинитель увеличивает плечо силы (L+E), поэтому реальный момент на гайке оказывается больше установленного на шкале ключа.',
        },
      },
    });
  });


  // Production static file serving or Dev Vite mounting
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Air Astana Cadet & Apprentice Prep Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
