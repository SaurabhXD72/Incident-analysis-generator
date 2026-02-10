# Render Split Deployment Guide

To successfully deploy the Incident Analysis Generator, follow these steps to set up **two separate services** on Render.

## 1. Backend (Web Service)
This service handles the API and AI analysis.

*   **Service Type**: Web Service
*   **Runtime**: Node
*   **Repo**: (Your Repo)
*   **Build Command**: `cd server && npm install`
*   **Start Command**: `node src/index.js`
*   **Environment Variables**:
    *   `GEMINI_API_KEY`: (Your Google AI Key)
    *   `GEMINI_MODEL`: `models/gemini-2.5-flash-lite`
    *   `PORT`: `3001` (Render will override this, which is fine)

---

## 2. Frontend (Static Site)
This service hosts the React UI.

*   **Service Type**: Static Site
*   **Repo**: (Your Repo)
*   **Build Command**: `cd client && npm install && npm run build`
*   **Publish Directory**: `client/dist`
*   **Environment Variables**:
    *   `VITE_API_URL`: (The URL of your **Render Backend Web Service**)
        *   Example: `https://incident-analysis-backend.onrender.com`

---

## ✅ Deployment Summary
1.  Deploy the **Backend** first to get its URL.
2.  Deploy the **Frontend**, providing the Backend's URL as `VITE_API_URL`.
3.  Ensure you have added your **GitHub repo** to both services.
