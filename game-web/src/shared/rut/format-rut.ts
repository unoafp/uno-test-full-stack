export const formatRut = (value: string): string => {
  const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();

  if (clean.length === 0) return "";

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  const formattedBody = body
    .split("")
    .reverse()
    .reduce((acc, char, i) => {
      return char + (i && i % 3 === 0 ? "." : "") + acc;
    }, "");

  return `${formattedBody}-${dv}`;
};
