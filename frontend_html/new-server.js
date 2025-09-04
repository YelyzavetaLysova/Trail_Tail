/**
 * Trail Tail Frontend Server
 * Modern Express server to serve static HTML files with enhanced features
 */

const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8001';

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create access log stream
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Apply middleware
// Compression to improve performance
app.use(compression());

// Security headers with helmet (but allow inline styles for our prototype)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", BACKEND_URL],
      },
    },
  })
);

// Request logging
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// Cache control for static assets
const setCache = (req, res, next) => {
  // Set cache for CSS, JS, and images
  const staticFileExtensions = ['.css', '.js', '.svg', '.jpg', '.jpeg', '.png', '.gif'];
  const ext = path.extname(req.url);
  
  if (staticFileExtensions.includes(ext)) {
    // Cache for 1 day
    res.setHeader('Cache-Control', 'public, max-age=86400');
  } else {
    // HTML pages - no cache
    res.setHeader('Cache-Control', 'no-cache');
  }
  next();
};

// Apply cache control
app.use(setCache);

// Serve static files with proper caching
app.use(express.static(path.join(__dirname), {
  etag: true,
  lastModified: true
}));

// Enable JSON parsing for API requests
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle HTML routes - auto-generate from file list
const htmlFiles = fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.html'));

// Create routes for all HTML files
htmlFiles.forEach(file => {
  const routePath = file === 'index.html' ? '/' : `/${file}`;
  app.get(routePath, (req, res) => {
    res.sendFile(path.join(__dirname, file));
  });
});

// Fallback route
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`
  ┌───────────────────────────────────────────────────┐
  │                                                   │
  │   Trail Tail Frontend Server                      │
  │                                                   │
  │   🌲 Server running at http://localhost:${PORT}      │
  │   🗂️  Serving static files from: ${__dirname}        │
  │   🔌 Backend API expected at: ${BACKEND_URL}      │
  │                                                   │
  └───────────────────────────────────────────────────┘
  `);
});
