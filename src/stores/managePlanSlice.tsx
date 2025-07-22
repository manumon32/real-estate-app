import {fetchPlans, reportAdsAPI} from '@api/services';
import Toast from 'react-native-toast-message';

export interface ManagePlanSlice {
  managePlanLoading: Boolean;
  managePlansList: [];
  fetchPlans: () => void;
  reportPan: (payload: any) => void;
}

export const createManagePlanSlice = (set: any, get: any): ManagePlanSlice => ({
  managePlansList: [],
  managePlanLoading: false,
  fetchPlans: async () => {
    set({managePlanLoading: true});
    try {
      const res = await fetchPlans({
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      res?.rows &&
        set(() => ({
          managePlansList: res.rows,
          managePlanLoading: false,
        }));
    } catch (err) {
      // Rollback if API fails
      set({managePlanLoading: false});
    }
  },
  reportPan: async (payload: any) => {
    set({managePlanLoading: true});
    try {
      const res = await reportAdsAPI(payload, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      if (res) {
        Toast.show({
          type: 'success',
          text1:'Repoted Successfully',
          position: 'bottom',
        });
        set(() => ({
          managePlanLoading: false,
        }));
      }
    } catch (err) {
      // Rollback if API fails
      set({managePlanLoading: false});
    }
  },
});
