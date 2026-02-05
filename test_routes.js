import express from 'express';
const app = express();

try {
    app.get('/:path*', (req, res) => res.send('ok'));
    console.log('Successfully registered /:path*');
} catch (e) {
    console.log('Failed /:path*:', e.message);
}

try {
    app.get('/:path(.*)', (req, res) => res.send('ok'));
    console.log('Successfully registered /:path(.*)');
} catch (e) {
    console.log('Failed /:path(.*):', e.message);
}

try {
    app.get('/:catchAll(.*)*', (req, res) => res.send('ok'));
    console.log('Successfully registered /:catchAll(.*)*');
} catch (e) {
    console.log('Failed /:catchAll(.*)*:', e.message);
}

try {
    app.get('*', (req, res) => res.send('ok'));
    console.log('Successfully registered *');
} catch (e) {
    console.log('Failed *:', e.message);
}

process.exit(0);
