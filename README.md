# ✍️ StorySpark

A creative writing and typing practice app for grades 1–8, powered by Claude AI.

## Features

- **Creative Writing** — 6 themed spark categories with 4 grade-appropriate prompts each (grades 1–8), plus "My Own Idea" and "Teacher Prompt" options
- **AI Power-Ups** — Claude generates 2–3 story continuation sentences on demand
- **Coach's Corner** — Grade-calibrated AI feedback with grammar tips, story advice, and a continuation challenge
- **Typing Game** — Passages scaled to each grade level with an interactive keyboard, finger guides, and live WPM/accuracy stats
- **Word of the Day** — Grade-appropriate vocabulary word with definition, fetched fresh each session
- **Read Aloud** — Web Speech API reads the story back to the student
- **Milestone Badges** — Celebrates word count milestones mid-writing
- **Auto-save** — Draft saves to localStorage automatically
- **Export** — Downloads a print-ready HTML file with story, coach feedback, and a teacher rubric
- **Dark / Light Mode** — Toggle between themes

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/storyspark.git
cd storyspark
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API key

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

Get an API key at [console.anthropic.com](https://console.anthropic.com).

### 4. Run in development

```bash
npm run dev
```

The Vite dev server runs on `http://localhost:5173`.

> **Note:** In dev mode, AI calls go directly to the Anthropic API via `VITE_API_URL`. Add `VITE_API_URL=https://api.anthropic.com/v1/messages` to your `.env` and your API key as `VITE_ANTHROPIC_API_KEY` — **but only for local dev**. Never expose API keys in a deployed frontend.

### 5. Production build + server

```bash
npm start
```

This builds the frontend and starts the Express proxy server on port 3001. The server injects your `ANTHROPIC_API_KEY` server-side so it's never exposed to the browser.

## Project Structure

```
storyspark/
├── src/
│   ├── App.jsx        # Main application (all components)
│   └── main.jsx       # React entry point
├── public/
│   └── favicon.svg
├── server.js          # Express server + Anthropic API proxy
├── vite.config.js
├── index.html
├── package.json
├── .env.example       # Copy to .env and fill in your key
└── .gitignore
```

## Deploying

### Render / Railway / Fly.io
Set the `ANTHROPIC_API_KEY` environment variable in your platform's dashboard, then run `npm start`.

### Vercel / Netlify
These platforms don't run Express servers directly. Move the proxy logic to a serverless function (e.g. `api/chat.js` for Vercel) and set `ANTHROPIC_API_KEY` as a secret environment variable.

## Security Notes

- **Never commit `.env`** — it's in `.gitignore`
- **Never put your API key in frontend code** — the Express proxy keeps it server-side
- The `.env.example` file is safe to commit; it contains no real secrets

## License

MIT
