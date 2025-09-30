/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import axiosRetry from 'axios-retry';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import {createHmacSignature, createBodyHash} from './handshake';
import {API_URL} from '@constants/api';

const API_BASE_URL = API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 240000, // 2 min
});

// Retry failed requests
axiosRetry(api, {
  retries: 3,
  retryDelay: retryCount => retryCount * 1000, // 1s, 2s, 3s
  retryCondition: error => {
    return (
      axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error)
    );
  },
});

// Queue for offline requests
const offlineQueue: Array<{config: any}> = [];

// Check network status
let isConnected = true;
var isWeakNetwork = false;

NetInfo.addEventListener(state => {
  isConnected = state.isConnected ?? false;

  // Mark weak if on 2G/3G
  const gen = (state.details as any)?.cellularGeneration;
  if (gen === '2g' || gen === '3g') {
    isWeakNetwork = true;
    Toast.show({
      type: 'error',
      text1: 'Internet is weak',
      text2: 'Please wait...',
      visibilityTime: 3000,
      position: 'bottom',
    });
  } else {
    isWeakNetwork = false;
  }

  if (isConnected && offlineQueue.length > 0) {
    offlineQueue.forEach(async item => {
      try {
        await api(item.config);
      } catch (e) {
        console.log('Retry failed for queued request', e);
      }
    });
    offlineQueue.length = 0;
  }
});

// Request interceptor
api.interceptors.request.use(
  async (config: any) => {
    if (!isConnected) {
      console.log('Offline: Queuing request', config.url);
      offlineQueue.push({config});
      return Promise.reject({message: 'No Internet Connection', config});
    }

    // Timer for "Please wait" message
    const toastTimer = setTimeout(() => {
      if (config.method === 'post' && config.url === '/property') {
        Toast.show({
          type: 'info',
          text1: 'Please wait...',
          visibilityTime: 3000,
          position: 'bottom',
        });
      }
    }, 5000); // 5 sec

    // Save timer on config so we can clear it later
    (config as any)._toastTimer = toastTimer;

    // Signing requests
    if (config.headers['X-TOKEN']) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const bodyHash =
        config.headers['Content-Type'] !== 'multipart/form-data'
          ? createBodyHash(config.data ?? '')
          : createBodyHash('');

      const deviceId = config.headers['X-DEVICE-ID'] || uuid.v4();
      const nonce = uuid.v4();
      const url = config.url || '';
      const cleanPath = url.split('?')[0];

      const stringToSign = [
        config.method.toUpperCase(),
        cleanPath,
        timestamp,
        nonce,
        bodyHash,
      ].join('\n');

      const signature = createHmacSignature(
        config.headers['X-TOKEN'],
        stringToSign,
      );

      config.headers = {
        ...(config.headers || {}),
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature,
        'X-NONCE': nonce,
        'X-CLIENT-ID': deviceId,
      };
    }

    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  async response => {
    // Clear toast timer
    if ((response.config as any)._toastTimer) {
      clearTimeout((response.config as any)._toastTimer);
    }

    if (response.config.method === 'get') {
      const key = `CACHE:${response.config.url}`;
      await AsyncStorage.setItem(key, JSON.stringify(response.data));
    }
    return response;
  },
  async error => {
    if ((error.config as any)?._toastTimer) {
      clearTimeout((error.config as any)._toastTimer);
    }

    const status = error?.response?.status;

    if (!error.response) {
      console.log('Network Error:', error.message);
      return Promise.reject(error);
    }

    if ([401, 403].includes(status)) {
      // logoutAndRedirect();
    }

    if (error.config?.method === 'get') {
      const key = `CACHE:${error.config.url}`;
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        console.log('Returning cached response for', error.config.url);
        return Promise.resolve({...error.response, data: JSON.parse(cached)});
      }
    }

    return Promise.reject(error);
  },
);

export default api;
