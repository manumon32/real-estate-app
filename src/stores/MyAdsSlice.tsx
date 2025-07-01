import {fetchMyAdsAPI} from '@api/services';

export interface MyAdsSlice {
  myAdsLoading: Boolean;
  myAds: [];
  fetchMyAds: () => void;
}

export const createMyAdsSlice = (set: any, get: any): MyAdsSlice => ({
  myAds: [],
  myAdsLoading: false,
  fetchMyAds: async () => {
    set({myAdsLoading: true});
    try {
      const res = await fetchMyAdsAPI({
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      res?.rows &&
        set(() => ({
          myAds: res.rows,
          myAdsLoading: false,
        }));
    } catch (err) {
      // Rollback if API fails
      set({myAdsLoading: false});
    }
  },
});
