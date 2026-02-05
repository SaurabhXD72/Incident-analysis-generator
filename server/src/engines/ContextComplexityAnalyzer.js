class ContextComplexityAnalyzer {
    static analyze(facts) {
        const signalCount = facts.timelineAnalysis.eventsCount + facts.logAnalysis.uniqueErrors.length + facts.metricAnalysis.breaches.length;
        const ambiguityScore = this.calculateAmbiguity(facts);

        // Rough estimation: 1 word ~ 1.3 tokens. 
        // We estimate based on the raw log line count and complexity of signals
        const estimatedTokens = (facts.logAnalysis.lineCount * 15) + (signalCount * 50);

        return {
            signalCount,
            ambiguityScore,
            estimatedTokens,
            complexityLevel: (ambiguityScore > 5 || estimatedTokens > 4000) ? 'HIGH' : 'LOW'
        };
    }

    static calculateAmbiguity(facts) {
        let score = 0;

        // If we have no correlations, it's ambiguous
        if (facts.correlations.length === 0) score += 3;

        // If we have mixed signals (e.g. OOM but also DB timeouts)
        if (facts.logAnalysis.hasOOM && facts.logAnalysis.hasTimeout) score += 2;

        // If it mentions specific difficult error types
        if (facts.logAnalysis.uniqueErrors.some(e => e.includes('segfault') || e.includes('deadlock'))) score += 3;

        return score;
    }
}

export default ContextComplexityAnalyzer;
