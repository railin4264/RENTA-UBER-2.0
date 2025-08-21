export function calculatePenaltyAmount(base: number, penaltyRate: number, daysLate: number, allowedDelayDays = 0) {
  if (!penaltyRate || penaltyRate <= 0) return 0;
  const effectiveDays = Math.max(0, daysLate - allowedDelayDays);
  if (effectiveDays <= 0) return 0;
  // penalty = base * penaltyRate * daysLate
  return base * penaltyRate * effectiveDays;
}

export function daysBetween(dateA: Date, dateB: Date) {
  const ms = Math.max(0, dateA.getTime() - dateB.getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}
