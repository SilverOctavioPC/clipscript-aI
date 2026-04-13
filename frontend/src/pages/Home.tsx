import { useState } from 'react';
import { VideoInput } from '../components/VideoInput';
import { DownloadAnalyzer } from '../components/DownloadAnalyzer';
import { Loading } from '../components/Loading';
import { TranscriptResult } from '../components/TranscriptResult';
import { api } from '../services/api';
import type { TranscriptResponse } from '../types/transcript';
import { AlertCircle, Waves, Cpu, Download, FileText } from 'lucide-react';

export function Home() {
  const [activeTab, setActiveTab] = useState<'transcribe' | 'download'>('transcribe');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTranscribe = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setTranscript(null);

    try {
      const result = await api.transcribeVideo(url);
      setTranscript(result);
    } catch (err) {
      console.error('Error procesando video:', err);
      const errorMsg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(
        errorMsg || 
        'Ocurrió un error inesperado al intentar transcribir el video. Revisa el enlace e inténtalo nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (url: string, quality?: string, videoTitle?: string) => {
    setIsDownloading(true);
    setError(null);
    setTranscript(null); // Clear previous transcripts if any

    try {
      const blob = await api.downloadVideo(url, quality || "max");
      
      // Clean up title for file name (allows Spanish chars)
      const cleanTitle = videoTitle ? videoTitle.replace(/[^\w\s\u00C0-\u017F-]/gi, '').trim().substring(0, 50) : 'video_descargado';
      const fileExt = quality === 'audio' ? 'mp3' : 'mp4';
      
      // Create a temporary link to download the file
      const urlObject = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlObject;
      link.download = `${cleanTitle}.${fileExt}`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(urlObject);
    } catch (err) {
      console.error('Error descargando video:', err);
      const errorMsg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(errorMsg || 'Error en la descarga. Puede que el video sea muy pesado o el enlace inválido.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden font-sans text-slate-100 flex flex-col">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>

      <header className="w-full border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg ring-1 ring-white/10">
                <Waves className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                ClipScript AI
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <span>Powered by Whisper</span>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            {activeTab === 'transcribe' ? (
              <>Transcribe tu contenido en <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">segundos</span></>
            ) : (
              <>Descarga videos en su <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">máxima calidad</span></>
            )}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light">
            {activeTab === 'transcribe' 
              ? 'Convierte cualquier video de redes sociales en texto estructurado. Perfecto para creadores y editores.'
              : 'Guarda videos completos de YouTube, TikTok o Facebook directamente a tu dispositivo.'}
          </p>
        </div>

        <div className="max-w-xs mx-auto mb-8 bg-slate-800/50 p-1.5 rounded-2xl flex justify-between border border-slate-700/50 relative z-20">
          <button
            onClick={() => { setActiveTab('transcribe'); setError(null); }}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'transcribe' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <FileText className="h-4 w-4" />
            Transcribir
          </button>
          <button
            onClick={() => { setActiveTab('download'); setError(null); }}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'download' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Download className="h-4 w-4" />
            Descargar
          </button>
        </div>

        {activeTab === 'transcribe' ? (
          <VideoInput onSubmit={handleTranscribe} isLoading={isLoading} />
        ) : (
          <DownloadAnalyzer 
            onDownload={handleDownload} 
            isDownloadingGlobal={isDownloading} 
          />
        )}

        {error && (
          <div className="max-w-2xl mx-auto mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-red-200">Error en el Proceso</h3>
            <p className="text-red-400/80 text-sm max-w-md">{error}</p>
          </div>
        )}

        {(isLoading || isDownloading) && <Loading />}

        {transcript && !isLoading && !error && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <TranscriptResult transcript={transcript} />
          </div>
        )}
      </main>
      
      <footer className="w-full border-t border-white/5 py-8 mt-auto z-10 text-center text-slate-500 text-sm">
        <p>ClipScript AI &copy; {new Date().getFullYear()}. Desarrollado con ❤️</p>
      </footer>
    </div>
  );
}
