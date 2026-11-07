import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRateOfDescent,
  calculateDescentDistance,
  calculateCrosswindComponent,
  calculateFuelBurnRemaining,
  calculateOhmsLaw,
  calculateGearRatio,
  calculateHydraulicForce,
} from './aviation-math';

test('calculateRateOfDescent calculates 3-degree glidepath rate correctly', () => {
  assert.equal(calculateRateOfDescent(140), 700);
  assert.equal(calculateRateOfDescent(150), 750);
  assert.equal(calculateRateOfDescent(120), 600);
  assert.equal(calculateRateOfDescent(0), 0);
});

test('calculateDescentDistance uses 3:1 rule', () => {
  assert.equal(calculateDescentDistance(30000), 100);
  assert.equal(calculateDescentDistance(24000), 80);
  assert.equal(calculateDescentDistance(15000), 50);
  assert.equal(calculateDescentDistance(0), 0);
});

test('calculateCrosswindComponent computes crosswind and headwind', () => {
  // Runway 23 (230 deg), Wind 260 deg at 20 kts => 30 deg angle
  // sin(30) = 0.5 => 10 kts crosswind; cos(30) ~ 0.866 => 17.3 kts headwind
  const result = calculateCrosswindComponent(20, 230, 260);
  assert.equal(result.crosswind, 10);
  assert.equal(result.headwind, 17.3);
  assert.equal(result.angleDiff, 30);
});

test('calculateFuelBurnRemaining computes remaining fuel correctly', () => {
  // Initial 5000 kg, burn 2400 kg/hr, 90 mins flight (1.5 hrs) => 5000 - 3600 = 1400 kg
  const remaining = calculateFuelBurnRemaining(5000, 2400, 90);
  assert.equal(remaining, 1400);
});

test('calculateOhmsLaw calculates missing parameters and power', () => {
  const result1 = calculateOhmsLaw({ voltage: 28, resistance: 7 });
  assert.equal(result1.current, 4);
  assert.equal(result1.powerWatts, 112);

  const result2 = calculateOhmsLaw({ current: 5, resistance: 10 });
  assert.equal(result2.voltage, 50);
  assert.equal(result2.powerWatts, 250);
});

test('calculateGearRatio computes speed reduction and torque multiplication', () => {
  // 20 teeth driving 60 teeth => 3:1 reduction => 1800 RPM becomes 600 RPM
  const result = calculateGearRatio(20, 60, 1800);
  assert.equal(result.gearRatio, 3);
  assert.equal(result.outputRpm, 600);
  assert.equal(result.torqueMultiplier, 3);
});

test('calculateHydraulicForce applies Pascal principle', () => {
  // Input 100 N on 2 cm^2, output piston 10 cm^2 => 500 N
  const result = calculateHydraulicForce(100, 2, 10);
  assert.equal(result.outputForceN, 500);
  assert.equal(result.pressureBar, 5);
});
