import axios from 'axios';
import axiosRetry from 'axios-retry';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {createHmacSignature, createBodyHash} from './handshake';

const API_BASE_URL = 'https://api.hotplotz.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds
});

// Retry failed requests (timeouts, network errors)
axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount: any) => retryCount * 1000, // 1s, 2s, 3s
  retryCondition: (error: any) => {
    // retry on network errors or 5xx
    return (
      axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error)
    );
  },
});

// Queue for offline requests
const offlineQueue: Array<{config: any}> = [];

// Check network status
let isConnected = true;
NetInfo.addEventListener(state => {
  isConnected = state.isConnected ?? false;

  if (isConnected && offlineQueue.length > 0) {
    // Retry queued requests
    offlineQueue.forEach(async item => {
      try {
        await api(item.config);
      } catch (e) {
        console.log('Retry failed for queued request', e);
      }
    });
    offlineQueue.length = 0; // clear queue
  }
});

// Request interceptor: HMAC signing & offline handling
api.interceptors.request.use(
  async (config: any) => {
    // Check network before sending request
    if (!isConnected) {
      console.log('Offline: Queuing request', config.url);
      offlineQueue.push({config});
      // Reject now to prevent axios error
      return Promise.reject({message: 'No Internet Connection', config});
    }

    // Only sign requests with X-TOKEN
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

// Response interceptor: handle errors & cache GET responses
api.interceptors.response.use(
  async response => {
    // Cache GET responses
    if (response.config.method === 'get') {
      const key = `CACHE:${response.config.url}`;
      await AsyncStorage.setItem(key, JSON.stringify(response.data));
    }
    return response;
  },
  async error => {
    const status = error?.response?.status;

    if (!error.response) {
      // Network error
      console.log('Network Error:', error.message);
      return Promise.reject(error);
    }

    // Handle 401 / 403
    if ([401, 403].includes(status)) {
      // logoutAndRedirect();
    }

    // Try returning cached GET response if offline
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
