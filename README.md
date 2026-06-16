# Letter Forge

> Cover letters that actually get read.

An AI-powered cover letter generator that takes a job description and your background, and produces a tailored, human-sounding cover letter — no clichés, no filler.

![Letter Forge](https://img.shields.io/badge/built%20with-Groq%20AI-blueviolet) ![Node](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-green) ![React](https://img.shields.io/badge/frontend-React%20%2B%20Tailwind-blue)

---

## Features

- Paste any job description and your background
- Choose a tone: **Professional**, **Enthusiastic**, or **Concise**
- Groq AI (LLaMA 3.3) generates a tailored cover letter instantly
- One-click copy to clipboard
- Glassmorphism UI with smooth Framer Motion animations

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express |
| AI | Groq API (`llama-3.3-70b-versatile`) |

---

## Project Structure

```
letter-forge/
├── backend/
│   ├── node_modules/
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
├── frontend/
│   ├── node_modules/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```
---

## Getting Started

### Prerequisites
- Node.js 18+
- Groq API key → [console.groq.com](https://console.groq.com)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:
```
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

```bash
npm start
```

Backend runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API

**POST** `/api/generate`

**Request:**
```json
{
  "jobDescription": "Frontend Developer at Stripe...",
  "background": "2 years React experience...",
  "tone": "professional"
}
```

**Response:**
```json
{
  "coverLetter": "..."
}
```

---

## Future Improvements

- [ ] Upload resume PDF instead of typing background manually
- [ ] Paste a LinkedIn/Indeed job URL to auto-extract job description
- [ ] Support multiple AI models (GPT-4, Gemini)
- [ ] Cover letter templates (modern, traditional, creative)
- [ ] Dark/Light mode toggle
