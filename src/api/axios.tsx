import axios from 'axios';
import {
  createHmacSignature,
  createBodyHash,
  createHadShakeHmacSignature,
} from './handshake';
import uuid from 'react-native-uuid';
const API_BASE_URL = 'https://api.example.com';
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
      // const url = config.url || '';

      // // Parse to get only path (remove domain)
      // let path = url;
      // try {
      //   const parsed = new URL(url);
      //   path = parsed.pathname;
      // } catch (e) {
      //   // url might already be a relative path
      //   path = url;
      // }
      const stringToSign = [
        config.method.toUpperCase(),
        '/property',
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
      console.log(bodyHash);
      console.log('header only', {
        ...(config.headers || {}),
        'X-Timestamp': timestamp,
        'X-Signature': signature,
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
