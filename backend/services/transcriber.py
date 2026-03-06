import whisper
import os

# Load the model once when the module is imported to save time on subsequent requests
# 'base' is a good balance between speed and accuracy for an MVP.
# Available models: tiny, base, small, medium, large, large-v2, large-v3
try:
    print("Loading Whisper model (base)...")
    model = whisper.load_model("base")
    print("Whisper model loaded successfully.")
except Exception as e:
    print(f"Error loading Whisper model: {e}")
    model = None

def transcribe_audio(file_path: str) -> dict:
    """
    Transcribes the given audio file using OpenAI's Whisper model.
    Returns a dictionary containing the full text and segments with timestamps.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Archivo de audio no encontrado: {file_path}")
        
    if model is None:
        raise RuntimeError("El modelo Whisper no se pudo cargar. Revisa los logs del servidor.")

    try:
        # fp16=False is often needed for CPU inference to avoid warnings/errors
        result = model.transcribe(file_path, fp16=False)
        
        # Format the segments map to ensure it matches our frontend interface
        segments = []
        for segment in result.get("segments", []):
            segments.append({
                "start": segment["start"],
                "end": segment["end"],
                "text": segment["text"].strip()
            })
            
        return {
            "text": result.get("text", "").strip(),
            "segments": segments
        }
    except Exception as e:
        raise Exception(f"Error durante la transcripción: {str(e)}")
