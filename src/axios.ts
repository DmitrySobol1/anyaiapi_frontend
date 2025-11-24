import axios from 'axios';
import { retrieveLaunchParams } from '@tma.js/sdk-react';




const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor для добавления Telegram initData в заголовки
instance.interceptors.request.use((config) => {
  try {
    const { initDataRaw } = retrieveLaunchParams();
    if (initDataRaw) {
      config.headers['x-telegram-init-data'] = initDataRaw;
    }
  } catch (e) {
    console.error('Failed to get Telegram initData:', e);
  }
  return config;
});

export default instance;
