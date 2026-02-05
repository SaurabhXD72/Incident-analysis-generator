class DeterministicAnalysisEngine {

    static analyze(incidentData) {
        const timelineAnalysis = this.analyzeTimeline(incidentData.timeline);
        const logAnalysis = this.analyzeLogs(incidentData.logs);
        const metricAnalysis = this.analyzeMetrics(incidentData.metrics);
        const correlations = this.correlate(timelineAnalysis, logAnalysis, metricAnalysis, incidentData.meta);

        return {
            timelineAnalysis,
            logAnalysis,
            metricAnalysis,
            correlations
        };
    }

    static analyzeTimeline(timeline) {
        const trigger = timeline.find(e => e.type === 'trigger');
        const detection = timeline.find(e => e.type === 'alert' || e.type === 'human');
        const mitigation = timeline.find(e => e.type === 'mitigation');
        const resolution = timeline.find(e => e.type === 'resolution');

        return {
            startTime: trigger ? trigger.timestamp : null,
            detectionTime: detection ? detection.timestamp : null,
            mitigationTime: mitigation ? mitigation.timestamp : null,
            resolutionTime: resolution ? resolution.timestamp : null,
            timeToDetection: (trigger && detection) ? 'Calculated Diff' : 'Unknown', // Simplified for demo
            timeToMitigation: (detection && mitigation) ? 'Calculated Diff' : 'Unknown',
            totalDuration: (trigger && resolution) ? 'Calculated Diff' : 'Unknown',
            eventsCount: timeline.length
        };
    }

    static analyzeLogs(logs) {
        const lines = logs.split('\n');
        const errorCount = (logs.match(/ERROR/g) || []).length;
        const warnCount = (logs.match(/WARN/g) || []).length;

        // Extract unique error messages
        const errorLines = lines.filter(l => l.includes('ERROR'));
        const uniqueErrors = [...new Set(errorLines.map(l => l.split(']').pop().trim()))];

        return {
            lineCount: lines.length,
            errorCount,
            warnCount,
            uniqueErrors: uniqueErrors.slice(0, 5), // Top 5
            hasOOM: logs.includes('Out of memory') || logs.includes('heap limit'),
            hasTimeout: logs.includes('Timeout') || logs.includes('timed out'),
            hasConnectionError: logs.includes('Connection refused') || logs.includes('reset by peer')
        };
    }

    static analyzeMetrics(metrics) {
        const breaches = [];

        // CPU Analysis
        if (metrics.cpu) {
            const maxCpu = Math.max(...metrics.cpu);
            if (maxCpu > 85) breaches.push({ metric: 'cpu', type: 'saturation', value: maxCpu, threshold: 85 });
        }

        // Memory Analysis
        if (metrics.memory_mb) {
            // Heuristic: Rising trend?
            const start = metrics.memory_mb[0];
            const end = metrics.memory_mb[metrics.memory_mb.length - 1];
            if (end > start * 1.5) breaches.push({ metric: 'memory', type: 'leak_suspect', value: end, threshold: start * 1.5 });
        }

        // Error Rate
        if (metrics.error_rate || metrics.error_rate_percent) {
            const errs = metrics.error_rate || metrics.error_rate_percent;
            const maxErr = Math.max(...errs);
            if (maxErr > 1) breaches.push({ metric: 'error_rate', type: 'elevated', value: maxErr, threshold: 1 });
        }

        // Latency
        if (metrics.latency) {
            const maxLat = Math.max(...metrics.latency);
            if (maxLat > 2000) breaches.push({ metric: 'latency', type: 'slownes', value: maxLat, threshold: 2000 });
        }

        return {
            breaches,
            dataPoints: Object.keys(metrics).length
        };
    }

    static correlate(timeline, logs, metrics, meta) {
        const findings = [];

        // Rule 1: Deploy + Errors = Regression
        if (meta.title.toLowerCase().includes('deploy') || logs.hasOOM) {
            findings.push({ confidence: 'high', rule: 'Deploy Correlation', description: 'Incident coincides with deployment activity.' });
        }

        // Rule 2: OOM + Restart Loop
        if (logs.hasOOM && metrics.breaches.find(b => b.metric === 'memory')) {
            findings.push({ confidence: 'high', rule: 'Memory Leak', description: 'Log patterns indicate OOM coupled with memory saturation.' });
        }

        // Rule 3: Timeout + Latency
        if (logs.hasTimeout && metrics.breaches.find(b => b.metric === 'latency')) {
            findings.push({ confidence: 'medium', rule: 'Cascading Failure', description: 'High latency correlating with service timeouts.' });
        }

        return findings;
    }
}

export default DeterministicAnalysisEngine;
