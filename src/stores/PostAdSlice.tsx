import {postAdAPI} from '@api/services';

export interface PostAdSlice {
  postAd: any;
  images: [];
  floorPlans: [];
  imageUploadLoading: boolean;
  imageSelectLoading: boolean;
  setPostAd: (updates: Partial<any>) => void;
  submitPostAd: (updates: Partial<any>) => void;
  resetPostAd: () => void;
  setImages: (images: any) => void;
  setFloorPlans: (images: any) => void;
  setImageUploadLoading: (falg: any) => void;
  setImageSelectLoading: (falg: any) => void;
  postAdloading: boolean;
  postAdError: boolean;
}

const defaultPostAd: any = {};

export const createPostAdSlice = (set: any, get: any): PostAdSlice => ({
  postAd: defaultPostAd,
  images: [],
  floorPlans: [],
  postAdloading: false,
  imageSelectLoading: false,
  postAdError: false,
  imageUploadLoading: false,
  setImageUploadLoading: (flag: any) =>
    set(() => ({
      imageUploadLoading: flag,
    })),
  setImageSelectLoading: (flag: any) =>
    set(() => ({
      imageSelectLoading: flag,
    })),
  setPostAd: updates =>
    set((state: any) => ({
      postAd: {...state.postAd, ...updates},
    })),
  setImages: images =>
    set(() => ({
      images: images,
    })),

  setFloorPlans: plans =>
    set(() => ({
      floorPlans: plans,
    })),
  submitPostAd: async payload => {
    set(() => ({
      postAdloading: true,
      postAdError: false,
    }));
    try {
      const resp = await postAdAPI(
        payload,
        {
          token: get().token,
          clientId: get().clientId,
        },
        'post',
      );
      if (resp.rows) {
        set({
          imageUrls: resp.rows,
          postAdloading: false,
        });
      } else {
        set({postAdError: true, postAdloading: false});
      }
    } catch (error) {
      set({postAdError: true});
    }
  },

  resetPostAd: () => set({postAd: {}}),
});
