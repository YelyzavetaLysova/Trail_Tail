from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Trail Tail API", description="AI-driven family adventure hiking app")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Trail Tail API"}

# Register providers
from app.providers.provider_setup import register_providers
register_providers()

# Import routes
from app.routes import routes, narratives, ar_encounters, users, safety

# Include routers
app.include_router(routes.router)
app.include_router(narratives.router)
app.include_router(ar_encounters.router)
app.include_router(users.router)
app.include_router(safety.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
