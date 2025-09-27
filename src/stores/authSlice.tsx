import {
  fetchUserDetailsAPI,
  login,
  logoutAPI,
  logoutFromallDevicesAPI,
  sendEmailOTP,
  sendPhoneOTP,
  submitRequestAPI,
  updateContact,
  updateUser,
  verifyEmailOTP,
  verifyOTP,
  verifyPhoneOTP,
} from '@api/services';
import Toast from 'react-native-toast-message';
import {logoutAndRedirect} from '../utils/logoutAndRedirect';

export interface AuthSlice {
  user: any | null;
  bearerToken: string | null;
  otp: string | null;
  otpLoading: boolean;
  logoutLoading: boolean;
  visible: boolean;
  loginError: boolean;
  updateError: boolean;
  updateLoading: boolean;
  updateSuccess: boolean;
  userProfileloading: false;
  loginErrorMessage: any;
  login: (falg: any) => Promise<void>;
  emailOTPLoading: boolean;
  phoneOTPLoading: boolean;
  navigationMode: any;
  setNavigationMode: (falg: any) => Promise<void>;
  sentEmailOTP: (falg: any) => Promise<void>;
  verifyEmailOTP: (falg: any) => Promise<void>;
  sentPhoneOTP: (falg: any) => Promise<void>;
  verifyPhoneOTP: (falg: any) => Promise<void>;
  setVisible: () => Promise<void>;
  logout: () => Promise<void>;
  logoutUser: () => Promise<void>;
  logoutFromAllDevice: () => Promise<void>;
  setUpdateSuccess: () => Promise<void>;
  clearOTP: () => Promise<void>;
  verifyOTP: (falg: any) => Promise<void>;
  updateuser: (falg: any) => Promise<void>;
  fetchUserDetails: (flag?: any) => Promise<void>;
  updateCOntact: (falg: any) => Promise<void>;
  submitRequest: (falg: any) => Promise<void>;
  clearErrorMessage: () => Promise<void>;
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
  logoutLoading: false,
  emailOTPLoading: false,
  phoneOTPLoading: false,
  navigationMode: null,
  setNavigationMode: flag => {
    return set({
      navigationMode: flag,
    });
  },
  sentEmailOTP: async payload => {
    try {
      set({
        emailOTPLoading: true,
        loginErrorMessage: '',
        loginError: false,
      });
      const resp = await sendEmailOTP(payload, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      if (resp) {
        set({
          emailOTPLoading: false,
          otp: true,
        });
        Toast.show({
          type: 'success',
          text1: 'OTP send Successfully',
          text2: 'Welcome to the app!',
          position: 'bottom',
          visibilityTime: 1000,
        });
      } else {
        set({emailOTPLoading: false});
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          position: 'bottom',
          visibilityTime: 500,
        });
      }
    } catch (error) {
      set({emailOTPLoading: false});
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something went wrong',
      //   position: 'bottom',
      //   visibilityTime: 500,
      // });
    }
  },
  verifyEmailOTP: async payload => {
    set({
      emailOTPLoading: true,
      loginErrorMessage: '',
      loginError: false,
    });
    try {
      const resp = await verifyEmailOTP(payload, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      if (resp) {
        set({
          visible: false,
          otp: null,
          otpLoading: false,
          user: {...get().user, email: payload.email, isEmailVerified: true},
          emailOTPLoading: false,
          loginErrorMessage: '',
        });
        Toast.show({
          type: 'success',
          text1: 'Email Verified Successfully',
          text2: 'Welcome to the app!',
          position: 'bottom',
          visibilityTime: 1000,
        });
      } else {
        set({
          loginError: true,
          otpLoading: false,
          visible: false,
          updateSuccess: false,
          loginErrorMessage: 'Invalid OTP',
          emailOTPLoading: false,
        });
      }
    } catch (error) {
      set({
        loginError: true,
        emailOTPLoading: false,
        updateSuccess: false,
        otpLoading: false,
        loginErrorMessage: 'Invalid OTP',
      });
    }
  },

  sentPhoneOTP: async payload => {
    try {
      set({
        phoneOTPLoading: true,
        loginErrorMessage: '',
        loginError: false,
      });
      const resp = await sendPhoneOTP(payload, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      if (resp) {
        set({
          phoneOTPLoading: false,
          otp: true,
        });
        Toast.show({
          type: 'success',
          text1: 'OTP send Successfully',
          text2: 'Welcome to the app!',
          position: 'bottom',
          visibilityTime: 1000,
        });
      } else {
        set({phoneOTPLoading: false});
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          position: 'bottom',
          visibilityTime: 500,
        });
      }
    } catch (error) {
      set({phoneOTPLoading: false});
      // Toast.show({
      //   type: 'error',
      //   text1: 'Something went wrong',
      //   position: 'bottom',
      //   visibilityTime: 500,
      // });
    }
  },
  verifyPhoneOTP: async payload => {
    set({
      phoneOTPLoading: true,
      loginErrorMessage: null,
      loginError: false,
    });
    try {
      const resp = await verifyPhoneOTP(payload, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      if (resp) {
        set({
          visible: false,
          otp: null,
          otpLoading: false,
          user: {...get().user, phone: payload.phone, isPhoneVerified: true},
          phoneOTPLoading: false,
        });
        Toast.show({
          type: 'success',
          text1: 'Email Verified Successfully',
          text2: 'Welcome to the app!',
          position: 'bottom',
          visibilityTime: 1000,
        });
      } else {
        set({
          loginError: true,
          otpLoading: false,
          visible: false,
          updateSuccess: false,
          loginErrorMessage: 'Invalid OTP',
          phoneOTPLoading: false,
        });
      }
    } catch (error) {
      set({
        loginError: true,
        phoneOTPLoading: false,
        updateSuccess: false,
        otpLoading: false,
        loginErrorMessage: 'Invalid OTP',
      });
    }
  },
  login: async payload => {
    try {
      set({
        otpLoading: true,
        loginErrorMessage: null,
        loginError: false,
      });
      const resp = await login(payload, {
        token: get().token,
        clientId: get().clientId,
      });
      if (resp) {
        set({
          otp: true,
          otpLoading: false,
        });
      } else {
        set({loginError: true, otp: false, otpLoading: false});
      }
    } catch (error: any) {
      console.log('errorerrorerrorerrorerrorerror', error);
      set({
        loginError: true,
        otp: false,
        otpLoading: false,
        loginErrorMessage: error.response?.data?.msg
          ? error.response?.data?.msg
          : 'Something went wrong, please try again later.',
      });
    }
  },
  verifyOTP: async payload => {
    set({
      loginError: false,
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
          otpLoading: false,
        });
        setTimeout(() => {
          Toast.show({
            type: 'success',
            text1: 'Login Successful',
            position: 'bottom',
            visibilityTime: 1000,
          });
        }, 1000);
      } else {
        set({
          loginError: true,
          otpLoading: false,
          visible: false,
          updateSuccess: false,
          loginErrorMessage: payload.otp
            ? 'Invalid OTP'
            : 'Something went wrong',
        });

        payload.otp &&
          Toast.show({
            type: 'error',
            text1: 'Invalid OTP.',
            position: 'bottom',
          });
      }
    } catch (error: any) {
      console.log('errorerrorerrorerror:', error);
      set({
        loginError: true,
        updateSuccess: false,
        otpLoading: false,
        loginErrorMessage: error.response?.data?.msg
          ? error.response?.data?.msg
          : 'Something went wrong, please try again later.',
      });
    }
  },
  fetchUserDetails: async (flag = false) => {
    flag && set({userProfileloading: true, loginErrorMessage: null});
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
  clearErrorMessage: async () => {
    set({loginErrorMessage: null, loginError: false});
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
  logoutUser: async () => {
    try {
      set({logoutLoading: true});
      const resp = await logoutAPI(
        {},
        {
          token: get().token,
          clientId: get().clientId,
          bearerToken: get().bearerToken,
        },
      );
      set({logoutLoading: false});
      if (resp) {
        logoutAndRedirect();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          position: 'bottom',
          visibilityTime: 1000,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        position: 'bottom',
        visibilityTime: 1000,
      });
      set({logoutLoading: false});
    }
  },
  logoutFromAllDevice: async () => {
    try {
      set({logoutLoading: true});
      const resp = await logoutFromallDevicesAPI(
        {},
        {
          token: get().token,
          clientId: get().clientId,
          bearerToken: get().bearerToken,
        },
      );
      set({logoutLoading: false});
      if (resp) {
        logoutAndRedirect();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          position: 'bottom',
          visibilityTime: 1000,
        });
      }
    } catch (error) {
      set({logoutLoading: false});
      // set({updateError: false, updateLoading: false, updateSuccess: false});
    }
  },
});
