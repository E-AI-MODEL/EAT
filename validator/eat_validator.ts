export function validateEAT(text: string): string {
  const forbidden = ["{{", "}}", "<<", ">>"];
  for (const f of forbidden) {
    if (text.includes(f)) return `Invalid EAT token: ${f}`;
  }
  if (!text.includes(":")) return "Missing ':' in EAT structure";
  return "VALID";
}
