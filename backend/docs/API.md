# Trail Tail API Documentation

## Overview

This document provides comprehensive documentation for the Trail Tail API, which powers the AI-driven family adventure hiking application. The API follows RESTful principles and uses structured error handling and logging.

## Authentication

*Note: Authentication will be implemented in a future version.*

## Base URL

All API endpoints are prefixed with `/api/v1`.

## Error Handling

The API uses standardized error responses across all endpoints:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error context
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid input parameters |
| `PROVIDER_ERROR` | Error from a service provider |
| `CONFIGURATION_ERROR` | System configuration issue |
| `AUTHORIZATION_ERROR` | Permission denied |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Unexpected server error |

## Routes

### Trail Routes API

#### Generate Route

```
GET /api/v1/routes/generate
```

Generates a hiking route based on starting coordinates and preferences.

**Parameters:**
- `start_lat` (float, required): Starting latitude
- `start_lng` (float, required): Starting longitude
- `distance` (float, optional): Preferred distance in kilometers (default: 3.0)
- `difficulty` (string, optional): Route difficulty: "easy", "moderate", or "hard" (default: "easy")
- `with_children` (boolean, optional): Is the route family-friendly (default: true)

**Response:**
```json
{
  "id": "route_12345",
  "name": "Family-friendly Easy Adventure Trail",
  "distance": 3.0,
  "elevation_gain": 120.5,
  "estimated_time": 60,
  "difficulty": "easy",
  "points": [
    {
      "lat": 47.6062,
      "lng": -122.3321,
      "elevation": 100.0,
      "description": "Starting point - Trailhead parking area"
    },
    // ... more points
  ],
  "description": "A scenic trail with beautiful views"
}
```

#### Get Route Details

```
GET /api/v1/routes/{route_id}
```

Retrieve details of a specific route.

**Parameters:**
- `route_id` (string, required): Route identifier

**Response:** Detailed route information

#### Find Nearby Routes

```
GET /api/v1/routes/nearby
```

Find routes near a specific location.

**Parameters:**
- `lat` (float, required): Current latitude
- `lng` (float, required): Current longitude
- `radius` (float, optional): Search radius in kilometers (default: 10.0)

**Response:** Array of route summaries

### Narratives API

#### Generate Narrative

```
GET /api/v1/narratives/generate/{route_id}
```

Generate narrative stories for waypoints along a route.

**Parameters:**
- `route_id` (string, required): Route identifier
- `mode` (string, optional): Narrative mode: "history" or "fantasy" (default: "fantasy")
- `child_age` (integer, optional): Age of child for age-appropriate content (default: 10)
- `language` (string, optional): Content language code (default: "en")

**Response:**
```json
[
  {
    "title": "The Dragon's Bridge",
    "story": "Legend says that a friendly dragon named Ember lives under this bridge!...",
    "waypoint_id": "wp_123",
    "images": ["dragon.jpg", "bridge.jpg"],
    "facts": ["Dragons are mythical creatures", "This bridge was built in 1887"]
  },
  // ... more narrative segments
]
```

#### Preview Narratives

```
GET /api/v1/narratives/preview/{route_id}
```

Preview narratives for parent approval before sharing with children.

**Parameters:**
- `route_id` (string, required): Route identifier
- `mode` (string, optional): Narrative mode: "history" or "fantasy" (default: "fantasy")

**Response:** Preview with additional parental guidance information

## Additional APIs

Documentation for AR Encounters, Users, and Safety endpoints will be added in future updates.

## Rate Limiting

*Note: Rate limiting will be implemented in a future version.*

## Versioning

The API version is specified in the URL path. The current version is v1.
