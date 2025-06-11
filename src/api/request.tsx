import api from './axios';

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
    console.log('Request Config:', error.config); // Optional
    throw new Error('Failed to fetch Details');
  }
};
