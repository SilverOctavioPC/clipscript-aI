import React, { useState } from 'react';
import { Upload, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface VideoInputProps {
  onSubmit: (url: string, quality?: string) => void;
  isLoading: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
  loadingText?: string;
  icon?: React.ReactNode;
  showQualitySelector?: boolean;
}

export function VideoInput({ 
  onSubmit, 
  isLoading,
  title = "Transcribir Video",
  description = "Pega el enlace de un video de TikTok, Facebook, YouTube, Instagram Reels o X (Twitter) para extraer su texto mágico.",
  buttonText = "Transcribir Ahora",
  loadingText = "Procesando...",
  icon = <Upload className="h-5 w-5" />,
  showQualitySelector = false
}: VideoInputProps) {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('max');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Por favor, ingresa una URL válida.');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('El enlace introducido no parece ser válido. Asegúrate de incluir http:// o https://');
      return;
    }

    onSubmit(url, showQualitySelector ? quality : undefined);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h2>
        <p className="text-slate-400">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <LinkIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl leading-5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="https://www.tiktok.com/@usuario/video/123..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {showQualitySelector && (
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center justify-between">
              Calidad del video:
              {quality === 'max' && <span className="text-xs text-indigo-400 bg-indigo-900/40 px-2 py-0.5 rounded">Mejor opción para cortos</span>}
              {quality === '1080p' && <span className="text-xs text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded">Recomendada para +15 mins</span>}
            </label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              disabled={isLoading}
              className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="max">Máxima Resolución (Incluye 2K/4K)</option>
              <option value="1080p">Alta Definición (1080p)</option>
              <option value="720p">Estándar HD (720p)</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {loadingText}
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              {icon}
              <span>{buttonText}</span>
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
