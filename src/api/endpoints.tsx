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
    VERIFICATION:{
      GET:'/property-verify',
      GET_MESSAGES:'/property-verify-msg',
      VERIFY_LISTING:'/property-verify-msg',
    },
    BANK:{
      GET:'/bank',
      GET_MESSAGES:'/bank-verify-msg',
      VERIFY_LISTING:'/bank-verify',
    },
  },
  USER: {
    GET: '/user',
    PROFILE: '/user/details',
    UPDATE_PROFILE: '/user/update',
    REGISTER_TOKEN: '/user/fcmTokenRegister',
  },
  CHAT: {
    GET: '/chat-room',
    GET_CHAT: '/chat-message',
  },
  REPORT: {
    GET: '/ad-report',
  },
  NOTIFICATIONS: {
    GET: '/notification',
  },
  PLANS: {
    GET: '/purchase-plan',
  },
  SUBSCRIPTIONS: {
    GET: '/subscription',
  },
  PAYMENT: {
    GET: '/payment',
    CREATE: '/payment/create-order',
    UPDATE: (id: string | number) => `/payment/${id}`,
  },
  FAVOURITES: '/favorites',
  UPLOAD_IMAGES: '/files/upload-images',
  UPLOAD_DOCUMENTS: '/files/upload-documents',
  SUPPORT: '/support',
};
