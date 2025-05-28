const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const ENDPOINTS = {
  LAST_PLAYED: `${API_BASE_URL}/api/spotify/current-track`,
} as const;