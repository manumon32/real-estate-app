import {getHandshakeTokenApi} from '@api/services';
import * as Keychain from 'react-native-keychain';

export interface HandShakeSlice {
  clientId: any | null;
  token: string | null;
  gethandShakeToken: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const createHandShakeSlice = (set: any): HandShakeSlice => ({
  clientId: null,
  token: null,

  gethandShakeToken: async (data: any) => {
    let resp = await getHandshakeTokenApi(data);
    set({clientId: resp.clientId, token: resp.secretKey});
  },

  logout: async () => {
    await Keychain.resetGenericPassword();
    set({clientId: null, token: null});
  },

  loadToken: async () => {
    const creds = await Keychain.getGenericPassword();
    if (creds) {
      set({token: creds.password});
    }
  },
});
