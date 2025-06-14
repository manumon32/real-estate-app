export type ListingType = 'rent' | 'sale' | 'lease';

export interface PostAd {
  propertyType?: {};
  priceRange?: [number, number];
  listingType?: [ListingType];
  amenities?: [];
  bedrooms?: [number];
  bathrooms?: [number];
}

export interface PostAdSlice {
  postAd: any;
  setPostAd: (updates: Partial<any>) => void;
  resetPostAd: () => void;
}

const defaultPostAd: any = {};

export const createPostAdSlice = (set: any): PostAdSlice => ({
  postAd: defaultPostAd,

  setPostAd: updates =>
    set((state: any) => ({
      postAd: {...state.postAd, ...updates},
    })),

  resetPostAd: () => set({postAd: {}}),
});
