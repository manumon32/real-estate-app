import {fetchListingsFromAPI} from '@api/services';

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

export interface ListingsSlice {
  listings: Listing[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  fetchListings: (filters?: any, page?: number) => Promise<void>;
}

export const createListingsSlice = (set: any, get: any): ListingsSlice => ({
  listings: [],
  page: 1,
  hasMore: false,
  loading: false,
  error: null,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchListings: async (filters, page = 1) => {
    set({loading: true});
    try {
      const res = await fetchListingsFromAPI(filters, {
        token: get().token,
        clientId: get().clientId,
      });
      set((state: any) => ({
        listings: page === 1 ? res.rows : [...state.listings, ...res.rows],
        page,
        hasMore: false,
        loading: false,
      }));
    } catch (err: any) {
      set({error: err.message, loading: false});
    }
  },
});
