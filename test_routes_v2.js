import express from 'express';
const app = express();

try {
    app.get(/^(?!\/api).*/, (req, res) => res.send('ok'));
    console.log('Successfully registered Regex /^(?!\\/api).*/');
} catch (e) {
    console.log('Failed Regex:', e.message);
}

try {
    app.get('/*', (req, res) => res.send('ok'));
    console.log('Successfully registered /*');
} catch (e) {
    console.log('Failed /*:', e.message);
}

process.exit(0);
