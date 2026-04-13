from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, HttpUrl
import os
import shutil

from services.downloader import download_audio, download_video_file, get_video_info_data
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

class DownloadRequest(BaseModel):
    url: str
    quality: str = "max"

class VideoInfoRequest(BaseModel):
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
            
@app.post("/download-video")
async def download_video_endpoint(request: DownloadRequest, background_tasks: BackgroundTasks):
    """
    Downloads the best quality video and returns it as a file.
    """
    url = request.url
    quality = request.quality
    try:
        print(f"Downloading full video from {url} at {quality} quality...")
        
        if request.quality == "audio":
            file_path = download_audio(request.url, TEMP_DIR)
            media_type = 'audio/mpeg'
        else:
            file_path = download_video_file(request.url, TEMP_DIR, request.quality)
            media_type = 'video/mp4'
            
        # Add a background task to delete the file after sending it
        background_tasks.add_task(cleanup_files, [file_path])
        
        return FileResponse(
            path=file_path, 
            media_type=media_type, 
            filename=os.path.basename(file_path)
        )
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error downloading video {url}: {error_msg}")
        raise HTTPException(status_code=400, detail=f"No se pudo descargar el video: {error_msg}")

@app.post("/video-info")
async def video_info_endpoint(request: VideoInfoRequest):
    """
    Returns video metadata and available formats.
    """
    try:
        print(f"Extracting video info from {request.url}...")
        return get_video_info_data(request.url)
    except Exception as e:
        error_msg = str(e)
        print(f"Error extracting info {request.url}: {error_msg}")
        raise HTTPException(status_code=400, detail=f"No se pudo obtener información del video: {error_msg}")

@app.get("/health")
def health_check():
    return {"status": "ok"}
