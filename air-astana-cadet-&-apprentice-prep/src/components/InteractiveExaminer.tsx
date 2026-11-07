import React, { useState, useEffect } from 'react';
import {
  Brain,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Send,
  Zap,
  Target,
  Plane,
  Wrench,
  Flame,
} from 'lucide-react';
import { ProgramTrack } from '../types';

interface ExaminerQuestion {
  id: string;
  category: string;
  timeLimit: number;
  questionEn: string;
  options: string[];
  correctIndex: number;
  latexFormula: string;
  mentalShortcutRu: string;
  trapsAnalysisRu: string;
  airAstanaContextRu: string;
}

const EXAMINER_QUESTIONS_BANK: Record<ProgramTrack, Record<string, ExaminerQuestion[]>> = {
  'ab-initio': {
    'compass-math': [
      {
        id: 'ex-ab-1',
        category: 'COMPASS Mental Math (Rate of Descent)',
        timeLimit: 25,
        questionEn: 'An Airbus A321neo is descending on a standard 3-degree glideslope with a groundspeed (GS) of 150 knots. What is the required Rate of Descent (ROD) in feet per minute to stay exactly on path?',
        options: ['650 fpm', '700 fpm', '750 fpm', '850 fpm'],
        correctIndex: 2,
        latexFormula: 'ROD = GS \\times 5 \\quad \\text{or} \\quad ROD = \\frac{GS}{2} \\times 10',
        mentalShortcutRu: 'Ментальный лайфхак без калькулятора: Делим путевую скорость пополам и приписываем ноль: 150 / 2 = 75 → 750 фут/мин.',
        trapsAnalysisRu: 'Ловушка кандидатов: Попытка умножить 150 на 5 в лоб столбиком тратит драгоценные секунды. При 20-секундном лимите на COMPASS устный счет через деление на 2 экономит 80% времени.',
        airAstanaContextRu: 'Standard Operating Procedures (SOP) Air Astana для захода ILS требуют стабилизированного снижения на 1000 футах при IMC и 500 футах при VMC. Отклонение вертикальной скорости более 1000 фпм инициирует обязательный Go-Around.',
      },
      {
        id: 'ex-ab-2',
        category: 'COMPASS Mental Math (3:1 Top of Descent)',
        timeLimit: 35,
        questionEn: 'Cruising at FL340, Air Traffic Control clears Astana 214 to descend to 4,000 ft. Applying the standard airline 3:1 descent profile rule of thumb, at what distance from the fix must Top of Descent (TOD) be initiated?',
        options: ['90 NM', '100 NM', '110 NM', '125 NM'],
        correctIndex: 1,
        latexFormula: '\\text{Distance (NM)} = \\frac{\\Delta \\text{Altitude (ft)}}{300} = (\\text{FL to lose}) \\times 3',
        mentalShortcutRu: 'Ментальный лайфхак: Теряем 34 000 - 4 000 = 30 000 футов (30 сотен). Умножаем 30 на 3 = 90 NM. Добавляем 10 NM на гашение скорости с 300 до 250 узлов ниже FL100 → 100 NM.',
        trapsAnalysisRu: 'Ловушка: Забыть прибавить запас на торможение (~10 NM для гашения 50 узлов приборной скорости). Выбор "90 NM" оставит самолет слишком высоким и быстрым на подходе.',
        airAstanaContextRu: 'Профиль захода Continuous Descent Approach (CDA) в аэропорту Астаны (NQZ) позволяет экономить до 150 кг топлива на один рейс Airbus A321LR при своевременном расчете TOD.',
      },
      {
        id: 'ex-ab-3',
        category: 'COMPASS Spatial (Crosswind Trigonometry)',
        timeLimit: 30,
        questionEn: 'Runway in use is 22 (magnetic heading 220°). Tower reports wind 250° at 28 knots. What is the approximate crosswind component acting perpendicular to the landing gear?',
        options: ['10 knots', '14 knots', '20 knots', '24 knots'],
        correctIndex: 1,
        latexFormula: 'V_{\\text{cross}} = V_{\\text{wind}} \\times \\sin(\\Delta \\theta) \\approx 28 \\times \\sin(30^\\circ) = 28 \\times 0.5 = 14 \\text{ kts}',
        mentalShortcutRu: 'Правило 60 (Rule of 60): Разница углов = 250° - 220° = 30°. Запомните пропорции: 30° = 50% ветра; 45° = 70% ветра; 60° = 90% ветра. 28 × 0.5 = 14 узлов.',
        trapsAnalysisRu: 'Ловушка: Пытаться вычислять синус в уме. На отборе пилотов авиалинии ожидают мгновенного применения правила 30° = половина.',
        airAstanaContextRu: 'Максимальный лимит бокового ветра для сухого покрытия на A320neo составляет 38 узлов (включая порывы). Знание точной составляющей определяет безопасность посадки в условиях зимней Астаны.',
      },
    ],
    'shl-numerical': [
      {
        id: 'ex-ab-shl-1',
        category: 'SHL Numerical (Fuel Burn Ratio)',
        timeLimit: 45,
        questionEn: 'Flight KC-952 from Almaty to Dubai has a trip fuel requirement of 7,200 kg. Airline dispatch policy requires: Contingency 5% of trip, Alternate fuel 1,400 kg, and Final Reserve 1,100 kg. What is the minimum required block dispatch fuel?',
        options: ['9,700 kg', '10,060 kg', '10,360 kg', '10,700 kg'],
        correctIndex: 1,
        latexFormula: 'F_{\\text{dispatch}} = F_{\\text{trip}} + (0.05 \\times F_{\\text{trip}}) + F_{\\text{alt}} + F_{\\text{reserve}}',
        mentalShortcutRu: 'Быстрый подсчет: 5% от 7200 = 720 / 2 = 360 кг. Суммируем крупные числа: 7200 + 1400 = 8600. 8600 + 1100 = 9700. 9700 + 360 = 10,060 кг.',
        trapsAnalysisRu: 'Ловушка SHL: Вариант "9,700 kg" получен кандидатами, забывшими посчитать 5% Contingency fuel.',
        airAstanaContextRu: 'Air Astana выполняет международные полеты по нормам EASA CAT.OP.MPA.180, где 5% Contingency или 5-минутный холдинг обязательны к заправке.',
      },
    ],
  },
  'apprentice': {
    'tech-mechanics': [
      {
        id: 'ex-app-1',
        category: 'EASA M2 Physics (Pascal Hydraulic Force)',
        timeLimit: 40,
        questionEn: 'In an aircraft emergency brake accumulator system, a hydraulic pump delivers 120 N of force onto an input piston of area 4 cm². The brake actuator piston has an effective surface area of 36 cm². What clamping force is generated at the brake discs?',
        options: ['480 N', '960 N', '1,080 N', '1,440 N'],
        correctIndex: 2,
        latexFormula: 'P = \\frac{F_1}{A_1} = \\frac{F_2}{A_2} \\implies F_2 = F_1 \\times \\left(\\frac{A_2}{A_1}\\right)',
        mentalShortcutRu: 'Коэффициент гидравлического выигрыша: 36 / 4 = 9. Умножаем силу: 120 × 9 = 1080 Н (120 × 10 - 120 = 1200 - 120 = 1080 Н).',
        trapsAnalysisRu: 'Ловушка: Деление вместо умножения (120 / 9) или путаница между диаметром и площадью поршня.',
        airAstanaContextRu: 'В тормозной системе Airbus A320 давление гидросистемы Green/Yellow достигает 3000 psi (206 бар). Утечки в узлах B-nut приводят к немедленному AOG.',
      },
      {
        id: 'ex-app-2',
        category: 'EASA M3 Electrical (Ohm & Power Dissipation)',
        timeLimit: 30,
        questionEn: 'A pitot tube heating element on an Airbus A321 operates on the 28V DC bus. If the element draws 7 Amperes of current under anti-ice operation, what is its internal electrical resistance and dissipated heating power?',
        options: ['R = 4 Ω, P = 196 W', 'R = 3.5 Ω, P = 140 W', 'R = 4 Ω, P = 224 W', 'R = 2.5 Ω, P = 280 W'],
        correctIndex: 0,
        latexFormula: 'R = \\frac{V}{I} = \\frac{28}{7} = 4\\, \\Omega, \\quad P = V \\times I = 28 \\times 7 = 196\\, \\text{W}',
        mentalShortcutRu: 'Прикидочный расчет: 28 / 7 = ровно 4 Ом. Мощность: 28 × 7 = (30 - 2) × 7 = 210 - 14 = 196 Вт.',
        trapsAnalysisRu: 'Ловушка: Ошибка при расчете мощности по формуле P = I² * R (49 * 4 = 196 Вт), путая со значением 224 Вт.',
        airAstanaContextRu: 'Отказ обогрева датчиков ПВД (Pitot Probes) зимой в Астане при температурах до -35°C приводит к ненадежным показаниям скорости (Unreliable Airspeed) и переходу в Alternate Law.',
      },
    ],
  },
};

interface InteractiveExaminerProps {
  track: ProgramTrack;
  onTrackChange: (t: ProgramTrack) => void;
}

export const InteractiveExaminer: React.FC<InteractiveExaminerProps> = ({
  track,
  onTrackChange,
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('compass-math');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [sessionScore, setSessionScore] = useState(0);

  const availableSections = track === 'ab-initio'
    ? [
        { key: 'compass-math', label: 'COMPASS Mental Math & Flight Physics' },
        { key: 'shl-numerical', label: 'SHL Numerical & Dispatch Tables' },
      ]
    : [
        { key: 'tech-mechanics', label: 'EASA M2/M3 Mechanics & Electrical' },
      ];

  const currentQuestions = EXAMINER_QUESTIONS_BANK[track]?.[selectedSection] ||
    EXAMINER_QUESTIONS_BANK['ab-initio']['compass-math'];
  const activeQ = currentQuestions[questionIndex] || currentQuestions[0];

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(activeQ?.timeLimit || 30);
  }, [questionIndex, selectedSection, track]);

  useEffect(() => {
    if (isAnswered) return;
    if (timeLeft <= 0) {
      setIsAnswered(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isAnswered]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === activeQ.correctIndex) {
      setSessionScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (questionIndex + 1 < currentQuestions.length) {
      setQuestionIndex((i) => i + 1);
    } else {
      setQuestionIndex(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Liquid Glass Header for Trainer Mode */}
      <div className="liquid-glass p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-[#E0B85C]/20 text-[#E0B85C] border border-[#E0B85C]/40 text-xs font-mono-avionics font-bold">
                AIR ASTANA RIGOROUS EXAMINER
              </span>
              <span className="text-xs text-white/60 font-mono-avionics">
                INTERACTIVE STEP-BY-STEP TRAINER
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-cockpit text-slate-900 tracking-wide">
              {track === 'ab-initio' ? 'Ab-Initio Pilot Cadet Intensive' : 'Apprentice EASA Part-66 Intensive'}
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed">
              Тестовые вопросы — строго на <strong>английском языке</strong> (формат реального экзамена). Разбор ловушек, ментальные лайфхаки быстрого счета в уме и формулы в LaTeX — на <strong>русском языке</strong>.
            </p>
          </div>

          {/* Section Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {availableSections.map((sec) => (
              <button
                key={sec.key}
                onClick={() => {
                  setSelectedSection(sec.key);
                  setQuestionIndex(0);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-cockpit font-bold uppercase tracking-wider transition-all border ${
                  selectedSection === sec.key
                    ? 'liquid-glass-pill-active'
                    : 'liquid-glass-nested text-slate-700 hover:text-slate-900 border-white/80'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Question Card with Liquid Glass specular styling */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-4">
          <div className="liquid-glass p-5 relative border border-white/90 shadow-sm">
            {/* Top countdown & item bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/80 text-xs font-mono-avionics">
              <div className="flex items-center gap-2">
                <span className="text-amber-600 font-bold">{activeQ.category}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">
                  Target {questionIndex + 1} of {currentQuestions.length}
                </span>
              </div>

              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-bold ${
                  timeLeft <= 5
                    ? 'bg-rose-500/25 border-rose-400 text-rose-700 animate-pulse'
                    : 'liquid-glass-nested text-blue-700 border-white/80'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>⏱ {timeLeft}s</span>
              </div>
            </div>

            {/* English Question Statement */}
            <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed mb-5">
              {activeQ.questionEn}
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {activeQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === activeQ.correctIndex;

                let optClass = 'liquid-glass-nested border-white/80 hover:bg-white/70 text-slate-800';
                if (isAnswered) {
                  if (isCorrect) {
                    optClass = 'bg-emerald-500 text-white border-emerald-400 font-bold shadow-md';
                  } else if (isSelected) {
                    optClass = 'bg-rose-500 text-white border-rose-400';
                  } else {
                    optClass = 'opacity-40 liquid-glass-nested border-slate-200 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs font-mono-avionics transition-all flex items-center justify-between ${optClass}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${isCorrect && isAnswered ? 'bg-white text-emerald-700' : 'liquid-glass-nested text-slate-600'}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xs sm:text-sm font-medium">{opt}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Post-Answer Examiner Verdict */}
            {isAnswered && (
              <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    {selectedOption === activeQ.correctIndex ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-cockpit font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ВЕРНО • AIR ASTANA STANDARD
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-cockpit font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> НЕВЕРНО ИЛИ ВРЕМЯ ИСТЕКЛО
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    className="px-4 py-2 rounded-xl liquid-glass-pill-active font-cockpit font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5 shadow-sm hover:brightness-105 active:scale-95 transition-all"
                  >
                    <span>Следующая задача</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* LaTeX Formula Block */}
                <div className="liquid-glass-nested p-3.5 space-y-1">
                  <span className="text-[10px] font-mono-avionics text-blue-700 uppercase font-bold block">
                    📐 Физико-математическая формула (LaTeX):
                  </span>
                  <div className="font-mono-avionics text-xs text-blue-900 bg-white/80 p-2.5 rounded-xl border border-blue-100 overflow-x-auto font-semibold">
                    {activeQ.latexFormula}
                  </div>
                </div>

                {/* Mental Math Shortcut */}
                <div className="liquid-glass-nested p-3.5 space-y-1 border-amber-300/80 bg-amber-50/50">
                  <span className="text-[10px] font-mono-avionics text-amber-800 uppercase font-bold block flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Быстрый способ решения в уме (Mental Shortcut):</span>
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-mono-avionics">
                    {activeQ.mentalShortcutRu}
                  </p>
                </div>

                {/* Traps Analysis */}
                <div className="liquid-glass-nested p-3.5 space-y-1 border-rose-200/80 bg-rose-50/50">
                  <span className="text-[10px] font-mono-avionics text-rose-700 uppercase font-bold block">
                    ⚠️ Разбор ловушек экзаменаторов:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono-avionics">
                    {activeQ.trapsAnalysisRu}
                  </p>
                </div>

                {/* Air Astana Operational SOP Context */}
                <div className="liquid-glass-nested p-3.5 space-y-1 border-blue-200/80 bg-blue-50/50">
                  <span className="text-[10px] font-mono-avionics text-blue-700 uppercase font-bold block flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-blue-600" />
                    <span>Операционный контекст Air Astana (A320/A321LR/B767/B787):</span>
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono-avionics">
                    {activeQ.airAstanaContextRu}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Screening Rules Panel */}
        <div className="liquid-glass p-4 space-y-2 border border-white/90 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-cockpit text-blue-700 font-bold uppercase tracking-wider">
            <Brain className="w-4 h-4 text-blue-600" />
            <span>Правила отбора Air Astana</span>
          </div>
          <ul className="space-y-1.5 text-xs font-mono-avionics text-slate-700">
            <li className="flex items-start gap-2 liquid-glass-nested p-2 rounded-xl">
              <span className="text-blue-600 font-bold">1.</span>
              <span>На экзамене COMPASS калькулятор и черновики <strong>запрещены</strong>.</span>
            </li>
            <li className="flex items-start gap-2 liquid-glass-nested p-2 rounded-xl">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Лимит времени на вопрос — 20–45 секунд. Медленный ответ приравнивается к незачету.</span>
            </li>
            <li className="flex items-start gap-2 liquid-glass-nested p-2 rounded-xl">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Используйте прикидочный счет (Estimation) и округляйте промежуточные числа.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

