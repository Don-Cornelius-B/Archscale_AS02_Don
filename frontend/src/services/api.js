import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getBaseline = async () => {
  const response = await api.get('/api/baseline');
  return response.data;
};

export const getPresets = async () => {
  const response = await api.get('/api/presets');
  return response.data;
};

export const processMessage = async (payload) => {
  const response = await api.post('/api/process', payload);
  return response.data;
};
