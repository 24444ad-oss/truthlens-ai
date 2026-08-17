
require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const { tavily } = require("@tavily/core");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
    try {
        const content = req.body.content;

        if (!content) {
            return res.status(400).json({
                error: "No content provided."
            });
        }
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
console.log("TAVILY SEARCH STARTED");
const searchResponse = await tvly.search(content, {
    search_depth: "basic",
    max_results: 3
});
console.log("TAVILY SEARCH FINISHED");
console.log("Sources found:", searchResponse.results?.length || 0);

const sources = searchResponse.results || [];
       const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const aiResponse = await openai.responses.create({
    model: "gpt-5.6",
    input: `Analyze the claim for misinformation using the web evidence provided.

IMPORTANT:
- Decide whether the CLAIM itself is supported or contradicted by the evidence.
- Your Verdict MUST match your reasoning.
- If the evidence says the claim is a myth, false, debunked, or contradicted, the Verdict must be "Likely False".
- Do not confuse a statement ABOUT a false claim with the claim itself.

You MUST answer using exactly these 3 lines:

Verdict: Likely True
Confidence: 90
Explanation: Give 2-4 sentences explaining why the claim is true or false based on the evidence.

Rules:
- Verdict must be exactly: Likely True, Likely False, or Uncertain.
- Confidence must be ONE NUMBER from 1 to 100.
- Do not write the % symbol.
- Never use Confidence: 0.
- Do not invent sources.
- Do not contradict the evidence.

Evidence from web search:
${sources.map(source => `Title: ${source.title}
Content: ${source.content}
URL: ${source.url}`).join("\n\n")}

Claim:
${content}`
});

const aiText = aiResponse.output_text.trim();
        const aiText = response.response.trim();

const verdictMatch = aiText.match(/Verdict:\s*(.*?)(?=\s*Confidence:|$)/i);
const confidenceMatch = aiText.match(/Confidence:\s*(\d+)/i);
const explanationMatch = aiText.match(/Explanation:\s*([\s\S]*)/i);

res.json({
    result: verdictMatch ? verdictMatch[1].trim() : "Analysis Complete",
    message: "AI analysis completed.",
    status: verdictMatch ? verdictMatch[1].trim() : "Analysis Complete",
   confidence: confidenceMatch
    ? Math.max(1, Math.min(100, Number(confidenceMatch[1]))) + "%"
    : "Not available",
    explanation: explanationMatch
        ? explanationMatch[1].trim()
        : aiText,

    sources: sources.map(source => ({
        title: source.title,
        url: source.url
    }))
});

    } catch (error) {
        console.error("AI ERROR:", error);

        res.status(500).json({
            error: "AI analysis failed.",
            message: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});