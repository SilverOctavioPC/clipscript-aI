from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import os
import shutil

from services.downloader import download_audio
from services.transcriber import transcribe_audio
from services.utils import cleanup_files

app = FastAPI(title="ClipScript AI API", description="Transcription API for social media videos")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class TranscribeRequest(BaseModel):
    url: str

# Create temporary folder for downloads
TEMP_DIR = os.path.join(os.path.dirname(__file__), "temp")
os.makedirs(TEMP_DIR, exist_ok=True)

@app.post("/transcribe")
async def transcribe_endpoint(request: TranscribeRequest):
    """
    Downloads audio from the given URL, transcribes it, and cleans up temporary files.
    """
    url = request.url
    audio_path = None
    
    try:
        # Step 1: Download and extract audio
        print(f"Downloading video from {url}...")
        audio_path = download_audio(url, TEMP_DIR)
        
        # Step 2: Transcribe using Whisper
        print(f"Transcribing {audio_path}...")
        result = transcribe_audio(audio_path)
        
        return result
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error processing URL {url}: {error_msg}")
        raise HTTPException(status_code=400, detail=f"No se pudo procesar el video: {error_msg}")
        
    finally:
        # Step 3: Cleanup temporary files
        if audio_path:
            cleanup_files([audio_path])
            
@app.get("/health")
def health_check():
    return {"status": "ok"}
