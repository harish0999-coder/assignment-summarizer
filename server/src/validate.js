/**
 * validate.js
 * Input validation + lenient LLM output validation with auto-correction.
 */

const MIN_LENGTH = 10;
const MAX_LENGTH = 10000;

function validateInput(text) {
  if (typeof text !== "string") return { valid: false, error: "Input must be a string." };
  const trimmed = text.trim();
  if (trimmed.length === 0)          return { valid: false, error: "Input text cannot be empty." };
  if (trimmed.length < MIN_LENGTH)   return { valid: false, error: `Input too short. Minimum ${MIN_LENGTH} characters.` };
  if (trimmed.length > MAX_LENGTH)   return { valid: false, error: `Input too long. Maximum ${MAX_LENGTH} characters.` };
  return { valid: true };
}

/**
 * Validate AND auto-correct the LLM JSON response.
 * - keyPoints: accept any array of strings, pad/trim to exactly 3
 * - sentiment: accept close variants like "Positive" → "positive"
 */
function validateLLMResponse(parsed) {
  if (!parsed || typeof parsed !== "object") {
    return { valid: false, error: "LLM returned non-object JSON." };
  }

  // ── summary ───────────────────────────────────────────────
  if (typeof parsed.summary !== "string" || parsed.summary.trim() === "") {
    return { valid: false, error: 'Missing valid "summary" field.' };
  }

  // ── keyPoints: auto-fix length ────────────────────────────
  if (!Array.isArray(parsed.keyPoints)) {
    return { valid: false, error: '"keyPoints" must be an array.' };
  }

  // Filter to only string entries
  let kp = parsed.keyPoints.filter((p) => typeof p === "string" && p.trim() !== "");

  if (kp.length === 0) {
    return { valid: false, error: '"keyPoints" has no valid string entries.' };
  }

  // Pad if fewer than 3
  while (kp.length < 3) {
    kp.push(kp[kp.length - 1]); // repeat last point rather than crash
  }

  // Trim to 3
  kp = kp.slice(0, 3);
  parsed.keyPoints = kp; // mutate in place so caller gets fixed version

  // ── sentiment: normalise casing / variants ─────────────────
  const allowed = ["positive", "neutral", "negative"];
  const raw = (parsed.sentiment || "").toString().toLowerCase().trim();

  if (allowed.includes(raw)) {
    parsed.sentiment = raw;
  } else if (raw.startsWith("pos")) {
    parsed.sentiment = "positive";
  } else if (raw.startsWith("neg")) {
    parsed.sentiment = "negative";
  } else {
    parsed.sentiment = "neutral"; // safe fallback instead of hard error
    console.warn(`[validate] Unknown sentiment "${parsed.sentiment}" — defaulted to neutral`);
  }

  return { valid: true };
}

module.exports = { validateInput, validateLLMResponse };