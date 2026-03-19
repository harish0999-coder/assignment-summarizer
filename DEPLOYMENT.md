# Deployment Guide

Three options — Railway (easiest), Render (free tier), or Vercel + Railway split.

---

## Option A: Railway (Recommended — both services in one project)

Railway gives you a single project with two services and automatic HTTPS.

### Steps

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   gh repo create assignment-summarizer --public --push
   # or use GitHub Desktop / the GitHub website
   ```

2. **Create a Railway account**  
   Go to https://railway.app and sign in with GitHub.

3. **New Project → Deploy from GitHub repo**  
   Select your `assignment-summarizer` repository.

4. **Add the backend service**
   - Click "Add Service" → "GitHub Repo" → select repo
   - Set **Root Directory** to `server`
   - Railway will auto-detect Node.js
   - Add environment variables (Settings → Variables):
     ```
     OPENAI_API_KEY=sk-...
     OPENAI_MODEL=gpt-3.5-turbo
     PORT=3001
     ```
   - Railway auto-assigns a public URL like `https://server-xxx.railway.app`

5. **Add the frontend service**
   - Click "Add Service" again → same repo
   - Set **Root Directory** to `client`
   - Set **Build Command** to `npm run build`
   - Set **Start Command** to `npx serve dist -l 8080`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-server-service.railway.app
     ```

6. **Update the frontend to use the env var**  
   In `client/src/App.jsx`, replace the fetch URL:
   ```js
   const API_BASE = import.meta.env.VITE_API_URL || "";
   // then:
   const response = await fetch(`${API_BASE}/api/summarize`, { ... });
   ```

7. **Redeploy** — Railway redeploys automatically on git push.

---

## Option B: Render (Free tier available)

### Backend (Web Service)

1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/index.js`
4. Add environment variables in the Render dashboard:
   ```
   OPENAI_API_KEY=sk-...
   PORT=10000
   ```
5. Deploy. Note your service URL: `https://assignment-summarizer-api.onrender.com`

> ⚠️ Free tier Render services spin down after 15 min of inactivity (cold start ~30s).

### Frontend (Static Site)

1. New → Static Site
2. Same repo, **Root Directory:** `client`
3. **Build Command:** `npm install && npm run build`
4. **Publish Directory:** `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```
6. Deploy.

---

## Option C: Vercel (Frontend) + Railway (Backend)

This is a common split for React + Node apps.

### Backend → Railway
Follow Option A steps 3–4 for the server only.

### Frontend → Vercel

1. Go to https://vercel.com → New Project → Import from GitHub
2. Set **Root Directory** to `client`
3. Framework preset: **Vite**
4. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-backend.railway.app
   ```
5. Deploy. Vercel gives a URL like `https://assignment-summarizer.vercel.app`

---

## CORS Note for Production

When frontend and backend are on different domains, update CORS in `server/src/index.js`:

```js
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend-domain.vercel.app",   // your actual frontend URL
    "https://your-frontend-domain.railway.app",
  ],
}));
```

---

## Environment Variables Summary

| Variable | Where | Required | Example |
|---|---|---|---|
| `OPENAI_API_KEY` | server `.env` | ✅ Yes | `sk-proj-...` |
| `OPENAI_MODEL` | server `.env` | Optional | `gpt-3.5-turbo` |
| `PORT` | server `.env` | Optional | `3001` |
| `VITE_API_URL` | client (build time) | Production only | `https://api.railway.app` |

---

## Quick Local Test Before Deploying

```bash
# 1. Install everything
npm run install:all    # from project root

# 2. Start backend
npm run dev:server

# 3. Start frontend (new terminal)
npm run dev:client

# 4. Open http://localhost:5173
```

Health check: http://localhost:3001/health should return `{"status":"ok",...}`
