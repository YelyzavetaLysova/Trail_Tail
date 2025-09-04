#!/bin/bash

# Change to script directory
cd "$(dirname "$0")"

# Check for virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
if [ -f "venv/bin/activate" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Install or update dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists, create from example if not
if [ ! -f ".env" ] && [ -f "config.env.example" ]; then
    echo "Creating .env file from example..."
    cp config.env.example .env
    echo "Please update the .env file with your configuration values."
fi

# Create log directory if it doesn't exist
mkdir -p logs

# Run the application
echo "Starting Trail Tail API server..."
python -m uvicorn main:app --reload
