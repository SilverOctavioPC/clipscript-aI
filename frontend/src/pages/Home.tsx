import { useState } from 'react';
import { VideoInput } from '../components/VideoInput';
import { Loading } from '../components/Loading';
import { TranscriptResult } from '../components/TranscriptResult';
import { api } from '../services/api';
import type { TranscriptResponse } from '../types/transcript';
import { AlertCircle, Waves, Cpu } from 'lucide-react';

export function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTranscribe = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setTranscript(null);

    try {
      const result = await api.transcribeVideo(url);
      setTranscript(result);
    } catch (err: any) {
      console.error('Error procesando video:', err);
      setError(
        err.response?.data?.detail || 
        'Ocurrió un error inesperado al intentar transcribir el video. Revisa el enlace e inténtalo nuevamente.'
      );
    } finally {
      setIsLoading(false);
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
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Transcribe tu contenido en <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">segundos</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light">
            Convierte cualquier video de redes sociales en texto estructurado. 
            Perfecto para creadores, editores y creadores de contenido que necesitan 
            subtítulos rápidos y precisos.
          </p>
        </div>

        <VideoInput onSubmit={handleTranscribe} isLoading={isLoading} />

        {error && (
          <div className="max-w-2xl mx-auto mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-red-200">Error en el Proceso</h3>
            <p className="text-red-400/80 text-sm max-w-md">{error}</p>
          </div>
        )}

        {isLoading && <Loading />}

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
