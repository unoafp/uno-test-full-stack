import crypto from 'crypto';

export function hashToken(rawToken: string) {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  return tokenHash;
}
