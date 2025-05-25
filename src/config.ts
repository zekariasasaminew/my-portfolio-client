const API_BASE_URL = 'https://127.0.0.1:3001';

export const ENDPOINTS = {
  LAST_PLAYED: `${API_BASE_URL}/api/spotify/current-track`,
} as const; 