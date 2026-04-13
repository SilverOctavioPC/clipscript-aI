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

def download_video_file(url: str, output_dir: str, quality: str = "max") -> str:
    """
    Uses yt-dlp to download video and audio based on the requested quality.
    Ensures safe merging by strictly requesting mp4/m4a formats when combining.
    Returns the absolute path to the downloaded video file.
    """
    file_id = str(uuid.uuid4())
    output_template = os.path.join(output_dir, f"{file_id}.%(ext)s")
    
    # Define quality format string
    if quality == "max" or quality == "9999":
        format_str = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'
    else:
        # Extrae el número de la calidad (esperamos "144p", "360p", "480p", "720p", etc.)
        try:
            height = int(''.join(filter(str.isdigit, quality)))
            format_str = f'bestvideo[height<={height}][ext=mp4]+bestaudio[ext=m4a]/best[height<={height}][ext=mp4]/best[height<={height}]'
        except ValueError:
            format_str = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'
        
    ydl_opts = {
        'format': format_str,
        'outtmpl': output_template,
        'merge_output_format': 'mp4',
        'quiet': True,
        'no_warnings': True,
        'extractor_retries': 3,
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
    }
    
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                ext = info.get('ext', 'mp4')
            
            expected_output_path = os.path.join(output_dir, f"{file_id}.mp4")
            
            if not os.path.exists(expected_output_path):
                # Fallback if merger failed or output extension differs
                possible_path = os.path.join(output_dir, f"{file_id}.{ext}")
                if os.path.exists(possible_path):
                    return possible_path
                raise Exception("No se generó el archivo de video después de la descarga.")
                
            return expected_output_path
            
        except yt_dlp.utils.DownloadError as e:
            if attempt < MAX_RETRIES:
                print(f"  Intento {attempt}/{MAX_RETRIES} falló, reintentando en {RETRY_DELAY}s...")
                time.sleep(RETRY_DELAY)
            else:
                raise Exception(
                    f"Fallo al descargar el video después de {MAX_RETRIES} intentos. "
                    f"Detalle: {str(e)}"
                )
        except Exception as e:
            raise Exception(f"Error inesperado en el proceso de descarga: {str(e)}")

def get_video_info_data(url: str) -> dict:
    """
    Extracts video metadata including available resolutions.
    """
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            formats = info.get('formats', [])
            video_formats = []
            seen_heights = set()
            
            best_audio_size = 0
            for f in formats:
                if f.get('vcodec') == 'none' and f.get('acodec') != 'none':
                    size = f.get('filesize') or f.get('filesize_approx') or 0
                    if size > best_audio_size:
                        best_audio_size = size
            
            for f in formats:
                height = f.get('height')
                vcodec = f.get('vcodec')
                
                if height and vcodec != 'none':
                    if height not in seen_heights and height >= 360:
                        v_size = f.get('filesize') or f.get('filesize_approx') or 0
                        total_approx_bytes = v_size + best_audio_size
                        mb_size = round(total_approx_bytes / (1024 * 1024), 1) if total_approx_bytes > 0 else None
                        
                        video_formats.append({
                            'height': height,
                            'resolutionText': f"{height}p",
                            'approxMb': mb_size
                        })
                        seen_heights.add(height)
                        
            video_formats = sorted(video_formats, key=lambda x: x['height'], reverse=True)
            
            # Insert max quality at the top
            video_formats.insert(0, {
                'height': 9999,
                'resolutionText': "Máxima (Original)",
                'approxMb': None
            })
            
            # Appending Audio only at bottom
            video_formats.append({
                'height': -1,
                'resolutionText': "Solo Audio (MP3)",
                'approxMb': None
            })
            
            return {
                'title': info.get('title', 'Video sin título'),
                'duration': info.get('duration', 0),
                'thumbnail': info.get('thumbnail', ''),
                'formats': video_formats
            }
    except Exception as e:
        raise Exception(f"No se pudo extraer la información del video: {str(e)}")
