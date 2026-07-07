/**
 * Secure Portfolio Server
 * Express.js server with security headers, caching, and compression
 * 
 * Run with: node server.js
 */

const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// ===================================
// SECURITY MIDDLEWARE
// ===================================

// Helmet.js - Set various HTTP headers for security
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    }
}));

// X-Frame-Options: Prevent clickjacking
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
});

// ===================================
// COMPRESSION & CACHING
// ===================================

// Gzip compression for assets
app.use(compression());

// ===================================
// STATIC FILES SERVING
// ===================================

// ===================================
// SITE CONFIG (deploy-time configurable via env vars)
// ===================================

// Which HTML file the live site serves at "/". Override at deploy time with
// the MAIN_PAGE env var — e.g. set MAIN_PAGE=network.html to switch the whole
// site back to the classic design.
const MAIN_PAGE = process.env.MAIN_PAGE || 'cinematic.html';

// Whether the classic design is reachable at /network. Off by default so only
// the main site is accessible; set EXPOSE_NETWORK=true to enable it.
const EXPOSE_NETWORK = process.env.EXPOSE_NETWORK === 'true';

// Gate: block direct access to raw .html files and to /network (unless
// explicitly exposed) so the site is only reachable through the routes below.
app.use((req, res, next) => {
    const p = req.path.toLowerCase();
    if (p.endsWith('.html')) return res.redirect(302, '/');
    if (p === '/network' && !EXPOSE_NETWORK) return res.redirect(302, '/');
    next();
});

// Serve static files — no caching in dev, 1d in production
const isDev = process.env.NODE_ENV !== 'production';
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: isDev ? 0 : '1d',
    etag: !isDev,
    index: false,
}));

// ===================================
// ROUTES
// ===================================

// Home page — the live main site
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', MAIN_PAGE));
});

// Classic design — reachable only when EXPOSE_NETWORK=true
app.get('/network', (req, res) => {
    if (!EXPOSE_NETWORK) return res.redirect(302, '/');
    res.sendFile(path.join(__dirname, 'public', 'network.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all for 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', MAIN_PAGE));
});

// ===================================
// ERROR HANDLING
// ===================================

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: NODE_ENV === 'production' 
            ? 'Internal Server Error' 
            : err.message
    });
});

// ===================================
// SERVER START
// ===================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║        Arish Ballana - Portfolio Site                      ║
║        Secure | Self-Hosted | Production Ready             ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Server running at: http://localhost:${PORT}
║  Environment: ${NODE_ENV}
║  Port: ${PORT}
║                                                            ║
║  Security Features Enabled:                               ║
║  ✓ Helmet.js Security Headers                             ║
║  ✓ Content Security Policy (CSP)                          ║
║  ✓ HTTPS Ready (SSL/TLS support)                          ║
║  ✓ Compression (Gzip)                                     ║
║  ✓ Clickjacking Protection                                ║
║  ✓ XSS Protection                                         ║
║  ✓ MIME Type Sniffing Prevention                          ║
║  ✓ Referrer Policy Enforcement                            ║
║                                                            ║
║  Press Ctrl+C to stop the server                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;
