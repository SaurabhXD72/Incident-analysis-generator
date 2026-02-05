import fetch from "node-fetch";

const API_KEY = "nothing to see here";
const MODEL = "models/gemini-2.5-flash";

async function main() {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: "Explain how AI works in a few words" }]
                    }
                ]
            })
        }
    );

    const data = await res.json();

    const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No text returned";

    console.log(text);
}

main().catch(console.error);
