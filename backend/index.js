const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

const VALID_TONES = ["professional", "enthusiastic", "concise"];

const SYSTEM_PROMPT = `You are an expert cover letter writer. Your job is to craft a tailored, authentic cover letter that sounds like a real person wrote it — not a template engine.

Rules you must follow:
- Never open with "I am writing to express my interest" or any variation of it.
- Avoid filler phrases like "I believe I would be a great fit", "I am excited about this opportunity", or "With my extensive experience".
- Do not use corporate buzzwords like "synergy", "leverage", "spearhead", "results-driven", or "passionate self-starter".
- Write in a natural, conversational tone that still feels polished.
- Open with something specific — a connection to the company's work, a relevant accomplishment, or a direct statement of what you bring.
- Tie the candidate's background directly to what the job demands. Be specific, not vague.
- Keep it to 3-4 paragraphs. No fluff, every sentence should earn its place.
- End with a confident, human close — not a robotic "I look forward to hearing from you at your earliest convenience".
- Output only the cover letter text. No subject lines, no labels, no markdown formatting.`;

function buildUserPrompt(jobDescription, background, tone) {
  return `Write a cover letter with a ${tone} tone.

Job Description:
${jobDescription}

Candidate Background:
${background}`;
}

app.post("/api/generate", async (req, res) => {
  const { jobDescription, background, tone = "professional" } = req.body;

  if (!jobDescription || !jobDescription.trim()) {
    return res.status(400).json({ error: "jobDescription is required and cannot be empty." });
  }

  if (!background || !background.trim()) {
    return res.status(400).json({ error: "background is required and cannot be empty." });
  }

  const selectedTone = VALID_TONES.includes(tone) ? tone : "professional";

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(jobDescription, background, selectedTone) },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const coverLetter = chatCompletion.choices[0]?.message?.content;

    if (!coverLetter) {
      return res.status(500).json({ error: "No response received from the AI model." });
    }

    return res.json({ coverLetter });
  } catch (err) {
    console.error("Groq API error:", err.message);
    return res.status(500).json({ error: "Failed to generate cover letter. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Letter Forge backend running on http://localhost:${PORT}`);
});
