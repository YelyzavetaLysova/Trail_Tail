#!/bin/bash
cd "$(dirname "$0")"
echo "Starting Trail Tail API server..."
python -m uvicorn main:app --reload
