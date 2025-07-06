import {fetchReportedAd, reportAdsAPI} from '@api/services';
import Toast from 'react-native-toast-message';

export interface ReportAdSlice {
  reportAdLoading: Boolean;
  reportAdListLoading: Boolean;
  reportAdList: [];
  fetchReportedAd: () => void;
  reportAd: (payload: any) => void;
  resetReportAd: () => void;
}

export const createReportAdSlice = (set: any, get: any): ReportAdSlice => ({
  reportAdList: [],
  reportAdLoading: false,
  reportAdListLoading: false,
  fetchReportedAd: async () => {
    set({reportAdListLoading: true});
    try {
      let filter = {
        filter_userId: get().user?._id,
        noPagination: true,
        orderBy: 'createdAt',
        orderByDir: 'desc',
        populate: 'propertyId',
      };
      const res = await fetchReportedAd(filter, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      res?.rows &&
        set(() => ({
          reportAdList: res.rows,
          reportAdListLoading: false,
        }));
    } catch (err) {
      // Rollback if API fails
      set({reportAdListLoading: false});
    }
  },
  reportAd: async (payload: any) => {
    set({reportAdLoading: true});
    try {
      const res = await reportAdsAPI(payload, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      if (res) {
        Toast.show({
          type: 'success',
          text1: 'Repoted Successfully',
          position: 'bottom',
        });
        set(() => ({
          reportAdLoading: false,
        }));
      }
    } catch (err) {
      // Rollback if API fails
      set({reportAdLoading: false});
    }
  },
  resetReportAd: () =>set({reportAdList:[]}),
});
