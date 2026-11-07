import test from 'node:test';
import assert from 'node:assert/strict';
import {
  genRateOfDescentQuestion,
  genTopofDescentQuestion,
  genFuelBurnQuestion,
  genCrosswindQuestion,
  genHydraulicPascalQuestion,
  genLeverMechanicsQuestion,
  genGearRatioQuestion,
  genElectricalOhmQuestion,
  genPulleySystemQuestion,
  genSpeedDistanceTimeQuestion,
  generateProceduralBatch,
} from './procedural-questions';

test('Procedural Question Engine: Rate of Descent', () => {
  const q = genRateOfDescentQuestion();
  assert.ok(q.question.includes('groundspeed'));
  assert.equal(q.options.length, 4);
  assert.ok(q.correctAnswerIndex >= 0 && q.correctAnswerIndex < 4);
  assert.ok(q.options[q.correctAnswerIndex].includes('fpm'));
});

test('Procedural Question Engine: 3:1 Top of Descent', () => {
  const q = genTopofDescentQuestion();
  assert.ok(q.question.includes('3:1'));
  assert.equal(q.options.length, 4);
  assert.ok(q.options[q.correctAnswerIndex].includes('NM'));
});

test('Procedural Question Engine: Hydraulics Pascal Law', () => {
  const q = genHydraulicPascalQuestion();
  assert.ok(q.question.includes('piston'));
  assert.equal(q.options.length, 4);
  assert.ok(q.options[q.correctAnswerIndex].includes('N'));
});

test('Procedural Question Engine: Batch generation', () => {
  const batch = generateProceduralBatch(20, 'ab-initio');
  assert.equal(batch.length, 20);
  for (const q of batch) {
    assert.ok(q.options.length === 4);
    assert.ok(q.correctAnswerIndex >= 0 && q.correctAnswerIndex < 4);
    assert.ok(q.question.length > 20);
  }
});
