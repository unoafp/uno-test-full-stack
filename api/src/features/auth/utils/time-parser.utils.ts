export function parseTimeToFutureDate(timeString: string): Date {
  const regex = /^(\d+)([smhdwMy])$/;
  const match = timeString.match(regex);

  if (!match) {
    throw new Error(`Invalid time format: ${timeString}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  let multiplier: number;

  switch (unit) {
    case 's':
      multiplier = 1000;
      break;
    case 'm':
      multiplier = 60 * 1000;
      break;
    case 'h':
      multiplier = 60 * 60 * 1000;
      break;
    case 'd':
      multiplier = 24 * 60 * 60 * 1000;
      break;
    case 'w':
      multiplier = 7 * 24 * 60 * 60 * 1000;
      break;
    case 'M':
      multiplier = 30 * 24 * 60 * 60 * 1000;
      break;
    case 'y':
      multiplier = 365 * 24 * 60 * 60 * 1000;
      break;
    default:
      throw new Error(`Unsupported time unit: ${unit}`);
  }

  return new Date(Date.now() + value * multiplier);
}
