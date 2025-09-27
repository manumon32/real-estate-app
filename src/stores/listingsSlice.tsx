import {fetchListingsFromAPI} from '@api/services';
import {navigate} from '@navigation/RootNavigation';

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
  fetchInitialListings: () => Promise<void>;
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
    set({
      loading: true,
      triggerRefresh: false,
    });
    let filters: any = {
      pageNum: get().page + 1,
      pageSize: 6,
    };
    if (get().location) {
      const {city, district, state, country, lat, lng} = get().location;

      if (city || district) {
        filters = {
          ...filters,
          filter_near: [lat, lng, city ? 30 : 50].join(','), // 30 = radius
          orderBy: 'distance',
          orderByDir: 'asc',
        };
      } else if (state) {
        filters = {
          ...filters,
          filter_state: state,
          orderBy: 'distance',
          orderByDir: 'asc',
        };
      } else if (country) {
        filters = {
          ...filters,
          filter_country: country,
          orderBy: 'distance',
          orderByDir: 'asc',
        };
      }
    }
    try {
      const res = await fetchListingsFromAPI(filters, {
        token: get().token,
        clientId: get().clientId,
      });
      set((state: any) => {
        const newListings =
          filters.pageNum === 1
            ? res.rows
            : [
                ...state.listings,
                ...res.rows.filter(
                  item =>
                    !state.listings.some(
                      (l: {_id: string}) => l._id === item._id,
                    ),
                ),
              ];

        return {
          listings: newListings,
          page: res.pageNum,
          hasMore: res.pageNum < res.pages,
          loading: false,
        };
      });
    } catch (err: any) {
      set({error: err.message, loading: false});
    }
  },
  fetchInitialListings: async () => {
    set({
      // loading: true,
      triggerRefresh: false,
    });
    let filters: any = {
      pageNum: 1,
      pageSize: 6,
    };
    if (get().location) {
      const {city, district, state, country, lat, lng} = get().location;

      if (city || district) {
        filters = {
          ...filters,
          filter_near: [lat, lng, city ? 30 : 50].join(','), // 30 = radius
          orderBy: 'distance',
          orderByDir: 'asc',
        };
      } else if (state) {
        filters = {
          ...filters,
          filter_state: state,
          orderBy: 'distance',
          orderByDir: 'asc',
        };
      } else if (country) {
        filters = {
          ...filters,
          filter_country: country,
          orderBy: 'distance',
          orderByDir: 'asc',
        };
      }
    }
    try {
      const res = await fetchListingsFromAPI(filters, {
        token: get().token,
        clientId: get().clientId,
      });
      set((state: any) => ({
        listings:
          filters.pageNum === 1
            ? res.rows
            : [...state.listings, ...res.rows]?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    t => JSON.stringify(t) === JSON.stringify(item),
                  ),
              ),
        page: res.pageNum,
        hasMore: res.pageNum < res.pages ? true : false,
        loading: false,
      }));
      navigate('Main');
    } catch (err: any) {
      set({error: err.message, loading: false});
      navigate('Main');
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
