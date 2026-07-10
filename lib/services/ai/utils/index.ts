/**
 * Helper to clean and strip markdown qualifiers (e.g. ```json) from AI response texts
 * @param text Raw response string from LLM
 */
export function cleanResponseText(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, '');
    cleaned = cleaned.replace(/\n```$/, '');
  }
  return cleaned.trim();
}

/**
 * Truncates string contents to safe bounds for preview logs
 */
export function truncatePreview(str: string, maxLength = 60): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}
