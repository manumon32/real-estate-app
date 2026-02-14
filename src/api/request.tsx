import Toast from 'react-native-toast-message';
import { AxiosError, AxiosResponse } from 'axios';
import api from './axios';
import { logoutAndRedirect } from '../utils/logoutAndRedirect';

export type RequestMethod = 'get' | 'post' | 'put' | 'delete';

interface ApiRequestProps {
  method: RequestMethod;
  url: string;
  data?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
}

const AUTH_ERROR_ENDPOINTS = [
  '/auth/login',
  '/user/send-email-otp',
  '/user/verify-email-otp',
  '/user/send-mobile-otp',
  '/user/verify-mobile-otp',
  '/auth/update-contact',
  '/auth/send-mobile-otp',
];

const IMAGE_UPLOAD_ENDPOINT = '/files/upload-images';

export const apiRequest = async <T = any>({
  method,
  url,
  data,
  params,
  headers,
}: ApiRequestProps): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.request({
      method,
      url,
      data,
      params,
      headers,
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;

    console.log('--- API Error ---');
    console.log('Message:', error.message);
    console.log('Status:', error.response?.status);
    console.log('Response Data:', error.response?.data);
    console.log('Request URL:', error.config?.url);

    const requestUrl = error.config?.url;
    const errorMessage =
      error.response?.data?.msg || 'Something went wrong. Please try again later.';

    if (requestUrl && AUTH_ERROR_ENDPOINTS.includes(requestUrl)) {
      Toast.show({
        type: 'error',
        text1: error.response?.data?.msg || 'Invalid OTP.',
        position: 'bottom',
      });
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      logoutAndRedirect();
    } else if (requestUrl === IMAGE_UPLOAD_ENDPOINT) {
      Toast.show({
        type: 'error',
        text1: 'Some images failed to upload. Please retry.',
        position: 'bottom',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: errorMessage,
        position: 'bottom',
      });
    }

    throw error;
  }
};
