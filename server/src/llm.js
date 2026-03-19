/**
 * llm.js
 * Thin wrapper around the OpenAI SDK.
 */

const OpenAI = require("openai");
const { SYSTEM_PROMPT, buildUserMessage } = require("./prompt");
const { validateLLMResponse } = require("./validate");

let client = null;

function getClient() {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY is not set. Copy server/.env.example to server/.env and add your key."
      );
    }
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return client;
}

/**
 * Send text to the LLM and return a validated structured summary.
 * @param {string} text - Raw user text.
 * @returns {Promise<{ summary: string, keyPoints: string[], sentiment: string }>}
 */
async function summarizeText(text) {
  const openai = getClient();
  const model = process.env.OPENAI_MODEL || "llama-3.1-8b-instant";

  const response = await openai.chat.completions.create({
    model,
    temperature: 0.2,
    max_tokens: 4096,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserMessage(text) },
    ],
  });

  // Log finish reason to help debug truncation
  const finishReason = response.choices?.[0]?.finish_reason;
  if (finishReason === "length") {
    console.warn("[llm] WARNING: Response truncated by token limit (finish_reason=length). Try a shorter input.");
  }
  console.log(`[llm] finish_reason=${finishReason}, model=${model}`);

  const rawContent = response.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error("LLM returned an empty response.");
  }

  // Strip any accidental markdown fences the model might still add
  const cleaned = rawContent
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("[llm] Raw response that failed parsing:\n", rawContent);
    throw new Error(
      `LLM response was not valid JSON. finish_reason=${finishReason}. Raw: ${rawContent.slice(0, 300)}`
    );
  }

  const validation = validateLLMResponse(parsed);
  if (!validation.valid) {
    throw new Error(`LLM response failed schema validation: ${validation.error}`);
  }

  return {
    summary: parsed.summary.trim(),
    keyPoints: parsed.keyPoints.map((p) => p.trim()),
    sentiment: parsed.sentiment,
  };
}

module.exports = { summarizeText };