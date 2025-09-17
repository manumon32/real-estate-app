export const API = {
  AUTH: {
    LOGIN: '/auth/login',
    SEND_OTP: '/auth/send-otp',
    REFRESH: '/auth/refresh',
    UPDATE_CONTACT: '/auth/update-contact',
    HAND_SHAKE: '/handshake/client-secret',
    LOGOUT:'/auth/logout-all',
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
    VERIFICATION: {
      GET: '/property-verify',
      GET_MESSAGES: '/property-verify-msg',
      VERIFY_LISTING: '/property-verify-msg',
    },
    BANK: {
      GET: '/bank',
      GET_MESSAGES: '/bank-verify-msg',
      VERIFY_LISTING: '/bank-verify',
    },
    APPOINTMENT:{
      CREATE:'/appointment',
      UPDATE:'/appointment/status',
    },
  },
  USER: {
    GET: '/user',
    PROFILE: '/user/details',
    UPDATE_PROFILE: '/user/update',
    REGISTER_TOKEN: '/user/fcmTokenRegister',
    SEND_EMAIL_OTP: '/user/send-email-otp',
    VERIFY_EMAIL_OTP: '/user/verify-email-otp',
    SEND_PHONE_OTP: '/user/send-mobile-otp',
    VERIFY_PHONE_OTP: '/user/verify-mobile-otp',
  },
  CHAT: {
    GET: '/chat-room',
    GET_CHAT: '/chat-message',
    DELETE: '/chat-room/delete',
  },
  REPORT: {
    GET: '/ad-report',
  },
  NOTIFICATIONS: {
    GET: '/notification',
    MARK_AS_READ: '/notification/read',
  },
  PLANS: {
    GET: '/purchase-plan',
  },
  SUBSCRIPTIONS: {
    GET: '/subscription',
  },
  SUGGESIONS: {
    GET: '/intelligent-search/build-suggestions',
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
