import { Question, ProgramTrack } from '../types';

// Helper for random integers in range [min, max]
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to shuffle options and track correct index
function shuffleOptions(correct: string, distractors: string[]): { options: string[]; correctIndex: number } {
  const combined = [
    { text: correct, isCorrect: true },
    ...distractors.map((d) => ({ text: d, isCorrect: false })),
  ];
  // Fisher-Yates shuffle
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  const correctIndex = combined.findIndex((item) => item.isCorrect);
  return {
    options: combined.map((item) => item.text),
    correctIndex,
  };
}

// 1. Procedural Rate of Descent (ROD = GS * 5)
export function genRateOfDescentQuestion(): Question {
  const gs = randInt(13, 17) * 10; // 130, 140, 150, 160, 170 knots
  const rod = gs * 5;
  const { options, correctIndex } = shuffleOptions(
    `${rod} fpm`,
    [`${rod - 100} fpm`, `${rod + 50} fpm`, `${rod + 100} fpm`]
  );

  return {
    id: `proc-rod-${Date.now()}-${randInt(100, 999)}`,
    track: 'ab-initio',
    module: 'cognitive',
    category: 'COMPASS Speed Mental Math (ROD)',
    difficulty: 'Medium',
    question: `An Air Astana Airbus A320 is established on a 3-degree ILS glideslope with a groundspeed (GS) of ${gs} knots. What is the required rate of descent in feet per minute to stay on the glideslope profile?`,
    options,
    correctAnswerIndex: correctIndex,
    explanationEn: `Standard 3° glideslope rule of thumb: Rate of Descent (fpm) = Groundspeed (kts) * 5 (or half groundspeed times 10). Here: ${gs} * 5 = ${rod} fpm.`,
    explanationRu: `Правило 3-градусной глиссады: Вертикальная скорость снижения (фут/мин) = Путевая скорость (GS) × 5. Делим пополам (${gs} / 2 = ${gs / 2}) и умножаем на 10 → ${rod} фут/мин.`,
    formulaShortcut: `ROD = GS × 5 = (${gs} / 2) × 10 = ${rod} fpm`,
    timeLimitSeconds: 20,
  };
}

// 2. Procedural Top of Descent (3:1 Rule)
export function genTopofDescentQuestion(): Question {
  const cruiseFL = randInt(32, 38) * 10; // FL320 to FL380
  const targetAlt = randInt(3, 6) * 1000; // 3000 to 6000 ft
  const altToLoseThousands = (cruiseFL * 100 - targetAlt) / 1000;
  const baseDistance = altToLoseThousands * 3;
  const buffer = 10;
  const totalDistance = baseDistance + buffer;

  const { options, correctIndex } = shuffleOptions(
    `${totalDistance} NM`,
    [`${baseDistance} NM`, `${totalDistance + 15} NM`, `${totalDistance - 15} NM`]
  );

  return {
    id: `proc-tod-${Date.now()}-${randInt(100, 999)}`,
    track: 'ab-initio',
    module: 'cognitive',
    category: 'COMPASS Speed Mental Math (3:1 TOD)',
    difficulty: 'Hard',
    question: `Cruising at FL${cruiseFL}, Astana 341 is cleared to descend to ${targetAlt.toLocaleString()} feet. Using the 3:1 descent profile rule plus a 10 NM speed reduction buffer, how far from the waypoint must Top of Descent be initiated?`,
    options,
    correctAnswerIndex: correctIndex,
    explanationEn: `Altitude to lose = ${cruiseFL * 100} - ${targetAlt} = ${altToLoseThousands * 1000} ft. Distance = ${altToLoseThousands} * 3 = ${baseDistance} NM. Adding 10 NM speed buffer = ${totalDistance} NM.`,
    explanationRu: `Высота к снижению: ${cruiseFL * 100} - ${targetAlt} = ${altToLoseThousands * 1000} футов (${altToLoseThousands} тыс. фут). Правило 3:1: ${altToLoseThousands} × 3 = ${baseDistance} NM. С запасом на торможение (+10 NM) получаем ${totalDistance} NM.`,
    formulaShortcut: `TOD = (Altitude / 1000) × 3 + 10 NM = ${totalDistance} NM`,
    timeLimitSeconds: 25,
  };
}

// 3. Procedural Fuel Burn & Remaining Time
export function genFuelBurnQuestion(): Question {
  const fuelFlow = randInt(22, 26) * 100; // 2200 to 2600 kg/h
  const hours = [1.25, 1.5, 1.75, 2.0][randInt(0, 3)];
  const burned = Math.round(fuelFlow * hours);
  const initialFuel = burned + randInt(30, 50) * 100;
  const remainingFuel = initialFuel - burned;

  const hoursStr = hours === 1.25 ? '1 hour 15 min' : hours === 1.5 ? '1 hour 30 min' : hours === 1.75 ? '1 hour 45 min' : '2 hours';

  const { options, correctIndex } = shuffleOptions(
    `${remainingFuel.toLocaleString()} kg`,
    [
      `${(remainingFuel + 600).toLocaleString()} kg`,
      `${(remainingFuel - 500).toLocaleString()} kg`,
      `${(remainingFuel + 1200).toLocaleString()} kg`,
    ]
  );

  return {
    id: `proc-fuel-${Date.now()}-${randInt(100, 999)}`,
    track: 'both',
    module: 'psychometrics',
    category: 'SHL Numerical Reasoning (Fuel Burn)',
    difficulty: 'Medium',
    question: `An aircraft departs with ${initialFuel.toLocaleString()} kg of fuel. Average fuel consumption in cruise is ${fuelFlow.toLocaleString()} kg/hr. After flying for ${hoursStr}, what is the fuel weight remaining in the tanks?`,
    options,
    correctAnswerIndex: correctIndex,
    explanationEn: `Total fuel consumed = ${fuelFlow} kg/hr * ${hours} hr = ${burned} kg. Remaining fuel = ${initialFuel} - ${burned} = ${remainingFuel} kg.`,
    explanationRu: `Расход топлива за ${hoursStr}: ${fuelFlow} × ${hours} = ${burned} кг. Остаток топлива: ${initialFuel} - ${burned} = ${remainingFuel} кг.`,
    formulaShortcut: `Remaining = Initial - (Fuel Flow × Time) = ${remainingFuel} kg`,
    timeLimitSeconds: 30,
  };
}

// 4. Procedural Crosswind Rule of 60
export function genCrosswindQuestion(): Question {
  const angles = [
    { deg: 30, sin: 0.5, label: '30° (50% factor)' },
    { deg: 45, sin: 0.7, label: '45° (70% factor)' },
    { deg: 60, sin: 0.85, label: '60° (85% factor)' },
  ];
  const chosen = angles[randInt(0, angles.length - 1)];
  const windSpeed = randInt(4, 7) * 4; // 16, 20, 24, 28 kts
  const rwyHeading = randInt(1, 35) * 10;
  const windHeading = (rwyHeading + chosen.deg) % 360;

  const crosswind = Math.round(windSpeed * chosen.sin);

  const { options, correctIndex } = shuffleOptions(
    `${crosswind} knots`,
    [
      `${Math.max(crosswind - 6, 4)} knots`,
      `${crosswind + 5} knots`,
      `${windSpeed} knots`,
    ]
  );

  return {
    id: `proc-xwind-${Date.now()}-${randInt(100, 999)}`,
    track: 'ab-initio',
    module: 'cognitive',
    category: 'COMPASS Speed Mental Math (Crosswind)',
    difficulty: 'Medium',
    question: `Runway magnetic heading is ${String(rwyHeading).padStart(3, '0')}°. Tower reports surface wind ${String(windHeading).padStart(3, '0')}° at ${windSpeed} knots. Using the Rule of 60 trigonometry shortcut, what is the crosswind component?`,
    options,
    correctAnswerIndex: correctIndex,
    explanationEn: `Angular difference = ${chosen.deg}°. Factor for ${chosen.deg}° is approx ${chosen.sin}. Crosswind = ${windSpeed} kts * ${chosen.sin} = ${crosswind} knots.`,
    explanationRu: `Угол между ветром и полосой: ${chosen.deg}°. Для угла ${chosen.deg}° синус равен ${chosen.sin}. Боковая составляющая: ${windSpeed} × ${chosen.sin} = ${crosswind} узлов.`,
    formulaShortcut: `Crosswind = Wind Speed × sin(Angle) ≈ ${windSpeed} × ${chosen.sin} = ${crosswind} kts`,
    timeLimitSeconds: 20,
  };
}

// 5. Procedural Hydraulics & Pascal's Law (Apprentice M2)
export function genHydraulicPascalQuestion(): Question {
  const inArea = randInt(3, 6); // 3 to 6 cm²
  const ratio = randInt(6, 12); // Area multiplier
  const outArea = inArea * ratio; // 18 to 72 cm²
  const inForce = randInt(10, 30) * 10; // 100 to 300 N
  const outForce = inForce * ratio;

  const { options, correctIndex } = shuffleOptions(
    `${outForce.toLocaleString()} N`,
    [
      `${(outForce / 2).toLocaleString()} N`,
      `${(outForce + inForce).toLocaleString()} N`,
      `${(outForce * 2).toLocaleString()} N`,
    ]
  );

  return {
    id: `proc-pasc-${Date.now()}-${randInt(100, 999)}`,
    track: 'apprentice',
    module: 'psychometrics',
    category: 'Mechanical Comprehension (Pascal Law)',
    difficulty: 'Medium',
    question: `In an aircraft brake master cylinder, an input piston of cross-sectional area ${inArea} cm² is pushed with a force of ${inForce} N. If the slave caliper piston has an area of ${outArea} cm², what total clamping force is produced at the brake assembly?`,
    options,
    correctAnswerIndex: correctIndex,
    explanationEn: `Pascal's Law: Pressure P = F1 / A1 = ${inForce} N / ${inArea} cm² = ${inForce / inArea} N/cm². Output Force F2 = P * A2 = ${inForce / inArea} * ${outArea} = ${outForce} N (or F2 = F1 * (A2/A1)).`,
    explanationRu: `По закону Паскаля: Отношение площадей поршней A2 / A1 = ${outArea} / ${inArea} = ${ratio}. Выходная сила: F2 = ${inForce} × ${ratio} = ${outForce} Н.`,
    formulaShortcut: `F2 = F1 × (A2 / A1) = ${inForce} × ${ratio} = ${outForce} N`,
    timeLimitSeconds: 25,
  };
}

// 6. Procedural Lever & Moments (Apprentice M2)
export function genLeverMechanicsQuestion(): Question {
  const loadArm = randInt(2, 6) / 10; // 0.2 to 0.6 m
  const ratio = randInt(4, 7); // 4x to 7x mechanical advantage
  const effortArm = Math.round(loadArm * ratio * 10) / 10;
  const loadKg = randInt(30, 80) * 10; // 300 to 800 kg
  const loadN = loadKg * 10; // ~3000 to 8000 N
  const effortN = Math.round(loadN / ratio);

  const { options, correctIndex } = shuffleOptions(
    `${effortN.toLocaleString()} N`,
    [
      `${(effortN * 2).toLocaleString()} N`,
      `${Math.round(effortN * 0.6).toLocaleString()} N`,
      `${(loadN - effortN).toLocaleString()} N`,
    ]
  );

  return {
    id: `proc-lever-${Date.now()}-${randInt(100, 999)}`,
    track: 'apprentice',
    module: 'psychometrics',
    category: 'Mechanical Comprehension (Levers & Torque)',
    difficulty: 'Medium',
    question: `A Class 1 ground support lever has a fulcrum positioned ${loadArm} m from a landing gear assembly weighing ${loadN.toLocaleString()} N. If an engineer applies downward force at a handle distance of ${effortArm} m from the fulcrum, what minimum effort force is required to lift it?`,
    options,
    correctAnswerIndex: correctIndex,
    explanationEn: `Law of the Lever: Load * Load Arm = Effort * Effort Arm. Effort = (${loadN} * ${loadArm}) / ${effortArm} = ${effortN} N.`,
    explanationRu: `Правило рычага (моментов): F1 × L1 = F2 × L2. Сила F2 = (${loadN} × ${loadArm}) / ${effortArm} = ${effortN} Н. Выигрыш в силе составляет ${ratio} раз.`,
    formulaShortcut: `Effort = Load × (Load Arm / Effort Arm) = ${effortN} N`,
    timeLimitSeconds: 25,
  };
}

// 7. Procedural Gear Ratio & Accessory Gearbox RPM (Apprentice M2)
export function genGearRatioQuestion(): Question {
  const driverTeeth = [12, 16, 18, 20][randInt(0, 3)];
  const ratio = [2, 3, 4][randInt(0, 2)];
  const drivenTeeth = driverTeeth * ratio;
  const motorRPM = randInt(18, 36) * 100; // 1800 to 3600 RPM
  const drivenRPM = motorRPM / ratio;

  const { options, correctIndex } = shuffleOptions(
    `${drivenRPM} RPM`,
    [
      `${drivenRPM * 2} RPM`,
      `${motorRPM} RPM`,
      `${Math.round(drivenRPM * 0.75)} RPM`,
    ]
  );

  return {
    id: `proc-gear-${Date.now()}-${randInt(100, 999)}`,
    track: 'apprentice',
    module: 'psychometrics',
    category: 'Mechanical Comprehension (Gear Ratios)',
    difficulty: 'Medium',
    question: `An engine starter drives an accessory pinion gear with ${driverTeeth} teeth at ${motorRPM} RPM. It meshes with an alternator drive gear having ${drivenTeeth} teeth. What is the rotational speed of the driven gear?`,
    options,
    correctAnswerIndex: correctIndex,
    explanationEn: `Gear Ratio = Driven Teeth / Driver Teeth = ${drivenTeeth} / ${driverTeeth} = ${ratio}:1. Driven RPM = Driver RPM / Ratio = ${motorRPM} / ${ratio} = ${drivenRPM} RPM.`,
    explanationRu: `Передаточное число: ${drivenTeeth} / ${driverTeeth} = ${ratio}:1 (редукция). Скорость ведомого колеса: ${motorRPM} / ${ratio} = ${drivenRPM} об/мин.`,
    formulaShortcut: `RPM_out = RPM_in × (N_in / N_out) = ${drivenRPM} RPM`,
    timeLimitSeconds: 20,
  };
}

// 8. Procedural Electrical Circuits & Ohm's Law (Apprentice EASA M3)
export function genElectricalOhmQuestion(): Question {
  const voltage = 28; // Standard 28V DC bus
  const r1 = [4, 7, 14, 28][randInt(0, 3)];
  const current = voltage / r1;
  const power = voltage * current;

  const { options, correctIndex } = shuffleOptions(
    `Current = ${current} A, Power = ${power} W`,
    [
      `Current = ${current * 2} A, Power = ${power * 2} W`,
      `Current = ${current} A, Power = ${power / 2} W`,
      `Current = ${(current / 2).toFixed(1)} A, Power = ${power} W`,
    ]
  );

  return {
    id: `proc-ohm-${Date.now()}-${randInt(100, 999)}`,
    track: 'apprentice',
    module: 'psychometrics',
    category: 'EASA M3 Electrical Fundamentals (Ohm Law)',
    difficulty: 'Medium',
    question: `An auxiliary DC pitot tube heater on an aircraft 28V DC secondary bus has an internal measured coil resistance of ${r1} Ohms. What is the operational current draw and power dissipated?`,
    options,
    correctAnswerIndex: correctIndex,
    explanationEn: `Ohm's Law: Current I = V / R = ${voltage} / ${r1} = ${current} A. Power P = V * I = ${voltage} * ${current} = ${power} Watts.`,
    explanationRu: `Закон Ома: Сила тока I = U / R = ${voltage} / ${r1} = ${current} А. Мощность P = U × I = ${voltage} × ${current} = ${power} Вт.`,
    formulaShortcut: `I = U/R = ${current} A; P = U×I = ${power} W`,
    timeLimitSeconds: 20,
  };
}

// 9. Procedural Pulley Block and Tackle System (Apprentice M2)
export function genPulleySystemQuestion(): Question {
  const strands = [2, 3, 4][randInt(0, 2)];
  const engineWeightKg = randInt(15, 45) * 10; // 150 to 450 kg
  const engineWeightN = engineWeightKg * 10; // approx 1500 to 4500 N
  const effortN = Math.round(engineWeightN / strands);

  const { options, correctIndex } = shuffleOptions(
    `${effortN.toLocaleString()} N`,
    [
      `${engineWeightN.toLocaleString()} N`,
      `${(effortN * 2).toLocaleString()} N`,
      `${Math.round(effortN * 1.5).toLocaleString()} N`,
    ]
  );

  return {
    id: `proc-pulley-${Date.now()}-${randInt(100, 999)}`,
    track: 'apprentice',
    module: 'psychometrics',
    category: 'Mechanical Comprehension (Pulley Systems)',
    difficulty: 'Medium',
    question: `A maintenance crane uses a block-and-tackle pulley system with ${strands} supporting rope strands to hoist a starter generator weighing ${engineWeightN.toLocaleString()} N. Neglecting friction, what pull force must the hoist motor exert?`,
    options,
    correctAnswerIndex: correctIndex,
    explanationEn: `Mechanical Advantage of a pulley system equals the number of strands supporting the load (${strands}). Effort = Load / Strands = ${engineWeightN} / ${strands} = ${effortN} N.`,
    explanationRu: `Выигрыш в силе полиспаста равен числу рабочих ветвей каната, несущих груз (${strands}). Необходимое усилие: F = ${engineWeightN} / ${strands} = ${effortN} Н.`,
    formulaShortcut: `Effort = Weight / Strands = ${engineWeightN} / ${strands} = ${effortN} N`,
    timeLimitSeconds: 20,
  };
}

// 10. Procedural Speed, Distance, Time (COMPASS Speed Math)
export function genSpeedDistanceTimeQuestion(): Question {
  const speeds = [360, 420, 480, 540]; // easily divisible by 60
  const gs = speeds[randInt(0, speeds.length - 1)];
  const minutes = [10, 12, 15, 20, 30][randInt(0, 4)];
  const fraction = minutes / 60;
  const distance = Math.round(gs * fraction);

  const { options, correctIndex } = shuffleOptions(
    `${distance} NM`,
    [`${distance - 14} NM`, `${distance + 12} NM`, `${distance + 28} NM`]
  );

  return {
    id: `proc-sdt-${Date.now()}-${randInt(100, 999)}`,
    track: 'ab-initio',
    module: 'cognitive',
    category: 'COMPASS Speed Mental Math (Distance)',
    difficulty: 'Easy',
    question: `An Airbus A321LR is cruising at a groundspeed of ${gs} knots. How many nautical miles will it traverse in exactly ${minutes} minutes?`,
    options,
    correctAnswerIndex: correctIndex,
    explanationEn: `${minutes} minutes is ${minutes}/60 of an hour (= ${fraction}). Distance = ${gs} * ${fraction} = ${distance} NM.`,
    explanationRu: `${minutes} минут — это ровно ${minutes}/60 часа. Дистанция = ${gs} × (${minutes}/60) = ${distance} морских миль.`,
    formulaShortcut: `Distance = GS × (Minutes / 60) = ${distance} NM`,
    timeLimitSeconds: 15,
  };
}

// Master Procedural Question Batch Generator
export function generateProceduralBatch(count: number = 30, track: ProgramTrack = 'ab-initio'): Question[] {
  const generators = [
    genRateOfDescentQuestion,
    genTopofDescentQuestion,
    genFuelBurnQuestion,
    genCrosswindQuestion,
    genSpeedDistanceTimeQuestion,
    genHydraulicPascalQuestion,
    genLeverMechanicsQuestion,
    genGearRatioQuestion,
    genElectricalOhmQuestion,
    genPulleySystemQuestion,
  ];

  const filteredGenerators = generators.filter((gen) => {
    const sample = gen();
    return sample.track === track || sample.track === 'both';
  });

  const list: Question[] = [];
  for (let i = 0; i < count; i++) {
    const pickedGen = filteredGenerators[i % filteredGenerators.length];
    list.push(pickedGen());
  }
  return list;
}
