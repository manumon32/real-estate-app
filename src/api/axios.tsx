import axios from 'axios';
import {createHmacSignature, createBodyHash} from './handshake';
// import {v4 as uuidv4} from 'uuid';
// import DeviceInfo from 'react-native-device-info';

// const CLIENT_ID = await DeviceInfo.getBuildId();
const API_BASE_URL = 'https://api.example.com';
const SECRET_KEY =
  'c9b5123f5677aa23121b409de425e886448b81cf0e3d96f684b14f8d78382598';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config: any) => {
    const timestamp = new Date().toISOString();
    const nonce = '143'; //uuidv4();
    const bodyHash = createBodyHash(config.body);
    const stringToSign = [
      config.method,
      config.path,
      timestamp,
      nonce,
      bodyHash,
    ].join('\n');
    const signature = createHmacSignature(SECRET_KEY, stringToSign);

    config.headers = {
      ...(config.headers || {}),
      'X-Timestamp': timestamp,
      'X-Signature': signature,
      'Content-Type': 'application/json',
      'X-CLIENT-ID': '1234',
      'X-NONCE': nonce,
    };

    return config;
  },
  error => Promise.reject(error),
);

export default api;
