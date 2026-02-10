import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, Clock, FileText, Cpu, AlertTriangle, CheckCircle, Brain, Terminal, Shield } from 'lucide-react';

function IncidentView() {
    const { id } = useParams();
    const [incident, setIncident] = useState(null);
    const [activeTab, setActiveTab] = useState('timeline');
    const [analysis, setAnalysis] = useState(null); // The final post-mortem
    const [analysisState, setAnalysisState] = useState('idle'); // idle, analyzing, done
    const [progressStep, setProgressStep] = useState(0);

    useEffect(() => {
        setIncident(null);
        setAnalysis(null);
        setAnalysisState('idle');
        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, "");
        fetch(`${baseUrl}/api/incidents/${id}`)
            .then(res => res.json())
            .then(data => setIncident(data));
    }, [id]);

    if (!incident) return <div className="content-area">Loading...</div>;

    const handleGenerate = async () => {
        setAnalysisState('analyzing');
        setProgressStep(0);

        // Simulation of steps for the UI
        const steps = [
            'Extracting deterministic signals...',
            'Analyzing timeline deviations...',
            'Scanning logs for patterns...',
            'Evaluating metric thresholds...',
            'Correlating findings...',
            'Calculating context complexity...',
            'Selecting optimal LLM model...',
            'Generating post-mortem...'
        ];

        for (let i = 0; i < steps.length; i++) {
            setProgressStep(i);
            await new Promise(r => setTimeout(r, 800)); // Fake visual delay
        }

        try {
            const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, "");
            const res = await fetch(`${baseUrl}/api/analyze/ai`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            setAnalysis(data);
            setAnalysisState('done');
        } catch (e) {
            console.error(e);
            setAnalysisState('error');
        }
    };

    return (
        <div className="main-content">
            <div className="top-bar">
                <div>
                    <h1>{incident.meta.title}</h1>
                    <div className="tags" style={{ marginTop: '0.5rem' }}>
                        <span className={`badge ${incident.meta.severity}`}>{incident.meta.severity}</span>
                        <span className="badge resolved">{incident.meta.status}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={14} /> {incident.meta.timestamp}
                        </span>
                    </div>
                </div>
            </div>

            <div className="content-area">
                <div className="tabs">
                    <div className={`tab ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
                        Timeline
                    </div>
                    <div className={`tab ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
                        Logs
                    </div>
                    <div className={`tab ${activeTab === 'metrics' ? 'active' : ''}`} onClick={() => setActiveTab('metrics')}>
                        Metrics
                    </div>
                    <div className={`tab ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>
                        Analysis & Post-Mortem
                    </div>
                </div>

                {activeTab === 'timeline' && (
                    <div className="panel">
                        <h2>Incident Timeline</h2>
                        <div>
                            {incident.timeline.map((event, idx) => (
                                <div key={idx} className={`timeline-event ${event.type}`}>
                                    <div className="timestamp">{event.timestamp}</div>
                                    <div className="event-details">
                                        <strong>{event.event}</strong>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{event.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'logs' && (
                    <div className="panel">
                        <h2>System Logs (Raw Snippet)</h2>
                        <div className="log-viewer">
                            {incident.logs}
                        </div>
                    </div>
                )}

                {activeTab === 'metrics' && (
                    <div className="panel">
                        <h2>Key Metrics (Static Snapshot)</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                            {Object.entries(incident.metrics).map(([key, values]) => (
                                <div key={key} style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '6px' }}>
                                    <h4 style={{ margin: '0 0 1rem 0', textTransform: 'uppercase', fontSize: '0.8rem' }}>{key}</h4>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px', gap: '2px' }}>
                                        {values.map((v, i) => (
                                            <div key={i} style={{
                                                flex: 1,
                                                background: v > 80 ? 'var(--danger-color)' : 'var(--accent-color)',
                                                height: `${Math.min(v, 100)}%`,
                                                opacity: 0.7
                                            }} title={v} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'analysis' && (
                    <div className="analysis-grid">
                        {/* Left: Manual Analysis */}
                        <div className="panel">
                            <h2><Shield size={16} style={{ display: 'inline', marginRight: '8px' }} /> Deterministic Signal Extraction</h2>

                            <div className="fact-group">
                                <div className="fact-title">Detected Signals</div>
                                <div className="fact-item">Primary Metric Breach: <strong>{incident.meta.primary_metric}</strong></div>
                                <div className="fact-item">Events Count: <strong>{incident.timeline.length}</strong></div>
                            </div>

                            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '6px', marginTop: '2rem' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Analyst Note</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    These signals are extracted using regex and threshold logic strictly. No AI inference has been applied yet.
                                </p>
                            </div>
                        </div>

                        {/* Right: AI Analysis */}
                        <div className="panel" style={{ borderColor: analysisState === 'done' ? 'var(--success-color)' : 'var(--border-color)' }}>
                            <h2><Brain size={16} style={{ display: 'inline', marginRight: '8px' }} /> AI-Assisted Root Cause Analysis</h2>

                            {analysisState === 'idle' && (
                                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                                        Generate a structured post-mortem using the extracted signals.
                                    </p>
                                    <button onClick={handleGenerate} style={{
                                        background: 'var(--text-primary)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        margin: '0 auto'
                                    }}>
                                        <Brain size={18} /> Generate Post-Mortem
                                    </button>
                                </div>
                            )}

                            {analysisState === 'analyzing' && (
                                <div className="spinner-list">
                                    {[
                                        'Extracting deterministic signals',
                                        'Analyzing timeline deviations',
                                        'Scanning logs for patterns',
                                        'Evaluating metric thresholds',
                                        'Correlating findings',
                                        'Calculating context complexity',
                                        'Selecting optimal LLM model',
                                        'Generating post-mortem'
                                    ].map((step, idx) => (
                                        <div key={idx} className={`spinner-item ${idx < progressStep ? 'done' : idx === progressStep ? 'active' : ''}`}>
                                            {idx < progressStep ? <CheckCircle size={16} /> : idx === progressStep ? <Activity size={16} className="spin" /> : <div style={{ width: 16, height: 16 }} />}
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {analysisState === 'done' && analysis && (
                                <div>
                                    <div style={{ background: '#f0f9ff', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <span><strong>Selected Model:</strong> {analysis.modelSelection.provider} / {analysis.modelSelection.model}</span>
                                        <span><strong>Context:</strong> {analysis.complexity.estimatedTokens} tokens</span>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Summary</h3>
                                        <p style={{ lineHeight: 1.5, fontSize: '0.9rem' }}>{analysis.result.summary}</p>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Root Cause Hypothesis</h3>
                                        <p style={{ lineHeight: 1.5, fontSize: '0.9rem', fontStyle: 'italic' }}>{analysis.result.root_cause_hypothesis}</p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--danger-color)' }}>What Went Wrong</h4>
                                            <ul style={{ fontSize: '0.9rem', paddingLeft: '1.2rem', margin: '0.5rem 0' }}>
                                                {analysis.result.what_went_wrong.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--success-color)' }}>What Went Right</h4>
                                            <ul style={{ fontSize: '0.9rem', paddingLeft: '1.2rem', margin: '0.5rem 0' }}>
                                                {analysis.result.what_went_right.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Action Items</h3>
                                        <ul style={{ fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
                                            {analysis.result.action_items.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>

                                    {analysis.result["humourous take"] && (
                                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '6px', borderLeft: '4px solid var(--accent-color)' }}>
                                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                                                Humorous Take
                                            </h3>
                                            <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                                "{analysis.result["humourous take"]}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default IncidentView;
