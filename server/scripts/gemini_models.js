import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        const models = await genAI.listModels();
        console.log("Available Gemini models:\n");

        models.models.forEach(m => {
            console.log(`- ${m.name}`);
        });
    } catch (err) {
        console.error("Failed to list models:", err);
    }
}

listModels();
