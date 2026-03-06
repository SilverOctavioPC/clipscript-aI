import yt_dlp
import os
import uuid
import time

MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds between retries

def download_audio(url: str, output_dir: str) -> str:
    """
    Uses yt-dlp to download a video and extract its audio to MP3 using ffmpeg.
    Includes automatic retry logic for platforms like TikTok that may block
    the first request due to anti-bot protection.
    Returns the absolute path to the downloaded MP3 file.
    """
    file_id = str(uuid.uuid4())
    output_template = os.path.join(output_dir, f"{file_id}.%(ext)s")
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_template,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '128',
        }],
        'quiet': True,
        'no_warnings': True,
        # Extra options for better TikTok/social media compatibility
        'extractor_retries': 3,
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
    }
    
    last_error = None
    
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
                
            expected_output_path = os.path.join(output_dir, f"{file_id}.mp3")
            
            if not os.path.exists(expected_output_path):
                raise Exception("No se generó el archivo de audio después de la descarga.")
                
            return expected_output_path
            
        except yt_dlp.utils.DownloadError as e:
            last_error = e
            if attempt < MAX_RETRIES:
                print(f"  Intento {attempt}/{MAX_RETRIES} falló, reintentando en {RETRY_DELAY}s...")
                time.sleep(RETRY_DELAY)
            else:
                raise Exception(
                    f"Fallo al descargar el video después de {MAX_RETRIES} intentos. "
                    f"Verifica que el enlace sea válido y público. "
                    f"Detalle: {str(e)}"
                )
        except Exception as e:
            raise Exception(f"Error inesperado en el proceso de descarga: {str(e)}")
