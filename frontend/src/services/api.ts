import axios from 'axios';
import type { TranscriptResponse, TranscribeRequest } from '../types/transcript';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  transcribeVideo: async (url: string): Promise<TranscriptResponse> => {
    const payload: TranscribeRequest = { url };
    const response = await apiClient.post<TranscriptResponse>('/transcribe', payload);
    return response.data;
  },
};
