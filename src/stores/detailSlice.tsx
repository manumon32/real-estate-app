import {fetchDetailsAPI} from '@api/services';

// Types

interface Listing {
  _id: string;
  price: number;
  location: object;
  imageUrls: string[];
  isFeatured: false;
  title: string;
  address: string;
  numberOfBedrooms: number;
}

export interface DetailSlice {
  details: Listing | null;
  detailLoading: boolean;
  error: string | null;
  fetchDetails: (id: string, apiConfig?: number) => Promise<void>;
}

export const createDetailSlice = (set: any, get: any): DetailSlice => ({
  details: null,
  detailLoading: false,
  error: null,
  fetchDetails: async (id: string) => {
    set({detailLoading: true});
    try {
      const res = await fetchDetailsAPI(id, {
        token: get().token,
        clientId: get().clientId,
      });
      set(() => ({
        details: res.data,
        detailLoading: false,
      }));
    } catch (err: any) {
      set({error: err.message, detailLoading: false});
    }
  },
});
