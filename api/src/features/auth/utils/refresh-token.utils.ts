import { createHash } from 'crypto';

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function verifyRefreshTokenHash(
  token: string,
  storedHash: string,
): boolean {
  const incomingHash = hashRefreshToken(token);
  return incomingHash === storedHash;
}
