import axios from 'axios';
import type { TranscriptResponse, TranscribeRequest, VideoInfoResponse } from '../types/transcript';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  getVideoInfo: async (url: string): Promise<VideoInfoResponse> => {
    const payload = { url };
    const response = await apiClient.post<VideoInfoResponse>('/video-info', payload);
    return response.data;
  },
  transcribeVideo: async (url: string): Promise<TranscriptResponse> => {
    const payload: TranscribeRequest = { url };
    const response = await apiClient.post<TranscriptResponse>('/transcribe', payload);
    return response.data;
  },
  downloadVideo: async (url: string, quality: string): Promise<Blob> => {
    const payload = { url, quality };
    const response = await apiClient.post('/download-video', payload, {
      responseType: 'blob'
    });
    return response.data;
  }
};
