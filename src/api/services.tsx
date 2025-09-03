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
        'Content-Type': 'application/json',
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

export const getMultiParHeaders = async (data: any): Promise<any> => {
  try {
    return {
      'Content-Type': 'multipart/form-data',
      'X-TOKEN': data.token,
      'X-DEVICE-ID': data.clientId,
      Authorization: 'Bearer ' + data.bearerToken,
    };
  } catch (error) {
    return {
      'Content-Type': 'multipart/form-data',
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
    return response?.data;
  } catch (error: any) {
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
    console.log('response in service', response);
    if (response.data) {
      return response.data;
    } else {
      return response;
    }
  } catch (error: any) {
    console.log('error response in service', error);
    throw new Error('Failed to fetch handshake token');
  }
};


// 🔹 Send Email OTP
export const sendEmailOTP = async (data: object, configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.USER.SEND_EMAIL_OTP,
      data, //: JSON.stringify(data),
      headers,
    });
    return response;
  } catch (error: any) {
    throw new Error('Failed to fetch handshake token');
  }
};

// 🔹 verify Email OTP
export const verifyEmailOTP = async (data: object, configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.USER.VERIFY_EMAIL_OTP,
      data, //: JSON.stringify(data),
      headers,
    });
    console.log('response in service', response);
    if (response.data) {
      return response.data;
    } else {
      return response;
    }
  } catch (error: any) {
    console.log('error response in service', error);
    throw new Error('Failed to fetch handshake token');
  }
};


// 🔹 Send Phone OTP
export const sendPhoneOTP = async (data: object, configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.USER.SEND_PHONE_OTP,
      data, //: JSON.stringify(data),
      headers,
    });
    return response;
  } catch (error: any) {
    throw new Error('Failed to fetch handshake token');
  }
};

// 🔹 verify Phone OTP
export const verifyPhoneOTP = async (data: object, configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.USER.VERIFY_PHONE_OTP,
      data, //: JSON.stringify(data),
      headers,
    });
    console.log('response in service', response);
    if (response.data) {
      return response.data;
    } else {
      return response;
    }
  } catch (error: any) {
    console.log('error response in service', error);
    throw new Error('Failed to fetch handshake token');
  }
};

// 🔹 Hand Shake token

export const getHandshakeTokenApi = async (data: object): Promise<any> => {
  try {
    const headers = await getHeaders(data, true);
    const response = await apiRequest({
      method: 'post',
      url: API.AUTH.HAND_SHAKE,
      data,
      headers,
    });
    return response.data ? response.data : response;
  } catch (error: any) {
    return error;
    // throw new Error('Failed to fetch handshake token');
  }
};

// Upload Images

export const updateUser = async (
  data: object,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'put',
      url: API.USER.GET,
      data,
      headers,
    });
    return response?.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
  }
};

export const submitRequestAPI = async (
  data: object,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.SUPPORT,
      data,
      headers,
    });
    return response?.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
  }
};



export const logoutFromallDevicesAPI = async (
  data: object,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.AUTH.LOGOUT,
      data,
      headers,
    });
    return response?.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
  }
};

//updateContact

export const updateContact = async (
  data: object,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.AUTH.UPDATE_CONTACT,
      data,
      headers,
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to Do so');
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
    return response?.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to fetch handshake token');
  }
};

//chat list
export const fetchChatListingsAPI = async (
  params: object,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.CHAT.GET,
      params,
      headers,
    };
    const response = await apiRequest(apiConfig);
    console.log(response.data.data);
    return response?.data;
  } catch (error: any) {
    throw new Error('Failed to fetch handshake token');
  }
};

//chat list
export const deleteChatListAPI = async (
  data: object,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'delete',
      url: API.CHAT.DELETE,
      data,
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response?.data;
  } catch (error: any) {
    throw new Error('Failed to Delete Chat');
  }
};

//chat Details
export const fetchChatDetailsAPI = async (
  params: any,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.CHAT.GET_CHAT,
      params: params,
      headers,
    };
    const response = await apiRequest(apiConfig);
    console.log(response.data.data);
    return response?.data;
  } catch (error: any) {
    throw new Error('Failed to fetch handshake token');
  }
};

//delete notifications list
export const deleteNotificationsAPI = async (
  data: object,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'delete',
      url: API.NOTIFICATIONS.GET,
      data,
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response?.data;
  } catch (error: any) {
    throw new Error('Failed to Delete Chat');
  }
};

//mark all read notifications list
export const markAllReadNotificationsAPI = async (
  data: object,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'post',
      url: API.NOTIFICATIONS.MARK_AS_READ,
      data,
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response?.data;
  } catch (error: any) {
    throw new Error('Failed to Delete Chat');
  }
};

// verification list
export const fetchverificationDetailsAPI = async (
  params: any,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.LISTINGS.VERIFICATION.GET_MESSAGES,
      params: params,
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response?.data;
  } catch (error: any) {
    throw new Error('Failed to fetch handshake token');
  }
};

//Verify Listing

// Bank list
export const fetchBanksAPI = async (configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.LISTINGS.BANK.GET,
      params: {
        filter_isEnabled: true,
        filter_isDeleted: false,
      },
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response?.data;
  } catch (error: any) {
    throw new Error('Failed to fetch handshake token');
  }
};

export const startBankVerificationAPI = async (
  data: object,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.LISTINGS.BANK.VERIFY_LISTING,
      data,
      headers,
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to Do so');
  }
};

// verification list
export const fetchVerifiedBankAPI = async (
  params: any,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.LISTINGS.BANK.VERIFY_LISTING,
      params: params,
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response?.data;
  } catch (error: any) {
    throw new Error('Failed to fetch handshake token');
  }
};

// verification list
export const fetchBankVerificationDetailsAPI = async (
  params: any,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.LISTINGS.BANK.GET_MESSAGES,
      params: params,
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response?.data;
  } catch (error: any) {
    throw new Error('Failed to fetch handshake token');
  }
};

//Verify Listing

export const startVerificationAPI = async (
  data: object,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.LISTINGS.VERIFICATION.GET,
      data,
      headers,
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to Do so');
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

export const fetchFavoritessAPI = async (
  params: {},
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.FAVOURITES,
      params,
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch Details');
  }
};

export const fetchMyAdsAPI = async (configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.LISTINGS.GET_MYADS,
      params: {
        noPagination: true,
        orderBy: 'createdAt',
        orderByDir: 'desc',
      },
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch Details');
  }
};

export const fetchAppointMentsAPI = async (configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.LISTINGS.APPOINTMENT.CREATE,
      params: {
        noPagination: true,
        orderBy: 'createdAt',
        orderByDir: 'desc',
      },
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch Details');
  }
};



//Transactions

export const fetchTransactionsAPI = async (
  filter: any,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.SUBSCRIPTIONS.GET,
      params: filter,
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch Details');
  }
};

export const fetchReportedAd = async (
  filter: any,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.REPORT.GET,
      params: filter,
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch Details');
  }
};

//
export const fetchNotificationsAPI = async (configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.NOTIFICATIONS.GET,
      params: {
        noPagination: true,
        orderBy: 'createdAt',
        orderByDir: 'desc',
      },
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch Details');
  }
};

export const fetchPlans = async (configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.PLANS.GET,
      params: {
        noPagination: true,
        orderBy: 'createdAt',
        orderByDir: 'desc',
      },
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch Details');
  }
};

//create order

export const createOrder = async (data: any, configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'post',
      url: API.PAYMENT.CREATE,
      data,
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch Details');
  }
};

//Update order

export const updateOrder = async (
  data: any,
  configArg: any,
  id: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'put',
      url: API.PAYMENT.UPDATE(id),
      data,
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch Details');
  }
};

export const reportAdsAPI = async (
  data: object,
  configArg: any,
): Promise<Listing> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.REPORT.GET,
      data,
      headers,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
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

export const fetchUserDetailsAPI = async (configArg: any): Promise<Details> => {
  try {
    const headers = await getHeaders(configArg);
    const apiConfig: any = {
      method: 'get',
      url: API.USER.PROFILE,
      params: {},
      headers,
    };
    const response = await apiRequest(apiConfig);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch Details');
  }
};

// Upload Images

export const uploadImages = async (
  data: object,
  configArg: any,
): Promise<Listing> => {
  try {
    const headers = await getMultiParHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.UPLOAD_IMAGES,
      data,
      headers,
    });
    return response?.data?.rows;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
  }
};

// Upload Documents

export const uploadDocuments = async (
  data: object,
  configArg: any,
): Promise<Listing> => {
  try {
    const headers = await getMultiParHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.UPLOAD_DOCUMENTS,
      data,
      headers,
    });
    return response?.data?.rows;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
  }
};
// postAd

export const postAdAPI = async (
  data: any,
  configArg: any,
  method: RequestMethod,
): Promise<Listing> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method,
      url:
        method === 'post' ? API.LISTINGS.CREATE : API.LISTINGS.UPDATE(data.id),
      data,
      headers,
    });
    return response?.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
  }
};

export const saveAppointMent = async (
  data: any,
  configArg: any,
  method: RequestMethod,
): Promise<Listing> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method,
      url:
        method === 'post'
          ? API.LISTINGS.APPOINTMENT.CREATE
          : API.LISTINGS.APPOINTMENT.UPDATE,
      data,
      headers,
    });
    return response?.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
  }
};

export const registerFCMToken = async (
  data: any,
  configArg: any,
): Promise<Listing> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.USER.REGISTER_TOKEN,
      data,
      headers,
    });
    return response?.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
  }
};

//create chat room
export const createRoomAPI = async (
  data: any,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.CHAT.GET,
      data,
      headers,
    });
    return response?.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
  }
};

//send chat
export const sendChat = async (data: any, configArg: any): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.CHAT.GET_CHAT,
      data,
      headers,
    });
    return response?.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
  }
};

//send chat
export const sendVerificationDetails = async (
  data: any,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.LISTINGS.VERIFICATION.VERIFY_LISTING,
      data,
      headers,
    });
    return response?.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
  }
};

//send Bank Chat
export const sendBankDetails = async (
  data: any,
  configArg: any,
): Promise<any> => {
  try {
    const headers = await getHeaders(configArg);
    const response = await apiRequest({
      method: 'post',
      url: API.LISTINGS.BANK.GET_MESSAGES,
      data,
      headers,
    });
    return response?.data;
  } catch (error: any) {
    console.log(error);
    throw new Error('Failed to Do so');
  }
};
