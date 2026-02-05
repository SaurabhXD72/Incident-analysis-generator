import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useParams } from 'react-router-dom';
import IncidentView from './pages/IncidentView';
import './index.css';

function App() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/incidents')
      .then(res => res.json())
      .then(data => setIncidents(data))
      .catch(err => console.error("Failed to load incidents", err));
  }, []);

  return (
    <Router>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-header">Post-Mortem Gen</div>
          <div className="incident-list">
            {incidents.map(inc => (
              <NavLink
                key={inc.id}
                to={`/incidents/${inc.id}`}
                className={({ isActive }) => `incident-item ${isActive ? 'active' : ''}`}
              >
                <h3>{inc.title}</h3>
                <div className="incident-meta">
                  <span className={`badge ${inc.severity}`}>{inc.severity}</span>
                  <span>{inc.service}</span>
                </div>
              </NavLink>
            ))}
          </div>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/incidents/:id" element={<IncidentView />} />
            <Route path="/" element={
              <div className="content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                Select an incident to begin analysis
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
