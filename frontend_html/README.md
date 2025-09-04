# Trail Tail Frontend Server

This directory contains the frontend server for Trail Tail, a family-friendly hiking application.

## Features

- **Express Server**: Serves static HTML, CSS, and JavaScript files
- **Security**: Uses Helmet for security headers
- **Performance**: Implements compression and caching
- **Logging**: Morgan logger for request logging
- **Health Check**: Endpoint for monitoring server health
- **Auto-Route Generation**: Automatically creates routes for HTML files

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Run the setup script:

```bash
chmod +x setup-server.sh
./setup-server.sh
```

Or manually install dependencies:

```bash
npm install
```

### Running the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Environment Variables

- `PORT`: Server port (default: 3001)
- `BACKEND_URL`: URL for the backend API (default: http://localhost:8001)

## Project Structure

- `server.js`: Main Express server file
- `/css`: Stylesheet directory
- `/js`: JavaScript files
- `/images`: Image assets
- `/logs`: Server logs (auto-generated)

## Available Routes

- `/`: Home page
- `/explore.html`: Trail exploration page
- `/trail.html`: Individual trail view
- `/how-it-works.html`: Feature explanation page
- `/login.html`: User login page
- `/register.html`: User registration page
- `/dashboard.html`: User dashboard
- `/safety.html`: Safety information page
- `/health`: Server health check endpoint

## License

All rights reserved.
