import { calculatePenaltyAmount } from '../src/utils/penalty';

describe('penalty util', () => {
  test('no penalty when rate is zero', () => {
    expect(calculatePenaltyAmount(1000, 0, 5)).toBe(0);
  });

  test('penalty respects allowedDelayDays', () => {
    // base 1000, rate 0.01 (1%), 5 days late, allowed 3 days -> effectiveDays=2 -> penalty=1000*0.01*2=20
    expect(calculatePenaltyAmount(1000, 0.01, 5, 3)).toBeCloseTo(20);
  });

  test('no penalty if within allowed delay', () => {
    expect(calculatePenaltyAmount(500, 0.02, 2, 3)).toBe(0);
  });
});
