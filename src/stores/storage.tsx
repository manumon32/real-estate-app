// storage/mmkv.ts
import { MMKV } from 'react-native-mmkv';

export const mmkv = new MMKV();

export const zustandStorage: any = {
  setItem: async (key: string, value: string) => {
    mmkv.set(key, value);
  },
  getItem: async (key: string) => {
    return mmkv.getString(key) ?? null;
  },
  removeItem: async (key: string) => {
    mmkv.delete(key);
  },
};
