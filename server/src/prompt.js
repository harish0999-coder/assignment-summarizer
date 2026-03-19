/**
 * prompt.js
 * Centralised prompt template for structured text summarization.
 *
 * Design rationale:
 *  - Role assignment ("You are an assistant that...") anchors the model's behaviour.
 *  - Strict JSON-only instruction eliminates markdown fences or prose wrappers.
 *  - Explicit shape + constraints (exactly 1 sentence, exactly 3 points, enum sentiment)
 *    dramatically reduces invalid/inconsistent responses.
 *  - Enumerating what NOT to do (no markdown, no extra keys) closes common failure modes.
 */

const SYSTEM_PROMPT = `You are an assistant that converts unstructured text into a strict JSON summary.
Return ONLY valid JSON — no markdown, no code fences, no explanation, no extra keys.

Required shape:
{
  "summary": "exactly one sentence describing the main idea",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "positive | neutral | negative"
}

Rules:
- "summary" must be exactly one complete sentence.
- "keyPoints" must contain exactly 3 short, standalone strings.
- "sentiment" must be exactly one of: positive, neutral, negative.
- Do NOT include markdown, backticks, or any text outside the JSON object.
- Do NOT add extra keys beyond summary, keyPoints, and sentiment.`;

/**
 * Build the user message by injecting the text to analyse.
 * @param {string} userText - The raw text submitted by the user.
 * @returns {string}
 */
function buildUserMessage(userText) {
  return `Analyse the following text and return the JSON summary:\n\n${userText}`;
}

module.exports = { SYSTEM_PROMPT, buildUserMessage };
