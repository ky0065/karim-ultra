export function basicModerationCheck(text: string) {
  const banned = [/api\s*key/i, /password/i];
  return !banned.some(r => r.test(text));
}
