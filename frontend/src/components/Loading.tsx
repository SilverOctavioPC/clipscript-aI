import { FileAudio, Sparkles } from 'lucide-react';

export function Loading() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center justify-center p-12 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse rounded-full w-24 h-24"></div>
        <div className="relative bg-slate-800 p-4 rounded-full border border-slate-700 mb-6 shadow-2xl">
          <FileAudio className="h-10 w-10 text-indigo-400 animate-bounce" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
        </div>
      </div>
      
      <h3 className="text-xl font-medium text-slate-200 mb-3 tracking-wide">Analizando el audio...</h3>
      
      <div className="w-64 space-y-3">
        <div className="flex items-center space-x-3 text-sm text-slate-400">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></div>
          <span>Descargando video...</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-slate-500 opacity-70">
          <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
          <span>Extrayendo pista de audio...</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-slate-500 opacity-50">
          <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
          <span>Generando transcripción con Inteligencia Artificial...</span>
        </div>
      </div>
      
      <div className="mt-8 w-full max-w-xs h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-1/3 animate-[loading_2s_ease-in-out_infinite] rounded-full"></div>
      </div>
    </div>
  );
}
