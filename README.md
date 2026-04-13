<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/PyTorch-CUDA-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch">
  <img src="https://img.shields.io/badge/Whisper-AI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="Whisper">
  <img src="https://img.shields.io/badge/yt--dlp-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="yt-dlp">
</p>

<h1 align="center">🎬 ClipScript AI</h1>

<p align="center">
  <strong>Transcribe y Descarga videos de redes sociales a máxima calidad impulsado por Inteligencia Artificial</strong>
</p>

<p align="center">
  Soporte total para <b>YouTube</b>, <b>TikTok</b>, <b>Facebook</b>, <b>Instagram Reels</b> y <b>X (Twitter)</b>.
</p>

---

## ✨ Características Principales

| Función | Descripción |
|---|---|
| 🧠 **Transcriptor IA Inteligente** | Utiliza OpenAI Whisper (Modelo *Small*) para generar subtítulos y textos perfectos con tiempos precisos a una velocidad superior al tiempo real. |
| ⬇️ **Descargador de Alta Fidelidad** | Descarga los archivos en su calidad nativa sin límite de resolución. El sistema fuerza la fusión de video y audio vía FFmpeg para garantizar que nunca falte una pista. |
| 🔍 **Analizador Previo Automático** | Al pegar un enlace, se inspecciona el video y se despliegan en pantalla **exclusivamente** las resoluciones reales disponibles con pesos aproximados en MB. |
| 🎵 **Extracción de Audio Especializada** | Opción para descargar una versión pura en `.mp3` de cualquier podcast o video directamente a tu PC. |
| 🏷️ **Nomenclatura Limpia** | Los archivos descargados detectan el título original del video limpiando caracteres inválidos de Windows automáticamente (Ej. `Todos_los_Easter_Eggs.mp4`). |
| 🚀 **Aceleración por Hardware (GPU)** | Scripts automatizados para vincular la Inteligencia Artificial al poder de tarjetas gráficas NVIDIA (CUDA) reduciendo tiempos de espera drásticamente. |


---

## 🧰 Tech Stack

<table>
  <tr>
    <td align="center"><b>Frontend</b></td>
    <td>React · TypeScript · Vite · Tailwind CSS · Lucide React</td>
  </tr>
  <tr>
    <td align="center"><b>Backend</b></td>
    <td>Python · FastAPI · yt-dlp · PyTorch (CUDA) · FFmpeg · OpenAI Whisper</td>
  </tr>
</table>

---

## 🚀 Instalación y Despliegue Automatizado

ClipScript AI está diseñado para funcionar en entornos Windows locales y cuenta con scripts de despliegue con un solo clic.

### 1️⃣ Pre-Requisitos
1. [Node.js](https://nodejs.org/) (`v16+`) para React.
2. [Python](https://www.python.org/) (`v3.9+`) para el Backend IA.
3. [FFmpeg](https://github.com/BtbN/FFmpeg-Builds/releases) configurado como Variable de Entorno en tu Windows.

### 2️⃣ Primer Paso: Preparar las Dependencias de la IA (Backend)
Si tienes una tarjeta **NVIDIA RTX**, utiliza nuestro script instalador que prepara el entorno para que vuele a máxima velocidad:
* Otorga doble clic al archivo `activar_gpu.bat` en la carpeta raíz.
* *Nota: Descargará ~2.5 GB iniciales de herramientas matemáticas de PyTorch-CUDA.*

### 3️⃣ Arranque General
Una vez listos los paquetes matemáticos y librerías, simplemente usa los ejecutables en la raíz del proyecto para prender o apagar la herramienta:

* 🟢 **Prender la herramienta:** Doble clic en `iniciar_servidores.bat`
* 🔴 **Apagar la herramienta:** Doble clic en `detener_servidores.bat`

La interfaz web vivirá en `http://localhost:5173`.

> [!NOTE] 
> La consola de Python descargará automáticamente la versión de Inteligencia Artificial de modelo `"Small"` de OpenAI la primera vez que arranques tu servidor. Toma unos pocos minutos (pesa un par de cientos de Megas) y después quedará guardada de forma permanente para volar.

---

## 📡 Arquitectura API Reference

Las nuevas rutas en nuestro servidor de **FastAPI**:

### `POST /video-info`
Analiza rápida y silenciosamente un enlace de red social.
**Devuelve:** El título del video, la miniatura, duración, y una lista de todas las calidades (resoluciones y audios) exactos con su peso en megabytes.

### `POST /download-video`
Orquesta a `yt-dlp` y `FFmpeg` para asegurar la descarga del contenedor.
**Soporte Dinámico:** Puedes enviarle cualquier calidad (ej. `"1080p"`, `"480p"`, `"max"`, o `"audio"`) y el servidor configurará sus descargas para entregarte tu archivo puro de MP4 o MP3.

### `POST /transcribe`
Acelera el audio a través del chip neuronal (GPU si está presente o CPU) por medio de OpenAI Whisper.
**Devuelve:** Un JSON contiendo el texto en bloque junto con el arreglo de diccionarios precisando cada línea dictada (`start`, `end`, `text`).

---

<p align="center">
  Hecho con ❤️ por <b>SilverOctavioPC</b>
</p>