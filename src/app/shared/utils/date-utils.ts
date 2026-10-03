const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/** Returns the days from now until the end date, rounded up to whole days. */
export function getDaysLeft(endDate: Date, now: Date = new Date()): number {
  const remainingMilliseconds = endDate.getTime() - now.getTime();
  return Math.ceil(remainingMilliseconds / MILLISECONDS_PER_DAY);
}
