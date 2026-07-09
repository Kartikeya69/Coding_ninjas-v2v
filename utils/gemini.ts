/**
 * Clean markdown blocks from LLM strings to extract pure JSON
 */
export function extractJsonFromResponse<T>(rawText: string): T {
  try {
    // Search for code block markers
    let cleanText = rawText.trim();
    
    // Remove leading/trailing markdown JSON decorators
    if (cleanText.includes('```json')) {
      cleanText = cleanText.split('```json')[1].split('```')[0].trim();
    } else if (cleanText.includes('```')) {
      cleanText = cleanText.split('```')[1].split('```')[0].trim();
    }
    
    return JSON.parse(cleanText) as T;
  } catch (error) {
    console.error('Failed to parse JSON from Gemini response:', rawText, error);
    throw new Error('Invalid JSON structure returned by the AI. Please try again.');
  }
}

/**
 * Strips general markdown markup from text for cleaner presentations
 */
export function cleanMarkdown(text: string): string {
  return text
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2')  // italic
    .replace(/`([^`]+)`/g, '$1')       // code inline
    .replace(/#+\s+/g, '')             // headers
    .trim();
}
