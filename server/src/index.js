/**
 * index.js
 * Express server entry point.
 *
 * Single responsibility: boot the server, register middleware, mount routes.
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { summarizeText } = require("./llm");
const { validateInput } = require("./validate");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ─── Health check ─────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Main route ───────────────────────────────────────────────────────────────

/**
 * POST /api/summarize
 * Body: { text: string }
 * Returns: { summary: string, keyPoints: string[], sentiment: string }
 */
app.post("/api/summarize", async (req, res) => {
  const text = req.body?.text;

  // 1. Validate input
  const { valid, error } = validateInput(text);
  if (!valid) {
    return res.status(400).json({ error });
  }

  // 2. Call LLM
  try {
    const result = await summarizeText(text.trim());
    return res.json(result);
  } catch (err) {
    console.error("[/api/summarize] Error:", err.message);

    // Surface a friendly error without leaking internals
    const isKeyError = err.message.includes("OPENAI_API_KEY");
    const statusCode = isKeyError ? 500 : 502;
    const clientMessage = isKeyError
      ? "Server configuration error: API key is missing. Check the README."
      : "Failed to summarize text. The LLM service may be unavailable. Please try again.";

    return res.status(statusCode).json({ error: clientMessage });
  }
});

// ─── 404 fallback ─────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅  Server running on http://localhost:${PORT}`);
  console.log(
    `   API key: ${process.env.OPENAI_API_KEY ? "detected ✓" : "MISSING — set OPENAI_API_KEY in server/.env"}`
  );
});
