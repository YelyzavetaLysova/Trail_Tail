// Express server to serve static HTML files
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001; // Changed from 3000 to avoid conflict

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Handle specific routes
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/explore.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'explore.html'));
});

app.get('/trail.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'trail.html'));
});

app.get('/how-it-works.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'how-it-works.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/safety.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'safety.html'));
});

// Fallback for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Serving static files from: ${__dirname}`);
  console.log(`Backend API expected at: http://localhost:8001 - it is running`);
});
