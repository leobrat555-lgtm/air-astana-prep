export type LanguageMode = 'ru' | 'en';

export const translations = {
  ru: {
    // Brand & Tracks
    appTitle: 'Air Astana Selection Suite',
    trackA: 'Трек А: Пилот Ab-Initio',
    trackB: 'Трек Б: Инженер Apprentice',
    trackAShort: 'Ab-Initio',
    trackBShort: 'Apprentice',
    cadetPilot: 'Пилоты (Cadet)',
    easaEngineer: 'Инженеры (EASA)',
    academySubtitlePilot: 'Готовимся к Ab-Initio Cadet Pilot • Шаг за шагом к заветной цели',
    academySubtitleEng: 'Готовимся к EASA Part-66 Apprentice • Шаг за шагом к заветной цели',
    candidate: 'Кандидат',

    // Status & Weather
    offlineBadge: 'Офлайн-режим (500+)',
    offlineBadgeShort: 'Офлайн (500+)',
    aiActiveBadge: 'ИИ-инструктор активен',
    aiActiveBadgeShort: 'ИИ активен',
    windSpeed: 'Скорость ветра',
    kts: 'узлов',
    hubCode: '📍 ALA / UAAA',

    // Greetings
    goodMorning: 'Доброе утро',
    goodAfternoon: 'Добрый день',
    goodEvening: 'Добрый вечер',
    goodNight: 'Доброй ночи',

    // Nav
    navHome: 'Главная',
    navStages: 'Этапы',
    navTrainer: 'Тренер',
    navTests: 'Тесты',
    navInterview: 'Интервью',

    // Header Controls & Telemetry
    accuracy: 'Точность',
    streak: 'Серия',
    openAiInstructor: 'Открыть ИИ-Инструктора',
    settingsTitle: 'Настройки ключа API и профиля',
    editProfile: 'Редактировать профиль и ключ',
    langToggle: 'Язык',

    // Discovery Hub
    factPilotTag: '✈️ Факт дня: Пилоты и Аэродинамика',
    factEngTag: '🔧 Факт дня: Инженерия EASA Part-66',
    nextFact: 'Следующий факт',
    aiFactBtn: '✨ Новый ИИ-Факт',
    discussAi: 'Разобрать с ИИ',
    blitzBtn: '⚡ Блиц-вопрос',
    blitzTitle: 'Проверка знаний:',
    correctStandard: '✓ Верно! Air Astana Standard',
    incorrectStandard: '✗ Ошибка. Запомните этот принцип!',

    // Dashboard Telemetry
    statAccuracy: 'Точность',
    statAccuracyWait: 'Ждем первых ответов',
    statAvgTime: 'Ср. время',
    statAvgTimeNorm: 'Норматив: < 25.0 сек',
    statAnswered: 'Решено задач',
    statBankTotal: 'Банк: 500+ задач',
    statStatus: 'Статус отбора',
    statStatusValue: 'START',
    statStatusDesc: 'Air Astana Screening',

    // Readiness Curve & Categories
    progressTitle: 'Динамика прогресса кандидата',
    progressSubtitle: 'Кривая подготовки к скринингу',
    progressTarget: 'Цель: 80%+',
    toTrainerBtn: 'В тренажер тестов',
    passingTarget: 'Проходной балл:',
    catEnglish: 'Aviation English Lab',
    catNumerical: 'SHL Numerical Reasoning',
    catVerbal: 'SHL Verbal Reasoning (T/F/CS)',
    catPhysics: 'Mechanical & EASA Physics',
    catMath: 'ADAPT / COMPASS Speed Math',
    catInterview: 'STAR Interview & Safety Culture',

    // AI Diagnostics Card
    aiDiagTitle: 'ИИ-Диагностика слабых мест',
    aiDiagRunBtn: 'Проверить готовность',
    aiDiagRunning: 'Анализ протокола...',
    aiDiagEmpty: 'Нажмите кнопку «Проверить готовность», чтобы запустить алгоритм анализа ошибок по стандартам отбора Air Astana.',
    weakDomain: 'Зона роста:',
    strongDomain: 'Сильная сторона:',
    recModule: 'Рекомендованный модуль:',
    readinessScore: 'Индекс готовности к отбору:',
    airAstanaTipLabel: 'Совет экзаменатора Air Astana:',

    // Assessment Runner
    questionCounter: 'Вопрос',
    ofTotal: 'из',
    hintBtn: '💡 Подсказка',
    hintRequest: 'Запрос Сократовской подсказки...',
    hintTitle: '💡 Сократовская подсказка Инструктора',
    timeRemaining: 'Время',
    secondsShort: 'сек',
    correctAnswer: 'Верно • Стандарт Air Astana',
    incorrectAnswer: 'Ошибка или время истекло',
    correctTarget: 'Правильный ответ:',
    shortcutLabel: 'Лайфхак для быстрого счета:',
    debriefAiBtn: '✨ Разбор полета с ИИ',
    nextQuestionBtn: 'Следующий вопрос →',
    completeSessionBtn: 'Завершить сессию',
    summaryTitle: 'Итоги тренировочной сессии',
    summaryScore: 'Ваш результат:',
    summaryPassed: '✓ Рекомендован к следующему этапу отбора',
    summaryNeedsWork: '⚠️ Требуется дополнительная подготовка',
    restartModuleBtn: 'Пройти модуль заново',
    newBatchBtn: 'Сгенерировать 500+ задач',
    socraticBoxTitle: 'Сократовское наставничество',
    socraticBoxDesc: 'Затрудняетесь с формулой или переводом? Запросите подсказку — ИИ направит ход мыслей, не раскрывая ответ.',
    criteriaBoxTitle: 'Критерии отбора Air Astana',
    crit1: 'Вопросы строго на английском языке (формат реального тестирования).',
    crit2: 'Калькуляторы запрещены на модулях COMPASS и устного счета.',
    crit3: 'Правило 60: 1 градус отклонения = 1 миля на 60 миль полета.',

    // Settings Modal
    settingsModalTitle: 'Настройки и ИИ-Инструктор',
    candidateNameLabel: 'Имя кандидата',
    candidateNamePlaceholder: 'Ваше имя',
    programTrackLabel: 'Программа подготовки',
    apiKeyLabel: 'Персональный Gemini API Key',
    getKeyLink: 'Получить бесплатный ключ',
    keyPlaceholder: 'Вставьте ключ AIzaSy...',
    testKeyBtn: 'Проверить ключ',
    testingKey: 'Проверка...',
    removeKeyBtn: 'Удалить ключ',
    keyPrivacyNotice: 'Ключ хранится исключительно в локальном браузере телефона и не передается третьим лицам.',
    saveSettingsBtn: 'Сохранить настройки',

    // Onboarding Modal
    onboardWelcome: 'Добро пожаловать в тренажер Air Astana ✈️',
    onboardStep1Title: 'Как к тебе обращаться во время подготовки?',
    onboardStep1Sub: 'Укажите позывной или имя для протоколов оценки:',
    onboardNamePlaceholder: 'Например: Арман или Данияр',
    onboardTargetTrack: 'Целевая программа отбора',
    onboardNextStep: 'Далее: Настройка ИИ →',
    onboardStep2Title: 'Подключи личного ИИ-инструктора ✈️',
    onboardStep2Desc: 'С бесплатным ключом открывается живой Сократовский разбор ошибок, неограниченная генерация вопросов и симулятор финального интервью.',
    onboardGuideTitle: 'Быстрое подключение за 1 минуту:',
    onboardGuideStep1: 'Получите бесплатный ключ на',
    onboardGuideStep2: 'Скопируйте сгенерированный ключ и вставьте в поле ниже:',
    onboardActivateBtn: 'Активировать ИИ-инструктора',
    onboardSkipBtn: 'Продолжить без ИИ (базовый режим)',

    // Stages Roadmap
    stagesTitle: 'Этапы отбора в Air Astana',
    stagesSubtitle: 'Официальный регламент прохождения конкурсного отбора',
    stage1Name: '1. Пре-скрининг и документы',
    stage2Name: '2. Тестирование по английскому',
    stage3Name: '3. Психометрия и SHL',
    stage4Name: '4. ADAPT / COMPASS или Тест механики',
    stage5Name: '5. ВЛЭК (Медицинская комиссия)',
    stage6Name: '6. Симулятор полета / Практика',
    stage7Name: '7. Финальное интервью и кейсы',

    // Interview Sandbox
    interviewTitle: 'Симулятор финального интервью и кейсов',
    interviewSubtitle: 'Оценка ответов по методологии STAR и культуре безопасности Air Astana',
    starS: 'S - СИТУАЦИЯ (Контекст, рейс или регламент)',
    starT: 'T - ЗАДАЧА (Конкретная дилемма или угроза безопасности)',
    starA: 'A - ДЕЙСТВИЕ (Проактивные шаги, коммуникация Two-Challenge Rule)',
    starR: 'R - РЕЗУЛЬТАТ (Измеримый итог, извлеченные уроки)',
    submitInterviewBtn: 'Отправить ответ на оценку ИИ-Комиссии',
  },
  en: {
    // Brand & Tracks
    appTitle: 'Air Astana Selection Suite',
    trackA: 'Track A: Pilot Ab-Initio',
    trackB: 'Track B: Engineer Apprentice',
    trackAShort: 'Ab-Initio',
    trackBShort: 'Apprentice',
    cadetPilot: 'Cadet Pilots',
    easaEngineer: 'EASA Engineers',
    academySubtitlePilot: 'Preparing for Ab-Initio Cadet Pilot • Step by step to the cockpit',
    academySubtitleEng: 'Preparing for EASA Part-66 Apprentice • Step by step to the hangar',
    candidate: 'Candidate',

    // Status & Weather
    offlineBadge: 'Offline Mode (500+)',
    offlineBadgeShort: 'Offline (500+)',
    aiActiveBadge: 'AI Instructor Active',
    aiActiveBadgeShort: 'AI Active',
    windSpeed: 'Wind speed',
    kts: 'kts',
    hubCode: '📍 ALA / UAAA',

    // Greetings
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    goodNight: 'Good night',

    // Nav
    navHome: 'Home',
    navStages: 'Stages',
    navTrainer: 'Trainer',
    navTests: 'Tests',
    navInterview: 'Interview',

    // Header Controls & Telemetry
    accuracy: 'Accuracy',
    streak: 'Streak',
    openAiInstructor: 'Open AI Instructor',
    settingsTitle: 'API Key & Profile Settings',
    editProfile: 'Edit Profile & Key',
    langToggle: 'Language',

    // Discovery Hub
    factPilotTag: '✈️ Fact of the Day: Pilots & Aerodynamics',
    factEngTag: '🔧 Fact of the Day: EASA Part-66 Engineering',
    nextFact: 'Next Fact',
    aiFactBtn: '✨ New AI Fact',
    discussAi: 'Debrief with AI',
    blitzBtn: '⚡ Blitz Question',
    blitzTitle: 'Knowledge Check:',
    correctStandard: '✓ Correct! Air Astana Standard',
    incorrectStandard: '✗ Incorrect. Keep this principle in mind!',

    // Dashboard Telemetry
    statAccuracy: 'Accuracy',
    statAccuracyWait: 'Awaiting first responses',
    statAvgTime: 'Avg Time',
    statAvgTimeNorm: 'Target: < 25.0 sec',
    statAnswered: 'Completed',
    statBankTotal: 'Bank: 500+ questions',
    statStatus: 'Screening Status',
    statStatusValue: 'START',
    statStatusDesc: 'Air Astana Screening',

    // Readiness Curve & Categories
    progressTitle: 'Candidate Readiness Dynamics',
    progressSubtitle: 'Preparation curve for Air Astana screening',
    progressTarget: 'Target: 80%+',
    toTrainerBtn: 'Open Practice Labs',
    passingTarget: 'Passing score:',
    catEnglish: 'Aviation English Lab',
    catNumerical: 'SHL Numerical Reasoning',
    catVerbal: 'SHL Verbal Reasoning (T/F/CS)',
    catPhysics: 'Mechanical & EASA Physics',
    catMath: 'ADAPT / COMPASS Speed Math',
    catInterview: 'STAR Interview & Safety Culture',

    // AI Diagnostics Card
    aiDiagTitle: 'AI Weakness & Risk Diagnostics',
    aiDiagRunBtn: 'Evaluate Readiness',
    aiDiagRunning: 'Analyzing test record...',
    aiDiagEmpty: 'Click "Evaluate Readiness" to run diagnostic analysis based on official Air Astana selection benchmarks.',
    weakDomain: 'Growth Area:',
    strongDomain: 'Top Strength:',
    recModule: 'Recommended Module:',
    readinessScore: 'Overall Readiness Score:',
    airAstanaTipLabel: 'Air Astana Selection Board Tip:',

    // Assessment Runner
    questionCounter: 'Question',
    ofTotal: 'of',
    hintBtn: '💡 Hint',
    hintRequest: 'Requesting Socratic guidance...',
    hintTitle: '💡 Instructor Socratic Guidance',
    timeRemaining: 'Time',
    secondsShort: 'sec',
    correctAnswer: 'Correct • Air Astana Standard',
    incorrectAnswer: 'Incorrect or Time Expired',
    correctTarget: 'Correct Answer:',
    shortcutLabel: 'Mental Shortcut / Rule of Thumb:',
    debriefAiBtn: '✨ Flight Debrief with AI',
    nextQuestionBtn: 'Next Question →',
    completeSessionBtn: 'Complete Session',
    summaryTitle: 'Training Session Summary',
    summaryScore: 'Your Score:',
    summaryPassed: '✓ Recommended for next screening stage',
    summaryNeedsWork: '⚠️ Additional targeted preparation required',
    restartModuleBtn: 'Retry Module',
    newBatchBtn: 'Generate 500+ Tasks',
    socraticBoxTitle: 'Socratic Mentorship',
    socraticBoxDesc: 'Stuck on variables or terminology? Request a hint — the AI guides your reasoning without spoiling the solution.',
    criteriaBoxTitle: 'Air Astana Selection Criteria',
    crit1: 'Questions are strictly in English (exact real-world screening format).',
    crit2: 'No calculators allowed during official COMPASS and mental math tests.',
    crit3: 'Rule of 60: 1 degree off course = 1 NM off per 60 NM flown.',

    // Settings Modal
    settingsModalTitle: 'Settings & AI Instructor',
    candidateNameLabel: 'Candidate Name',
    candidateNamePlaceholder: 'Your name',
    programTrackLabel: 'Preparation Track',
    apiKeyLabel: 'Personal Gemini API Key',
    getKeyLink: 'Get Free API Key',
    keyPlaceholder: 'Paste AIzaSy... key',
    testKeyBtn: 'Verify Key',
    testingKey: 'Verifying...',
    removeKeyBtn: 'Remove Key',
    keyPrivacyNotice: 'The key is stored securely in your phone browser and never shared with third parties.',
    saveSettingsBtn: 'Save Settings',

    // Onboarding Modal
    onboardWelcome: 'Welcome to Air Astana Selection Prep ✈️',
    onboardStep1Title: 'How should we address you?',
    onboardStep1Sub: 'Enter your callsign or name for evaluation records:',
    onboardNamePlaceholder: 'e.g. Arman or Daniyar',
    onboardTargetTrack: 'Target Selection Track',
    onboardNextStep: 'Next: AI Setup →',
    onboardStep2Title: 'Connect Personal AI Flight Instructor ✈️',
    onboardStep2Desc: 'A free key unlocks live Socratic error debriefs, infinite question generation, and the final interview simulator.',
    onboardGuideTitle: 'Quick 1-Minute Setup:',
    onboardGuideStep1: 'Get a free API key at',
    onboardGuideStep2: 'Copy and paste the generated key below:',
    onboardActivateBtn: 'Activate AI Instructor',
    onboardSkipBtn: 'Continue without AI (Basic Mode)',

    // Stages Roadmap
    stagesTitle: 'Air Astana Selection Roadmap',
    stagesSubtitle: 'Official recruitment protocol and qualification stages',
    stage1Name: '1. Pre-screening & Documentation',
    stage2Name: '2. English Language Test',
    stage3Name: '3. Psychometric & SHL Abilities',
    stage4Name: '4. ADAPT / COMPASS or Tech Test',
    stage5Name: '5. VLEC Aviation Medical Board',
    stage6Name: '6. Full Flight Simulator / Hangar',
    stage7Name: '7. Final HR & Technical Board Interview',

    // Interview Sandbox
    interviewTitle: 'Final Board & Practical Scenario Simulator',
    interviewSubtitle: 'Graded by AI Board against STAR methodology and Air Astana safety culture',
    starS: 'S - SITUATION (Flight or hangar context, conditions)',
    starT: 'T - TASK (Specific safety challenge or procedural hurdle)',
    starA: 'A - ACTION (Proactive steps, Two-Challenge Rule communication)',
    starR: 'R - RESULT (Measurable outcome, airworthiness preserved)',
    submitInterviewBtn: 'Submit Answer for Panel Evaluation',
  },
} as const;

export function getGreeting(lang: LanguageMode): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      text: lang === 'ru' ? translations.ru.goodMorning : translations.en.goodMorning,
      emoji: '🌤️',
    };
  }
  if (hour >= 12 && hour < 18) {
    return {
      text: lang === 'ru' ? translations.ru.goodAfternoon : translations.en.goodAfternoon,
      emoji: '☀️',
    };
  }
  if (hour >= 18 && hour < 23) {
    return {
      text: lang === 'ru' ? translations.ru.goodEvening : translations.en.goodEvening,
      emoji: '🌅',
    };
  }
  return {
    text: lang === 'ru' ? translations.ru.goodNight : translations.en.goodNight,
    emoji: '🌙',
  };
}
