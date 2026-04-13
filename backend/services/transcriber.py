import whisper
import os
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"

# Load the model once when the module is imported to save time on subsequent requests
# Using 'small' model. It's an excellent balance of high precision for Spanish/English and speed.
try:
    print(f"Loading Whisper model ('small') on [{device.upper()}]...")
    model = whisper.load_model("small", device=device)
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
        # fp16 (media precision) is very fast on CUDA, but typically disabled on CPU
        use_fp16 = True if device == "cuda" else False
        result = model.transcribe(file_path, fp16=use_fp16)
        
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
