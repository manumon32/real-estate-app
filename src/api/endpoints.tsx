export const API = {
  AUTH: {
    LOGIN: '/auth/login',
    SEND_OTP: '/auth/send-otp',
    REFRESH: '/auth/refresh',
    UPDATE_CONTACT: '/auth/update-contact',
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
    GET_MYADS: '/property/my-ads',
  },
  USER: {
    GET: '/user',
    PROFILE: '/user/details',
    UPDATE_PROFILE: '/user/update',
  },
  REPORT: {
    GET: '/ad-report',
  },
  FAVOURITES: '/favorites',
  UPLOAD_IMAGES: '/files/upload-images',
};
