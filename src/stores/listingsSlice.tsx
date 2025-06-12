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
  triggerRefresh: boolean;
  setTriggerRefresh: () => void;
  fetchListings: (filters?: any, page?: number) => Promise<void>;
  setTriggerRelaod: () => void;
}

export const createListingsSlice = (set: any, get: any): ListingsSlice => ({
  listings: [],
  page: 0,
  hasMore: false,
  loading: false,
  triggerRefresh: false,
  error: null,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchListings: async () => {
    set({loading: true, triggerRefresh: false});
    let filters = {
      pageNum: get().page + 1,
    };
    if (get().location?.lat && get().location?.lng) {
      filters = {
        ...filters,
        ...{
          filter_near: [get().location?.lat, get().location?.lng, 10].join(','),
        },
      };
    }
    try {
      const res = await fetchListingsFromAPI(filters, {
        token: get().token,
        clientId: get().clientId,
      });
      set((state: any) => ({
        listings:
          filters.pageNum === 1 ? res.rows : [...state.listings, ...res.rows],
        page: res.pageNum,
        hasMore: res.pageNum < res.pages ? true : false,
        loading: false,
      }));
    } catch (err: any) {
      set({error: err.message, loading: false});
    }
  },
  setTriggerRefresh: () =>
    set({
      page: 0,
      triggerRefresh: true,
    }),

  setTriggerRelaod: () =>
    set({
      page: 0,
      listings: [],
    }),
});
