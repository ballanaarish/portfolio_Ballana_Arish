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

// Serve static files — no caching in dev, 1d in production
const isDev = process.env.NODE_ENV !== 'production';
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: isDev ? 0 : '1d',
    etag: !isDev,
    index: false,
}));

// Which HTML file the site serves at "/".
// Switch the entire site back to the classic design by changing this to
// 'network.html' (the classic design also stays available at /network).
const MAIN_PAGE = 'cinematic.html';

// ===================================
// ROUTES
// ===================================

// Home page (current design)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', MAIN_PAGE));
});

// Classic design, kept as a backup
app.get('/network', (req, res) => {
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
