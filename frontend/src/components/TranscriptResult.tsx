import { useState } from 'react';
import type { TranscriptResponse } from '../types/transcript';
import { Copy, Download, FileText, Check, Clock } from 'lucide-react';

interface TranscriptResultProps {
  transcript: TranscriptResponse;
}

export function TranscriptResult({ transcript }: TranscriptResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript.text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'transcripcion.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadSrt = () => {
    let srtContent = '';
    transcript.segments.forEach((segment, index) => {
      const formatTime = (seconds: number) => {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours().toString().padStart(2, '0');
        const mm = date.getUTCMinutes().toString().padStart(2, '0');
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        const ms = date.getUTCMilliseconds().toString().padStart(3, '0');
        return `${hh}:${mm}:${ss},${ms}`;
      };

      srtContent += `${index + 1}\n`;
      srtContent += `${formatTime(segment.start)} --> ${formatTime(segment.end)}\n`;
      srtContent += `${segment.text.trim()}\n\n`;
    });

    const element = document.createElement('a');
    const file = new Blob([srtContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'subtitulos.srt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatTimestamp = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
      <div className="p-6 sm:p-8 shrink-0 border-b border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/50">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-400" />
          Resultado
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-900 rounded-lg hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado' : 'Copiar Texto'}
          </button>
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-900 rounded-lg hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <Download className="h-4 w-4" />
            .TXT
          </button>
          <button
            onClick={handleDownloadSrt}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-900 rounded-lg hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <Download className="h-4 w-4" />
            .SRT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-700">
        <div className="col-span-2 p-6 sm:p-8 bg-slate-900/30">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Texto Completo</h4>
          <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed font-sans text-lg">
            {transcript.text}
          </div>
        </div>
        <div className="col-span-1 border-slate-700 bg-slate-900/50 h-[400px] lg:h-auto overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6 sticky top-0 bg-slate-900/90 backdrop-blur z-10 border-b border-slate-800">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Línea de Tiempo
            </h4>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {transcript.segments.map((segment, idx) => (
              <div key={idx} className="group cursor-default">
                <div className="inline-block px-2 py-1 bg-slate-800 text-xs font-medium text-indigo-400 rounded mb-1 border border-slate-700 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-colors">
                  {formatTimestamp(segment.start)} - {formatTimestamp(segment.end)}
                </div>
                <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors pl-1">
                  {segment.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
