const BASE_URL = 'http://13.61.181.173:8081';

export const API = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    REFRESH: `${BASE_URL}/auth/refresh`,
    HAND_SHAKE: `${BASE_URL}/handshake/client-secret`,
  },
  LISTINGS: {
    GET_ALL: `${BASE_URL}/property`,
    GET_BY_ID: (id: string | number) => `${BASE_URL}/property/${id}`,
    CREATE: `${BASE_URL}/property`,
    UPDATE: (id: string | number) => `${BASE_URL}/property/${id}`,
    DELETE: (id: string | number) => `${BASE_URL}/property/${id}`,
  },
  USER: {
    PROFILE: `${BASE_URL}/user/profile`,
    UPDATE_PROFILE: `${BASE_URL}/user/update`,
  },
};
