class ModelSelectionEngine {
    static selectModel(complexity) {
        // ALWAYS use Gemini as per user request
        return {
            provider: 'Gemini',
            model: process.env.GEMINI_MODEL,
            reason: `Forced Gemini selection (Env: ${process.env.GEMINI_MODEL}). Complexity: ${complexity.complexityLevel}`
        };
    }
}

export default ModelSelectionEngine;
