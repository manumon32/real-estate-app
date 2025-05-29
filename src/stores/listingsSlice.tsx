// import { fetchListingsFromAPI } from '../api/listings';

export interface Listing {
  id: string;
  title: string;
  price: number;
}

export interface ListingsSlice {
  listings: Listing[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  fetchListings: (filters: any, page?: number) => Promise<void>;
}

export const createListingsSlice = (set: any): ListingsSlice => ({
  listings: [
    {
      id: '1',
      title: 'Helo',
      price: 126,
    },
  ],
  page: 1,
  hasMore: true,
  loading: false,
  error: null,

  fetchListings: async (filters, page = 1) => {
    set({loading: true});
    try {
      const res = //await fetchListingsFromAPI(filters, page);
        set((state: any) => ({
          listings:
            page === 1 ? res.listings : [...state.listings, ...res.listings],
          page,
          hasMore: res.hasMore,
          loading: false,
        }));
    } catch (err: any) {
      set({error: err.message, loading: false});
    }
  },
});
