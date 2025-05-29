import api from './axios';

export type RequestMethod = 'get' | 'post' | 'put' | 'delete';

interface ApiRequestProps {
  method: RequestMethod;
  url: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}

export const apiRequest = async({
  method,
  url,
  data,
  params,
  headers,
}: ApiRequestProps): Promise<ApiRequestProps> => {
  const response = await api.request<ApiRequestProps>({
    method,
    url,
    data,
    params,
    headers,
  });

  return response.data;
};
