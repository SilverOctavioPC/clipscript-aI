import yt_dlp
import os
import uuid

def download_audio(url: str, output_dir: str) -> str:
    """
    Uses yt-dlp to download a video and extract its audio to MP3 using ffmpeg.
    Returns the absolute path to the downloaded MP3 file.
    """
    # Generate unique ID for this download to prevent collisions
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
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            
        # yt-dlp automatically changes the extension to .mp3 because of postprocessors
        expected_output_path = os.path.join(output_dir, f"{file_id}.mp3")
        
        if not os.path.exists(expected_output_path):
            raise Exception("No se generó el archivo de audio después de la descarga.")
            
        return expected_output_path
        
    except yt_dlp.utils.DownloadError as e:
        raise Exception(f"Fallo al descargar el video. Verifica que el enlace sea válido y público. Detalle: {str(e)}")
    except Exception as e:
        raise Exception(f"Unexpected error in download process: {str(e)}")
