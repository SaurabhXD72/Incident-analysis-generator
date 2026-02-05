import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: 'nothing to see here' // or inline for testing
});

async function main() {
    const response = await ai.models.generateContent({
        model: "models/gemini-1.5-flash-latest",
        contents: [
            {
                role: "user",
                parts: [{ text: "Explain how AI works in a few words" }]
            }
        ]
    });

    console.log(response.text);
}

main().catch(console.error);
