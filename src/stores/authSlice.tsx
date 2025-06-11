import {login, verifyOTP} from '@api/services';

export interface AuthSlice {
  user: any | null;
  bearerToken: string | null;
  otp: string | null;
  visible: boolean;
  loginError: boolean;
  login: (falg: any) => Promise<void>;
  setVisible: () => Promise<void>;
  logout: () => Promise<void>;
  clearOTP: () => Promise<void>;
  verifyOTP: (falg: any) => Promise<void>;
}

export const createAuthSlice = (set: any, get: any): AuthSlice => ({
  user: null,
  bearerToken: null,
  otp: null,
  loginError: false,
  visible: false,
  login: async payload => {
    try {
      const resp = await login(payload, {
        token: get().token,
        clientId: get().clientId,
      });
      if (resp?.otp) {
        set({
          otp: resp.otp,
        });
      } else {
        set({loginError: true});
      }
    } catch (error) {
      set({loginError: true});
    }
  },
  verifyOTP: async payload => {
    try {
      const resp = await verifyOTP(payload, {
        token: get().token,
        clientId: get().clientId,
      });
      if (resp?.token) {
        set({
          bearerToken: resp.token,
          visible: false,
        });
      } else {
        set({loginError: true, visible: false});
      }
    } catch (error) {
      set({loginError: true});
    }
  },
  setVisible: async () => {
    set({visible: !get().visible});
  },
  clearOTP: async () => {
    set({otp: null});
  },
  logout: async () => {
    set({user: null, bearerToken: null});
  },
});
