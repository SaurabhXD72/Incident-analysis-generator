import LLMClient from '../src/llm/LLMClient.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function testLLMs() {
    const client = new LLMClient();

    const dummyFacts = {
        timelineAnalysis: { eventsCount: 5 },
        logAnalysis: { uniqueErrors: ['Connection Refused'], errorCount: 10 },
        metricAnalysis: { breaches: [{ metric: 'cpu', value: 99 }] },
        correlations: [{ rule: 'High CPU', description: 'Possible loop' }]
    };

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL
    });

    console.log(`Using Gemini Model: ${process.env.GEMINI_MODEL}`);
    try {
        const result = await model.generateContent("Say hello in one sentence");
        console.log("Gemini Basic Test:", result.response.text());
    } catch (e) {
        console.error("Gemini Basic Test Failed:", e.message);
    }

    console.log("\n--- Testing Hugging Face (trash) ---");
    const hlSelection = { provider: 'HuggingFace', model: process.env.HF_MODEL };
    const hfRes = await client.generatePostMortem(dummyFacts, hlSelection);
    console.log("Hugging Face Result:", hfRes.summary ? "SUCCESS" : "FAILED", hfRes.summary ? hfRes.summary.substring(0, 50) + "..." : hfRes);
}

testLLMs();
