import {
  fetchUserDetailsAPI,
  login,
  submitRequestAPI,
  updateContact,
  updateUser,
  verifyOTP,
} from '@api/services';

export interface AuthSlice {
  user: any | null;
  bearerToken: string | null;
  otp: string | null;
  otpLoading: boolean;
  visible: boolean;
  loginError: boolean;
  updateError: boolean;
  updateLoading: boolean;
  updateSuccess: boolean;
  userProfileloading: false;
  loginErrorMessage: any;
  login: (falg: any) => Promise<void>;
  setVisible: () => Promise<void>;
  logout: () => Promise<void>;
  setUpdateSuccess: () => Promise<void>;
  clearOTP: () => Promise<void>;
  verifyOTP: (falg: any) => Promise<void>;
  updateuser: (falg: any) => Promise<void>;
  fetchUserDetails: (flag?: any) => Promise<void>;
  updateCOntact: (falg: any) => Promise<void>;
  submitRequest: (falg: any) => Promise<void>;
}

export const createAuthSlice = (set: any, get: any): AuthSlice => ({
  user: null,
  bearerToken: null,
  otp: null,
  loginError: false,
  loginErrorMessage: null,
  visible: false,
  otpLoading: false,
  updateError: false,
  updateLoading: false,
  updateSuccess: false,
  userProfileloading: false,
  login: async payload => {
    try {
      set({
        otpLoading: true,
      });
      const resp = await login(payload, {
        token: get().token,
        clientId: get().clientId,
      });
      if (resp?.otp) {
        set({
          otp: resp.otp,
          otpLoading: false,
        });
      } else {
        set({loginError: true, otpLoading: false});
      }
    } catch (error) {
      set({loginError: true});
    }
  },
  verifyOTP: async payload => {
    set({
      otpLoading: true,
      loginErrorMessage: null,
    });
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
        set({
          loginError: true,
          visible: false,
          updateSuccess: false,
          loginErrorMessage: resp.msg ? resp.msg : 'Something went wrong',
        });
      }
    } catch (error) {
      set({loginError: true, updateSuccess: false});
    }
  },
  fetchUserDetails: async (flag = false) => {
    flag && set({userProfileloading: true});
    try {
      const res = await fetchUserDetailsAPI({
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      res &&
        set(() => ({
          user: res,
          userProfileloading: false,
        }));
    } catch (err: any) {
      set({userProfileloading: false});
    }
  },
  updateCOntact: async payload => {
    set({updateError: false});
    try {
      const resp = await updateContact(payload, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      console.log(resp);
      if (resp) {
        let updateValue =
          Object.keys(payload)[0] === 'email'
            ? 'isEmailVerified'
            : 'isPhoneVerified';
        set({
          user: {...get().user, [updateValue]: true},
          otp: null,
        });
      } else {
        set({updateError: true, updateLoading: false, updateSuccess: false});
      }
    } catch (error) {
      set({updateError: false, updateLoading: false, updateSuccess: false});
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
          updateError: false,
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
  submitRequest: async payload => {
    set({updateError: false, updateLoading: true});
    try {
      const resp = await submitRequestAPI(payload, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      if (resp) {
        set({
          updateError: false,
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
    set({
      user: null,
      bearerToken: null,
      otp: null,
      loginError: false,
      loginErrorMessage: null,
      visible: false,
      otpLoading: false,
      updateError: false,
      updateLoading: false,
      updateSuccess: false,
      userProfileloading: false,
    });
  },
});
