import {login, updateUser, verifyOTP} from '@api/services';

export interface AuthSlice {
  user: any | null;
  bearerToken: string | null;
  otp: string | null;
  visible: boolean;
  loginError: boolean;
  updateError: boolean;
  updateLoading: boolean;
  updateSuccess: boolean;
  login: (falg: any) => Promise<void>;
  setVisible: () => Promise<void>;
  logout: () => Promise<void>;
  setUpdateSuccess: () => Promise<void>;
  clearOTP: () => Promise<void>;
  verifyOTP: (falg: any) => Promise<void>;
  updateuser: (falg: any) => Promise<void>;
}

export const createAuthSlice = (set: any, get: any): AuthSlice => ({
  user: null,
  bearerToken: null,
  otp: null,
  loginError: false,
  visible: false,
  updateError: false,
  updateLoading: false,
  updateSuccess: false,
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
          user: resp.userInfo,
          visible: false,
          otp: null,
        });
      } else {
        set({loginError: true, visible: false, updateSuccess: false});
      }
    } catch (error) {
      set({loginError: true, updateSuccess: false});
    }
  },
  updateuser: async payload => {
    set({updateError: false, updateLoading: true});
    try {
      const resp = await updateUser(payload, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      if (resp) {
        set({
          user: resp,
          updateError: true,
          updateLoading: false,
          updateSuccess: true,
        });
      } else {
        set({updateError: true, updateLoading: false, updateSuccess: false});
      }
    } catch (error) {
      set({updateError: false, updateLoading: false, updateSuccess: false});
    }
  },
  setUpdateSuccess: async () => {
    set({updateSuccess: false});
  },
  setVisible: async () => {
    set({visible: !get().visible});
  },
  clearOTP: async () => {
    set({otp: null});
  },
  logout: async () => {
    console.log('bearerToken upated');
    set({user: null, bearerToken: null});
  },
});
