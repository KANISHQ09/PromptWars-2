from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import json
import os
from services.ai_service import ai_service
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Indian Election Assistant API")

# Add CORS middleware to allow all origins for deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|model)$")
    parts: List[str]

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="The user's query about the Indian Election.")
    history: Optional[List[dict]] = Field(default=[], max_length=50, description="Previous chat history.")

@app.get("/")
async def root():
    return {"message": "Welcome to the Indian Election Assistant API"}

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Convert history format if necessary (Gemini expects {'role': 'user/model', 'parts': [str]})
        response = await ai_service.get_chat_response(request.message, request.history)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/election/data")
async def get_election_data():
    return ai_service.election_data

@app.get("/election/timeline")
async def get_timeline():
    return ai_service.election_data.get("timeline", [])

@app.get("/election/steps")
async def get_steps():
    return ai_service.election_data.get("key_steps", [])

@app.get("/booths")
async def get_booths():
    try:
        booths_path = os.path.join(os.path.dirname(__file__), "data", "booths.json")
        with open(booths_path, "r") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/candidates")
async def get_candidates():
    try:
        candidates_path = os.path.join(os.path.dirname(__file__), "data", "candidates.json")
        with open(candidates_path, "r") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Use PORT environment variable if available (for Cloud Run)
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
