import * as Keychain from 'react-native-keychain';

export interface AuthSlice {
  user: any | null;
  token: string | null;
  login: (user: any, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const createAuthSlice = (set: any,): AuthSlice => ({
  user: null,
  token: null,

  login: async (user, token) => {
    await Keychain.setGenericPassword('auth', token);
    set({ user, token });
  },

  logout: async () => {
    await Keychain.resetGenericPassword();
    set({ user: null, token: null });
  },

  loadToken: async () => {
    const creds = await Keychain.getGenericPassword();
    if (creds) {
      set({ token: creds.password });
    }
  },
});
