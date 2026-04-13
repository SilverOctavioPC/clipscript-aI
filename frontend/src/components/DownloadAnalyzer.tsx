import React, { useState } from 'react';
import { Search, Clock } from 'lucide-react';
import type { VideoInfoResponse } from '../types/transcript';
import { api } from '../services/api';

interface DownloadAnalyzerProps {
  onDownload: (url: string, quality: string, videoTitle: string) => Promise<void>;
  isDownloadingGlobal: boolean;
}

export function DownloadAnalyzer({ onDownload, isDownloadingGlobal }: DownloadAnalyzerProps) {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfoResponse | null>(null);
  const [selectedQuality, setSelectedQuality] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setError('');
    setVideoInfo(null);
    setIsAnalyzing(true);
    
    try {
      const info = await api.getVideoInfo(url);
      setVideoInfo(info);
      if (info.formats && info.formats.length > 0) {
        setSelectedQuality(info.formats[0].height.toString()); // default
      }
    } catch (err) {
       const errorMsg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
       setError(errorMsg || "Error obteniendo datos del video.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadClick = async () => {
    if (!videoInfo || !selectedQuality) return;
    setError('');
    try {
      const qualityParam = selectedQuality === "9999" 
        ? "max" 
        : selectedQuality === "-1" 
          ? "audio" 
          : `${selectedQuality}p`;
      await onDownload(url, qualityParam, videoInfo.title);
      // Reset form on success
      setVideoInfo(null);
      setUrl('');
    } catch (err) {
      const errorMsg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(errorMsg || "Error en la descarga.");
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
      {!videoInfo ? (
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Analizar Video</h2>
            <p className="text-slate-400">Pega el enlace para extraer la información y calidades disponibles antes de descargar.</p>
          </div>
          <div className="relative group">
            <input
              type="text"
              className="block w-full pl-4 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl leading-5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-sans"
              placeholder="YouTube, TikTok, Facebook, Instagram Reels, o X..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>
          {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
          <button
            type="submit"
            disabled={isAnalyzing || !url}
            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all duration-200"
          >
            {isAnalyzing ? "Buscando información..." : (
               <span className="flex items-center gap-2"><Search className="w-5 h-5" /> Analizar Video</span>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-slate-700">
            {videoInfo.thumbnail && (
              <img src={videoInfo.thumbnail} alt="Thumbnail" className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-lg border border-slate-600 block shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-100 mb-1 truncate" title={videoInfo.title}>{videoInfo.title}</h3>
              <p className="text-sm text-slate-400 flex items-center gap-1">
                <Clock className="w-4 h-4" /> {formatDuration(videoInfo.duration)}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Resolución a descargar:</label>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              disabled={isDownloadingGlobal}
              className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              {videoInfo.formats.map((fmt) => (
                <option key={fmt.height} value={fmt.height.toString()}>
                  {fmt.resolutionText} {fmt.approxMb ? `( ~${fmt.approxMb} MB )` : ''}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="flex gap-3">
             <button
              onClick={() => setVideoInfo(null)}
              disabled={isDownloadingGlobal}
              className="p-3 px-6 rounded-xl font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50 border border-slate-600 border-b-slate-800"
            >
              Cerrar
            </button>
            <button
              onClick={handleDownloadClick}
              disabled={isDownloadingGlobal}
              className="flex-1 flex justify-center items-center p-3 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {isDownloadingGlobal ? "Descargando Archivo..." : selectedQuality === "-1" ? "Descargar Audio (MP3)" : "Iniciar Descarga de MP4"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
