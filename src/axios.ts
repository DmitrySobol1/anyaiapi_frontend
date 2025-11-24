import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor для добавления Telegram initData в заголовки
// Используем нативный Telegram WebApp API вместо SDK,
// так как SDK функции не работают вне React контекста
instance.interceptors.request.use((config) => {
  try {
    const tg = (window as any).Telegram?.WebApp;
    const initData = tg?.initData;

    console.log('[Axios] Telegram WebApp:', !!tg);
    console.log('[Axios] initData:', initData ? 'present' : 'empty/undefined');

    if (initData) {
      config.headers['x-telegram-init-data'] = initData;
    }
  } catch (e) {
    console.error('Failed to get Telegram initData:', e);
  }
  return config;
});

export default instance;
