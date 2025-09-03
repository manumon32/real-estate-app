import Toast from 'react-native-toast-message';
import api from './axios';
import {logoutAndRedirect} from '../utils/logoutAndRedirect';

export type RequestMethod = 'get' | 'post' | 'put' | 'delete';

interface ApiRequestProps {
  method: RequestMethod;
  url: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}

export const apiRequest = async ({
  method,
  url,
  data,
  params,
  headers,
}: ApiRequestProps): Promise<ApiRequestProps> => {
  try {
    const response = await api.request<ApiRequestProps>({
      method,
      url,
      data,
      params,
      headers,
    });
    console.log('response', response);
    return response.data;
  } catch (error: any) {
    console.log('--- API Error ---');
    console.log('Message:', error.message);
    console.log('Status:', error.response?.status);
    console.log('Response Data:', error.response?.data);
    console.log('Request Config:', error.config.url); // Optional
    console.log('error Config:', error); // Optional
    if (error.config.url === '/auth/login' || error.config.url === '/user/verify-email-otp') {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP.',
        position: 'bottom',
      });
    } else if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      // Optional: clear auth tokens here
      Toast.show({
        type: 'error',
        text1: 'Please login.',
        position: 'bottom',
      });
      logoutAndRedirect();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong, please try again later.',
        position: 'bottom',
      });
    }
    // return error.response?.data
    throw new Error('Failed to fetch Details');
  }
};
