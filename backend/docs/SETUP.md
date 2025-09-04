# Trail Tail Developer Setup

This document provides instructions for setting up and running the Trail Tail backend development environment.

## Prerequisites

- Python 3.11 or newer
- pip (Python package installer)
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Trail_Tail.git
cd Trail_Tail
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate the virtual environment:

- On Windows:
  ```bash
  venv\Scripts\activate
  ```

- On macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory:

```
# Development environment settings
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=DEBUG

# API settings
HOST=0.0.0.0
PORT=8000
VERSION=0.1.0

# CORS settings
CORS_ORIGINS=["*"]
CORS_METHODS=["*"]
CORS_HEADERS=["*"]

# Feature flags
ENABLE_MOCK_PROVIDERS=true
ENABLE_ANALYTICS=false
```

### 5. Run the Application

```bash
python main.py
```

The API will be available at http://localhost:8000

You can access the API documentation at http://localhost:8000/api/docs

## Project Structure

```
backend/
├── main.py                    # Application entry point
├── requirements.txt           # Python dependencies
├── app/
│   ├── core/                  # Core functionality
│   │   ├── config.py          # Configuration management
│   │   ├── errors/            # Error handling
│   │   │   ├── exceptions.py  # Custom exceptions
│   │   │   └── handlers.py    # Error handlers
│   │   └── logging/           # Logging system
│   │       └── logger.py      # Logger configuration
│   ├── providers/             # Service providers
│   │   ├── provider_factory.py # Provider factory
│   │   ├── interfaces/        # Provider interfaces
│   │   └── mock/              # Mock implementations
│   └── routes/                # API routes
│       ├── routes.py          # Trail routes endpoints
│       ├── narratives.py      # Narrative generation endpoints
│       └── ...                # Other endpoints
└── docs/                      # Documentation
    └── API.md                 # API documentation
```

## Development Guidelines

### Code Style

The project follows PEP 8 style guidelines for Python code.

### Error Handling

All errors should use the standardized error handling system defined in `app/core/errors/`.

### Logging

Use the application logger defined in `app/core/logging/logger.py`:

```python
from app.core.logging.logger import get_logger

logger = get_logger(__name__)
logger.info("Message", extra={"context": "value"})
```

### Provider Pattern

When implementing a new feature:

1. Define the provider interface in `app/providers/interfaces/`
2. Create a mock implementation in `app/providers/mock/`
3. Register the provider in `app/providers/provider_setup.py`
4. Use the provider via `ProviderFactory` in your routes

## Testing

```bash
# Run tests
pytest

# Run tests with coverage
pytest --cov=app
```

## Building and Deployment

*Deployment instructions will be added in a future version.*
