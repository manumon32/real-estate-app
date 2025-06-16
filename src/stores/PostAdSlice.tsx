import {postAdAPI} from '@api/services';

export interface PostAdSlice {
  postAd: any;
  images: [];
  setPostAd: (updates: Partial<any>) => void;
  submitPostAd: (updates: Partial<any>) => void;
  resetPostAd: () => void;
  setImages: (images: any) => void;
  postAdloading:boolean;
  postAdError: boolean;
}

const defaultPostAd: any = {};

export const createPostAdSlice = (set: any, get: any): PostAdSlice => ({
  postAd: defaultPostAd,
  images: [],
  postAdloading: false,
  postAdError: false,
  setPostAd: updates =>
    set((state: any) => ({
      postAd: {...state.postAd, ...updates},
    })),
  setImages: images =>
    set(() => ({
      images: images,
    })),
  submitPostAd: async payload => {
    set(() => ({
      postAdloading: true,
      postAdError: false,
    }));
    try {
      const resp = await postAdAPI(payload, {
        token: get().token,
        clientId: get().clientId,
      });
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
