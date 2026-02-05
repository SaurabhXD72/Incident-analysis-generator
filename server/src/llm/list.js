import fetch from "node-fetch";

const API_KEY = "AIzaSyC1ZRSXYSkCiqDDTZBijuC7EX96CzYvRFM";

async function main() {
    const res = await fetch(
        "https://generativelanguage.googleapis.com/v1/models?key=" + API_KEY
    );

    const data = await res.json();
    console.dir(data, { depth: null });
}

main().catch(console.error);
