<<<<<<< HEAD
# AI Text Summarizer

A minimal full-stack app that accepts unstructured text and returns a structured summary using an LLM API.

**Stack:** React + Vite (frontend) · Node.js + Express (backend) · OpenAI API

---

## Quick Start

### 1. Clone / download

```bash
git clone https://github.com/YOUR_USERNAME/assignment-summarizer.git
cd assignment-summarizer
```

### 2. Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Configure environment

```bash
cd ../server
cp .env.example .env
```

Open `server/.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-...your-key-here...
OPENAI_MODEL=gpt-3.5-turbo
PORT=3001
```

> **Get a key:** https://platform.openai.com/api-keys  
> `gpt-3.5-turbo` is fast and cheap. Swap for `gpt-4o` if you want higher quality.

### 4. Run both servers

**Terminal 1 — backend:**
```bash
cd server
npm run dev        # uses nodemon for auto-restart
# or
npm start
```

**Terminal 2 — frontend:**
```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## How It Works

```
User pastes text
     │
     ▼
React frontend (port 5173)
     │  POST /api/summarize  { text: "..." }
     ▼
Express backend (port 3001)
     │  validates input
     │  builds prompt
     │  calls OpenAI chat completions
     │  parses + validates JSON response
     ▼
Returns { summary, keyPoints, sentiment }
     │
     ▼
ResultCard renders structured output
```

The API key lives only on the backend (`server/.env`). The browser never sees it.

---

## Prompt Design

```
You are an assistant that converts unstructured text into a strict JSON summary.
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
- Do NOT add extra keys beyond summary, keyPoints, and sentiment.
```

**Why it's written this way:**

| Decision | Reason |
|---|---|
| Role assignment ("You are…") | Anchors the model's behaviour before any instruction |
| JSON-only instruction at the top | Eliminates the most common failure: prose wrappers or markdown fences |
| Explicit shape with exact type info | Removes ambiguity about what each field should contain |
| Constraint on counts ("exactly 3") | Prevents variable-length arrays that break the UI |
| Enumerated sentiment labels | Prevents free-form labels like "mixed" or "somewhat positive" |
| Low temperature (0.2) in the API call | Makes output more deterministic and consistent |

Even with a strong prompt, the backend validates the parsed JSON and returns a clear error if the model drifts.

---

## Example Output

**Input:**
> OpenAI released GPT-4o in May 2024, a new flagship model that is faster and cheaper than its predecessor GPT-4 Turbo. The model supports real-time audio, vision, and text in a single end-to-end network. It scored 88.7% on the MMLU benchmark, matching the previous best models, while running at twice the speed. CEO Sam Altman called it "a magical experience."

**Output:**
```json
{
  "summary": "OpenAI launched GPT-4o, a multimodal model that matches prior flagship performance at twice the speed and lower cost.",
  "keyPoints": [
    "GPT-4o supports real-time audio, vision, and text in one unified network",
    "It scored 88.7% on MMLU while running at twice the speed of GPT-4 Turbo",
    "CEO Sam Altman praised it highly and plans broad rollout to ChatGPT users"
  ],
  "sentiment": "positive"
}
```

---

## API Reference

### `POST /api/summarize`

**Request body:**
```json
{ "text": "your unstructured text here" }
```

**Success response (200):**
```json
{
  "summary": "string",
  "keyPoints": ["string", "string", "string"],
  "sentiment": "positive | neutral | negative"
}
```

**Error responses:**
| Status | Meaning |
|---|---|
| 400 | Empty input, too short, too long |
| 500 | API key missing or server misconfiguration |
| 502 | LLM service error or malformed response |

### `GET /health`
Returns `{ status: "ok", timestamp: "..." }` — useful for deployment checks.

---

## Error Handling

| Scenario | Frontend | Backend |
|---|---|---|
| Empty input | Blocked before fetch | 400 + message |
| API key missing | Clear error message | 500 + logged warning |
| LLM timeout/failure | "Try again" message | 502 + fallback message |
| Malformed LLM JSON | "Summarization failed" | Caught at parse step |
| Network unreachable | "Backend not running" hint | — |

---

## Project Structure

```
assignment-summarizer/
├── client/
│   ├── src/
│   │   ├── App.jsx              # Main UI, state, fetch logic
│   │   ├── main.jsx             # React entry point
│   │   ├── index.css            # Global styles + CSS variables
│   │   └── components/
│   │       └── ResultCard.jsx   # Renders structured result
│   ├── index.html
│   ├── vite.config.js           # Proxy /api → port 3001
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── index.js             # Express server, single POST route
│   │   ├── llm.js               # OpenAI SDK wrapper
│   │   ├── prompt.js            # System prompt + user message builder
│   │   └── validate.js          # Input + LLM output validation
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Trade-offs & Known Shortcuts

| Decision | Trade-off |
|---|---|
| Single `/api/summarize` route | Simple and easy to explain; would need versioning for production |
| No auth / rate limiting | Not needed for a local assignment demo; essential before public deployment |
| OpenAI JSON parsing by hand | Reliable enough with the current prompt; could use `response_format: { type: "json_object" }` in newer models |
| No test coverage | Kept within the 1–2 hr scope; would add integration tests for the validate and llm modules first |
| CSS-in-JS inline styles | Fast to write; would migrate to CSS modules or Tailwind in a real project |
| `gpt-3.5-turbo` default | Cheap and fast for this schema; `gpt-4o` gives better quality for complex text |

---

## What I Would Add With More Time

1. **Batch file processing** — drag & drop multiple `.txt` files and process them sequentially
2. **`response_format: json_object`** — use OpenAI's native JSON mode to further guarantee valid output
3. **Schema customisation** — let users edit the output fields via a simple UI or config flag
4. **Confidence note** — ask the model to rate its own certainty and surface it alongside the result
5. **History panel** — persist past analyses in `localStorage` with timestamps
6. **Proper test suite** — unit tests for `validate.js`, integration test for the summarize route
7. **Docker Compose** — single command to start both services for easier reviewer setup

---

## Deployment

See the **Deployment** section below for Railway, Render, and Vercel instructions.

---

## LLM Choice: Why OpenAI?

- **Reliability:** The chat completions API is stable and well-documented.
- **JSON mode:** GPT-3.5-turbo and GPT-4 follow structured prompts very consistently.
- **Cost:** GPT-3.5-turbo is ~$0.001 per typical request — negligible for an assignment.
- **SDK quality:** The official `openai` npm package handles retries, streaming, and error types cleanly.

The code is easy to swap for another provider (Anthropic Claude, Mistral, etc.) by changing only `llm.js`.
=======
# assignment-summarizer
NxtWave Assignment
>>>>>>> c1ad01a725ad5795434803f4bb765e13758d505f
