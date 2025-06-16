import {getHandshakeTokenApi} from '@api/services';
import * as Keychain from 'react-native-keychain';

export interface HandShakeSlice {
  clientId: any | null;
  token: string | null;
  handShakeError: boolean;
  gethandShakeToken: (data: any) => Promise<void>;
  loadToken: () => Promise<void>;
}

export const createHandShakeSlice = (set: any): HandShakeSlice => ({
  clientId: null,
  token: null,
  handShakeError: false,
  gethandShakeToken: async (data: any) => {
    try {
      const resp = await getHandshakeTokenApi(data);
      if (resp?.secretKey) {
        set({
          clientId: resp.clientId,
          token: resp.secretKey,
          handShakeError: false,
        });
      } else {
        set({handShakeError: true});
      }
    } catch (error) {
      set({handShakeError: true});
    }
  },
  loadToken: async () => {
    const creds = await Keychain.getGenericPassword();
    if (creds) {
      set({token: creds.password});
    }
  },
});
