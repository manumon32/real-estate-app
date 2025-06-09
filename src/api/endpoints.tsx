export const API = {
  AUTH: {
    LOGIN: '/auth/login',
    SEND_OTP: '/auth/send-otp',
    REFRESH: '/auth/refresh',
    HAND_SHAKE: '/handshake/client-secret',
  },
  LISTINGS: {
    GET_ALL: '/property',
    GET_NEAREST_ALL: '/property/near-list',
    GET_BY_ID: (id: string | number) => `/property/${id}`,
    CREATE: '/property',
    UPDATE: (id: string | number) => `/property/${id}`,
    DELETE: (id: string | number) => `/property/${id}`,
    GET_CONFIGS: '/all-filters',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/update',
  },
};
