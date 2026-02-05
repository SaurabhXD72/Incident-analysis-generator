import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import InputLoader from './engines/InputLoader.js';
import DeterministicAnalysisEngine from './engines/DeterministicAnalysisEngine.js';
import ContextComplexityAnalyzer from './engines/ContextComplexityAnalyzer.js';
import ModelSelectionEngine from './engines/ModelSelectionEngine.js';
import LLMClient from './llm/LLMClient.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // Render provides PORT env var

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Rate Limiting
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 5;
let requestCount = 0;
let lastReset = Date.now();

app.use((req, res, next) => {
    if (Date.now() - lastReset > RATE_LIMIT_WINDOW) {
        requestCount = 0;
        lastReset = Date.now();
    }

    if (req.path.includes('/api/analyze/ai') && req.method === 'POST') {
        requestCount++;
        if (requestCount > MAX_REQUESTS) {
            return res.status(429).json({
                error: 'Global rate limit exceeded. Please wait a moment.'
            });
        }
    }
    next();
});

// Routes
app.get('/api/incidents', (req, res) => {
    const ids = InputLoader.getIncidentIds();
    const incidents = ids.map(id => {
        try {
            const data = InputLoader.loadIncident(id);
            return data.meta;
        } catch (e) {
            return null;
        }
    }).filter(Boolean);
    res.json(incidents);
});

app.get('/api/incidents/:id', (req, res) => {
    try {
        const data = InputLoader.loadIncident(req.params.id);
        res.json(data);
    } catch (e) {
        res.status(404).json({ error: 'Incident not found' });
    }
});

app.post('/api/analyze/deterministic', (req, res) => {
    const { id } = req.body;
    try {
        const data = InputLoader.loadIncident(id);
        const facts = DeterministicAnalysisEngine.analyze(data);
        res.json(facts);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/analyze/ai', async (req, res) => {
    const { id } = req.body;
    try {
        const data = InputLoader.loadIncident(id);

        // 1. Deterministic
        const facts = DeterministicAnalysisEngine.analyze(data);

        // 2. Complexity
        const complexity = ContextComplexityAnalyzer.analyze(facts);

        // 3. Selection
        const modelSelection = ModelSelectionEngine.selectModel(complexity);

        // 4. Generation
        const llmClient = new LLMClient();
        const result = await llmClient.generatePostMortem(facts, modelSelection);

        res.json({
            complexity,
            modelSelection,
            result
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// Health check endpoint for Render
app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all route to serve React app (must be last!)
app.get('/:path*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
