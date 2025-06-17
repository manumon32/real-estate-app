import {getHandshakeTokenApi} from '@api/services';
import * as Keychain from 'react-native-keychain';

export interface HandShakeSlice {
  clientId: any | null;
  token: string | null;
  handShakeError: boolean;
  habdshakeErrorLog: any;
  gethandShakeToken: (data: any) => Promise<void>;
  loadToken: () => Promise<void>;
}

export const createHandShakeSlice = (set: any): HandShakeSlice => ({
  clientId: null,
  token: null,
  handShakeError: false,
  habdshakeErrorLog: null,
  gethandShakeToken: async (data: any) => {
    try {
      const resp = await getHandshakeTokenApi(data);
      console.log(resp);
      if (resp?.secretKey) {
        set({
          clientId: resp.clientId,
          token: resp.secretKey,
          handShakeError: false,
        });
      } else {
        set({handShakeError: true, habdshakeErrorLog: resp});
      }
    } catch (error) {
      console.log('error', error);
      set({handShakeError: true, habdshakeErrorLog: error});
    }
  },
  loadToken: async () => {
    const creds = await Keychain.getGenericPassword();
    if (creds) {
      set({token: creds.password});
    }
  },
});
