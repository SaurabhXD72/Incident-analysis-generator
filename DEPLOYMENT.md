# Render Deployment Guide

## Quick Answers for Render Setup

### Backend Service (Node.js)

**Build Command:**
```bash
npm install && npm run install:server
```

**Start Command:**
```bash
npm start
```

**Health Check Path:**
```
/healthz
```

**Pre-Deploy Command:**
```
# Leave empty (not needed for this project)
```

**Auto-Deploy:**
```
✅ Enabled (recommended)
```

---

## Step-by-Step Deployment

### 1. Create Backend Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `SaurabhXD72/Incident-analysis-generator`
4. Configure:
   - **Name:** `incident-analysis-backend` (or your choice)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** Leave empty
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run install:server`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free` (or paid if needed)

### 2. Environment Variables

Add these in the **Environment** section:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=models/gemini-2.5-flash
PORT=3001
```

### 3. Health Check

- **Health Check Path:** `/healthz`
- **Health Check Interval:** 30 seconds (default)

### 4. Advanced Settings (Optional)

- **Auto-Deploy:** ✅ Yes (deploys on every git push)
- **Pre-Deploy Command:** Leave empty

---

## Frontend Deployment (Optional)

If you want to deploy the frontend separately:

### Create Static Site

1. Click **"New +"** → **"Static Site"**
2. Connect same repo
3. Configure:
   - **Name:** `incident-analysis-frontend`
   - **Branch:** `main`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

### Update Frontend API URL

After backend is deployed, update `client/src/pages/IncidentView.jsx` and `client/src/pages/Dashboard.jsx`:

Replace:
```javascript
fetch('http://localhost:3001/api/...')
```

With:
```javascript
fetch('https://your-backend-url.onrender.com/api/...')
```

---

## Post-Deployment Checklist

- [ ] Backend service shows "Live" status
- [ ] Health check at `/healthz` returns `{"status":"ok"}`
- [ ] Test API endpoint: `https://your-url.onrender.com/api/incidents`
- [ ] Environment variables are set correctly
- [ ] Logs show "Server running on http://localhost:3001"

---

## Troubleshooting

### Build Fails
- Check build logs for missing dependencies
- Ensure `server/package.json` exists
- Verify Node version compatibility

### Health Check Fails
- Ensure `/healthz` endpoint is accessible
- Check if server is listening on correct PORT
- Review application logs

### API Errors
- Verify `GEMINI_API_KEY` is set correctly
- Check CORS settings if frontend is on different domain
- Review rate limiting (5 req/min)

---

## Free Tier Limits

Render Free Tier includes:
- 750 hours/month
- Spins down after 15 min of inactivity
- Cold start ~30s when waking up
- 512 MB RAM

**Note:** For production, consider upgrading to a paid plan for always-on service.
