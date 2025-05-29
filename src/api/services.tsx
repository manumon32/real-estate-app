import api from './axios';
import {API} from './endpoints';
import {apiRequest} from './request';

// Types
interface Listing {
  id: number;
  title: string;
  price: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// 🔹 Listings
export const fetchListings = async (): Promise<Listing[]> => {
  const response = await apiRequest({
    method: 'get',
    url: API.LISTINGS.GET_ALL,
  });
  return response.data;
};

export const fetchListingById = async (
  id: number | string,
): Promise<Listing> => {
  const res = await api.get<Listing>(API.LISTINGS.GET_BY_ID(id));
  return res.data;
};

// 🔹 User
export const getUserProfile = async (): Promise<User> => {
  const res = await api.get<User>(API.USER.PROFILE);
  return res.data;
};

// 🔹 Auth
export const login = async (
  email: string,
  password: string,
): Promise<string> => {
  const res = await api.post(API.AUTH.LOGIN, {email, password});
  return res.data.token;
};

// 🔹 Hand Shake token

interface HandshakeResponse {
  data: {secretKey: string; clientId: string};
}

export const getHandshakeTokenApi = async (data: object): Promise<{secretKey: string; clientId: string}> => {
  try {
    const response = await api.post<HandshakeResponse>(
      API.AUTH.HAND_SHAKE,
      data,
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error('Failed to fetch handshake token');
  }
};
