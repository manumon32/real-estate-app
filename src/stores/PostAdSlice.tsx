import {postAdAPI} from '@api/services';

export interface PostAdSlice {
  postAd: any;
  images: any[];
  floorPlans: any[];
  imageUploadLoading: boolean;
  imageSelectLoading: boolean;
  loadingStates: {[key: string]: boolean}; // Global loading states for individual items
  setPostAd: (updates: Partial<any>) => void;
  submitPostAd: (updates: Partial<any>) => void;
  resetPostAd: () => void;
  setImages: (images: any) => void;
  setFloorPlans: (images: any) => void;
  updateImageStatus: (id: string, status: string, uploadedUrl?: string) => void;
  updateFloorPlanStatus: (id: string, status: string, uploadedUrl?: string) => void;
  setImageUploadLoading: (falg: any) => void;
  setImageSelectLoading: (falg: any) => void;
  setLoadingState: (id: string, loading: boolean) => void;
  removeLoadingState: (id: string) => void;
  clearAllLoadingStates: () => void;
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
  loadingStates: {}, // Initialize empty loading states
  setImageUploadLoading: (flag: any) =>
    set(() => ({
      imageUploadLoading: flag,
    })),
  setImageSelectLoading: (flag: any) =>
    set(() => ({
      imageSelectLoading: flag,
    })),
  setLoadingState: (id: string, loading: boolean) =>
    set((state: any) => ({
      loadingStates: {...state.loadingStates, [id]: loading},
    })),
  removeLoadingState: (id: string) =>
    set((state: any) => {
      const newStates = {...state.loadingStates};
      delete newStates[id];
      return {loadingStates: newStates};
    }),
  clearAllLoadingStates: () =>
    set(() => ({
      loadingStates: {},
    })),
  setPostAd: updates =>
    set((state: any) => ({
      postAd: {...state.postAd, ...updates},
    })),
  setImages: images => {
    set(() => ({
      images: images,
    }));
  },

  setFloorPlans: plans => {
    set(() => ({
      floorPlans: plans,
    }));
  },

  updateImageStatus: (id: string, status: string, uploadedUrl?: string) => {
    console.log('🏪 updateImageStatus:', id, status, uploadedUrl ? 'with URL' : 'no URL');
    set((state: any) => ({
      images: state.images.map((img: any) => 
        (img.id || img.uri || img) === id 
          ? { ...img, status, ...(uploadedUrl && { uploadedUrl }) }
          : img
      ),
    }));
  },

  updateFloorPlanStatus: (id: string, status: string, uploadedUrl?: string) => {
    console.log('🏪 updateFloorPlanStatus:', id, status, uploadedUrl ? 'with URL' : 'no URL');
    set((state: any) => ({
      floorPlans: state.floorPlans.map((plan: any) => 
        (plan.id || plan.uri || plan) === id 
          ? { ...plan, status, ...(uploadedUrl && { uploadedUrl }) }
          : plan
      ),
    }));
  },
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
