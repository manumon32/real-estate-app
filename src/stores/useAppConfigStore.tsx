/* eslint-disable @typescript-eslint/no-unused-vars */
// useAppConfigStore.ts
import {getAppConfigData} from '@api/services';

interface ConfigItem {
  _id: string;
  name: string;
  isEnabled: boolean;
  isDeleted: boolean;
  __v: number;
  [key: string]: any; // for iconName or other optional fields
}

export interface ConfigState {
  amenities: ConfigItem[];
  areaUnits: ConfigItem[];
  availabilityStatuses: ConfigItem[];
  facingDirections: ConfigItem[];
  listedBy: ConfigItem[];
  features: ConfigItem[];
  furnishingStatuses: ConfigItem[];
  listingTypes: ConfigItem[];
  ownershipTypes: ConfigItem[];
  priceUnits: ConfigItem[];
  propertyTypes: ConfigItem[];
}

export interface AppConfigState {
  appConfigs: ConfigState | null;
  getConfigData: () => void;
  getConfig: () => Omit<AppConfigState, 'setConfigData' | 'getConfig'>;
}

export const createAppConfigStore = (set: any, get: any): AppConfigState => ({
  appConfigs: null,

  getConfigData: async () => {
    try {
      const resp = await getAppConfigData({
        token: get().token,
        clientId: get().clientId,
      });
      console.log({
        token: get().token,
        clientId: get().clientId,
      });
      if (resp) {
        set({appConfigs: resp});
      }
    } catch (error) {}
  },
  getConfig: () => {
    const {setConfigData, getConfig, ...rest} = get();
    return rest;
  },
});
