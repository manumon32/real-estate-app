import axios from 'axios';
import {
  createHmacSignature,
  createBodyHash,
  createHadShakeHmacSignature,
} from './handshake';
import uuid from 'react-native-uuid';
const API_BASE_URL = 'http://13.61.181.173:8081';
// const SECRET_KEY =
//   'c9b5123f5677aa23121b409de425e886448b81cf0e3d96f684b14f8d78382598';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config: any) => {
    if (config.headers['X-TOKEN']) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const bodyHash = createBodyHash(config.body ? config.body : '');
      const deviceId = config.headers['X-DEVICE-ID'];
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
      const signature =
        config.method == 'get'
          ? createHmacSignature(config.headers['X-TOKEN'], stringToSign)
          : createHadShakeHmacSignature(
              config.headers['X-TOKEN'],
              stringToSign,
            );
      console.log('header only', {
        ...(config.headers || {}),
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature,
        'X-NONCE': nonce,
        'Content-Type': 'application/json',
        'X-CLIENT-ID': deviceId,
      });
      config.headers = {
        ...(config.headers || {}),
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature,
        'X-NONCE': nonce,
        'Content-Type': 'application/json',
        'X-CLIENT-ID': deviceId,
      };
    }
    return config;
  },
  error => Promise.reject(error),
);

export default api;
