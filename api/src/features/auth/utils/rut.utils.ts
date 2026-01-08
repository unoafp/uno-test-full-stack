export function normalizeRut(rut: string): string {
  return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
}

export function splitRut(rut: string) {
  const normalized = normalizeRut(rut);
  const body = normalized.slice(0, -1);
  const dv = normalized.slice(-1);

  return [body, dv];
}

export function isValidRut(rut: string): boolean {
  if (!rut) return false;

  const normalized = normalizeRut(rut);

  if (!/^\d{7,8}[0-9K]$/.test(normalized)) return false;

  const [body, dv] = splitRut(normalized);

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const mod = 11 - (sum % 11);

  let computedDv: string;
  if (mod === 11) computedDv = '0';
  else if (mod === 10) computedDv = 'K';
  else computedDv = mod.toString();

  return computedDv === dv;
}
