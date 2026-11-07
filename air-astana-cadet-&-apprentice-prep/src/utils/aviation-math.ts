/**
 * Aviation & EASA Part-66 Engineering Mathematics & Physics Pure Functions
 */

export interface WindComponents {
  crosswind: number;
  headwind: number;
  angleDiff: number;
}

export interface ElectricalParameters {
  voltage: number;
  current: number;
  resistance: number;
  powerWatts: number;
}

export interface GearCalculation {
  gearRatio: number;
  outputRpm: number;
  torqueMultiplier: number;
}

export interface HydraulicResult {
  outputForceN: number;
  pressureBar: number;
}

/**
 * Standard 3-degree glideslope descent rate approximation:
 * Rate of Descent (fpm) = Groundspeed (kts) * 5
 */
export function calculateRateOfDescent(groundspeedKts: number): number {
  if (groundspeedKts < 0) return 0;
  return Math.round(groundspeedKts * 5);
}

/**
 * Standard 3:1 descent profile rule of thumb:
 * Distance (NM) = Altitude to lose (ft) / 300
 */
export function calculateDescentDistance(altitudeToLoseFt: number): number {
  if (altitudeToLoseFt <= 0) return 0;
  return Math.round((altitudeToLoseFt / 300) * 10) / 10;
}

/**
 * Calculate crosswind and headwind components given wind speed, direction, and runway heading.
 */
export function calculateCrosswindComponent(
  windSpeedKts: number,
  runwayHeadingDeg: number,
  windHeadingDeg: number
): WindComponents {
  let angleDiff = Math.abs(runwayHeadingDeg - windHeadingDeg) % 360;
  if (angleDiff > 180) {
    angleDiff = 360 - angleDiff;
  }
  const rad = (angleDiff * Math.PI) / 180;
  const crosswind = Math.round(windSpeedKts * Math.sin(rad) * 10) / 10;
  const headwind = Math.round(windSpeedKts * Math.cos(rad) * 10) / 10;
  return {
    crosswind,
    headwind,
    angleDiff,
  };
}

/**
 * Fuel calculation:
 * Remaining fuel = Initial - (BurnRateKgPerHour * (FlightMinutes / 60))
 */
export function calculateFuelBurnRemaining(
  initialFuelKg: number,
  burnRateKgPerHour: number,
  flightDurationMinutes: number
): number {
  const burned = burnRateKgPerHour * (flightDurationMinutes / 60);
  const remaining = initialFuelKg - burned;
  return Math.max(0, Math.round(remaining));
}

/**
 * EASA M3 Electrical Fundamentals: Ohm's Law (V = I * R) and Power (P = V * I)
 */
export function calculateOhmsLaw(params: {
  voltage?: number;
  current?: number;
  resistance?: number;
}): ElectricalParameters {
  let { voltage, current, resistance } = params;

  if (voltage !== undefined && current !== undefined && resistance === undefined) {
    resistance = current === 0 ? 0 : voltage / current;
  } else if (voltage !== undefined && resistance !== undefined && current === undefined) {
    current = resistance === 0 ? 0 : voltage / resistance;
  } else if (current !== undefined && resistance !== undefined && voltage === undefined) {
    voltage = current * resistance;
  }

  const v = voltage ?? 0;
  const i = current ?? 0;
  const r = resistance ?? 0;
  const powerWatts = Math.round(v * i * 100) / 100;

  return {
    voltage: Math.round(v * 100) / 100,
    current: Math.round(i * 100) / 100,
    resistance: Math.round(r * 100) / 100,
    powerWatts,
  };
}

/**
 * Mechanical Comprehension: Simple Gear Ratio Calculation
 * Gear Ratio = Output Teeth / Input Teeth
 * Output RPM = Input RPM * (Input Teeth / Output Teeth)
 */
export function calculateGearRatio(
  inputTeeth: number,
  outputTeeth: number,
  inputRpm: number
): GearCalculation {
  if (inputTeeth <= 0 || outputTeeth <= 0) {
    throw new Error('Gear teeth count must be greater than zero');
  }
  const ratio = Math.round((outputTeeth / inputTeeth) * 100) / 100;
  const outputRpm = Math.round((inputRpm * (inputTeeth / outputTeeth)) * 10) / 10;
  const torqueMultiplier = ratio;

  return {
    gearRatio: ratio,
    outputRpm,
    torqueMultiplier,
  };
}

/**
 * EASA M2 Fluid Mechanics: Hydraulic Force (Pascal's Principle)
 * P = F1 / A1 = F2 / A2  =>  F2 = F1 * (A2 / A1)
 * 1 bar = 10 N/cm^2
 */
export function calculateHydraulicForce(
  inputForceN: number,
  inputAreaCm2: number,
  outputAreaCm2: number
): HydraulicResult {
  if (inputAreaCm2 <= 0 || outputAreaCm2 <= 0) {
    throw new Error('Piston area must be greater than zero');
  }
  const outputForceN = Math.round(inputForceN * (outputAreaCm2 / inputAreaCm2) * 10) / 10;
  const pressureNPerCm2 = inputForceN / inputAreaCm2;
  const pressureBar = Math.round((pressureNPerCm2 / 10) * 100) / 100;

  return {
    outputForceN,
    pressureBar,
  };
}
