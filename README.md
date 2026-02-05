# Incident Analysis Generator

A production-grade **Post-Mortem Generator** that combines deterministic signal extraction with AI-powered root cause analysis. Built with a dual-layer architecture that separates manual analysis from AI reasoning, ensuring defensible and transparent incident reports.

![Demo](./demo.png)

## 🎯 Features

### Core Architecture
- **Dual-Layer Analysis**: Deterministic rule-based signal extraction + AI-powered synthesis
- **LLM Integration**: Exclusively powered by **Gemini 2.5 Flash** via REST API
- **Strict JSON Schemas**: Enforced output format with model signatures and provenance tracking
- **Mock Mode Fallback**: Graceful degradation when API keys are unavailable

### Backend (Node.js + Express)
- **ES Modules**: Fully migrated to modern JavaScript module system
- **Rate Limiting**: Global limit of 5 requests/minute on AI endpoints
- **Timeout Protection**: 30-second timeout on all LLM API calls
- **Deterministic Analysis Engine**: Extracts timeline, logs, metrics, and correlations without AI
- **Context Complexity Analyzer**: Evaluates incident complexity to inform model selection
- **Model Selection Engine**: Routes requests to appropriate LLM based on complexity

### Frontend (React + Vite)
- **Professional Dashboard**: Clean engineering-tool aesthetic with sidebar navigation
- **Multi-Tab Interface**: Timeline, Logs, Metrics, and Analysis views
- **Real-Time Progress**: Visual spinner-based checklist during AI generation
- **Signal Visualization**: Static snapshots of metrics with breach detection
- **Structured Output**: Clear separation of deterministic facts vs. AI insights
- **Humorous Takes**: AI-generated witty summaries in Hinglish

### Data & Incidents
- **5 Unique Incidents**: High-entropy, realistic scenarios (OOM crashes, DB timeouts, deploy regressions, etc.)
- **Hardcoded Data**: JSON/TXT files with timeline, logs, and metrics
- **No Database**: In-memory/static file storage for simplicity

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Gemini API Key ([Get one here](https://aistudio.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SaurabhXD72/Incident-analysis-generator.git
   cd Incident-analysis-generator
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies (if any)
   npm install

   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure API Keys**
   
   Create a `.env` file in the `server/` directory:
   ```bash
   cd server
   cp .env.example .env  # Or create manually
   ```

   Add your Gemini API key to `server/.env`:
   ```env
   # API Keys for Post-Mortem Generator
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=models/gemini-2.5-flash

   # Optional: Hugging Face (not currently used)
   HF_API_KEY=
   HF_MODEL=
   ```

4. **Start the Backend**
   ```bash
   cd server
   node src/index.js
   ```
   Server will run on `http://localhost:3001`

5. **Start the Frontend**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

6. **Open in Browser**
   
   Navigate to `http://localhost:5173` and start analyzing incidents!

## 📁 Project Structure

```
.
├── server/
│   ├── src/
│   │   ├── engines/
│   │   │   ├── InputLoader.js              # Loads incident data from filesystem
│   │   │   ├── DeterministicAnalysisEngine.js  # Rule-based signal extraction
│   │   │   ├── ContextComplexityAnalyzer.js    # Complexity assessment
│   │   │   └── ModelSelectionEngine.js         # LLM routing logic
│   │   ├── llm/
│   │   │   └── LLMClient.js                # Gemini REST API integration
│   │   └── index.js                        # Express server + routes
│   ├── data/
│   │   ├── inc-001/                        # Incident 1 (OOM crash)
│   │   ├── inc-002/                        # Incident 2 (DB timeout)
│   │   └── ...                             # 5 total incidents
│   ├── scripts/
│   │   └── test_keys.js                    # API key verification script
│   └── .env                                # API keys (gitignored)
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx               # Incident list view
│   │   │   └── IncidentView.jsx            # Detailed incident analysis
│   │   ├── App.jsx                         # React Router setup
│   │   └── index.css                       # Global styles
│   └── index.html
└── README.md
```

## 🔧 API Endpoints

### `GET /api/incidents`
Returns list of all available incidents.

**Response:**
```json
[
  {
    "id": "inc-001",
    "title": "Payment Service OOM Crash",
    "severity": "critical",
    "status": "resolved",
    "timestamp": "2024-01-15T14:23:00Z"
  }
]
```

### `GET /api/incidents/:id`
Returns full incident data (meta, timeline, logs, metrics).

### `POST /api/analyze/deterministic`
Runs deterministic analysis on an incident.

**Request:**
```json
{ "id": "inc-001" }
```

**Response:**
```json
{
  "timelineAnalysis": { ... },
  "logAnalysis": { ... },
  "metricAnalysis": { ... },
  "correlations": [ ... ]
}
```

### `POST /api/analyze/ai`
Generates AI-powered post-mortem.

**Request:**
```json
{ "id": "inc-001" }
```

**Response:**
```json
{
  "complexity": { ... },
  "modelSelection": {
    "provider": "Gemini",
    "model": "models/gemini-2.5-flash",
    "reason": "..."
  },
  "result": {
    "summary": "...",
    "impact": "...",
    "root_cause_hypothesis": "...",
    "what_went_wrong": [ ... ],
    "what_went_right": [ ... ],
    "action_items": [ ... ],
    "humourous take": "..."
  }
}
```

**Rate Limit:** 5 requests/minute (429 error if exceeded)

## 🧪 Testing

Test your API keys:
```bash
cd server
node scripts/test_keys.js
```

Expected output:
```
Using Gemini Model: models/gemini-2.5-flash
Gemini Basic Test: Hello!
```

## 🛡️ Security & Resilience

- **Environment Variables**: All API keys stored in `.env` (gitignored)
- **Rate Limiting**: Global 5 req/min limit on AI endpoints
- **Timeout Protection**: 30s timeout on all LLM calls
- **Graceful Fallback**: Mock mode activates if keys are missing or API fails
- **Model Signatures**: All AI outputs tagged with `[Generated by models/gemini-2.5-flash]`

## 🎨 Design Principles

1. **Defensibility**: Clear separation of deterministic facts vs. AI reasoning
2. **Transparency**: All signals labeled as "static snapshots" or "AI-generated"
3. **No Hallucination**: AI strictly derives insights from extracted facts
4. **Professional UX**: Engineering-tool aesthetic, not consumer-facing
5. **Interview-Ready**: Production-grade code suitable for technical discussions

## 📝 License

MIT

## 👤 Author

**Saurabh**
- GitHub: [@SaurabhXD72](https://github.com/SaurabhXD72)

---

**Built with:** Node.js, Express, React, Vite, Gemini 2.5 Flash
