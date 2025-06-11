import api from './axios';
import {appSecret} from './constans';
import {API} from './endpoints';
import {createHandShakeHmacSignature} from './handshake';
import {apiRequest, RequestMethod} from './request';

// Types
interface Row {
  _id: string;
  price: number;
  location: object;
  imageUrls: [];
  isFeatured: false;
  title: string;
  address: string;
  numberOfBedrooms: number;
}

interface Listing {
  pageNum: number;
  pageSize: number;
  pages: number;
  total: number;
  rows: [Row];
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Details {
  data: Row;
}

export const getHeaders = async (
  data: any,
  hmac: boolean = false,
): Promise<any> => {
  try {
    if (hmac) {
      const signature = createHandShakeHmacSignature(appSecret, data);
      return {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(signature && {'X-APP-SIGNATURE': signature}),
      };
    } else {
      return {
        'X-TOKEN': data.token,
        'X-DEVICE-ID': data.clientId,
        Authorization: 'Bearer ' + data.bearerToken,
      };
    }
  } catch (error) {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }
};

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
export const login = async (data: object, configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.AUTH.SEND_OTP,
      data, //: JSON.stringify(data),
      headers,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to fetch handshake token');
  }
};

// 🔹 verifyOTP
export const verifyOTP = async (data: object, configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.AUTH.LOGIN,
      data, //: JSON.stringify(data),
      headers,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to fetch handshake token');
  }
};

// 🔹 Hand Shake token

export const getHandshakeTokenApi = async (
  data: object,
): Promise<{secretKey: string; clientId: string}> => {
  try {
    const headers = await getHeaders(data, true);
    const response = await apiRequest({
      method: 'post',
      url: API.AUTH.HAND_SHAKE,
      data,
      headers,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to fetch handshake token');
  }
};

// 🔹 GET App Config Data's

export const getAppConfigData = async (configArg: object): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.LISTINGS.GET_CONFIGS,
      params: {},
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to fetch handshake token');
  }
};

// 🔹 Fetch Ads

export const fetchListingsFromAPI = async (
  params: object,
  configArg: any,
): Promise<Listing> => {
  try {
    console.log('params', params);
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.LISTINGS.GET_ALL,
      params,
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to fetch handshake token');
  }
};

// 🔹 Fav Ads

export const UpdateFavouritesAPI = async (
  data: object,
  configArg: any,
  method: RequestMethod,
): Promise<Listing> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method,
      url: API.FAVOURITES,
      data,
      headers,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
  }
};

export const fetchFavoritessAPI = async (configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.FAVOURITES,
      params: {
        pageSize: 500,
      },
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch Details');
  }
};

export const fetchDetailsAPI = async (
  params: string,
  configArg: any,
): Promise<Details> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.LISTINGS.GET_BY_ID(params),
      params: {},
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch Details');
  }
};
