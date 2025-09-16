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

export interface FilterListingsSlice {
  filter_listings: Listing[];
  filter_page: number;
  filter_hasMore: boolean;
  filter_loading: boolean;
  filter_error: string | null;
  filter_triggerRefresh: boolean;
  filter_totalpages: number;
  filterSetTriggerRefresh: () => void;
  clearFilterList: () => void;
  fetchFilterListings: (filters?: any, page?: number) => Promise<void>;
}

export const createFilterListingsSlice = (
  set: any,
  get: any,
): FilterListingsSlice => ({
  filter_listings: [],
  filter_page: 0,
  filter_hasMore: false,
  filter_loading: false,
  filter_triggerRefresh: false,
  filter_error: null,
  filter_totalpages: 0,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchFilterListings: async () => {
    set({
      filter_loading: true,
      filter_triggerRefresh: false,
      filter_listings: get().filter_page == 0 ? [] : get().filter_listings,
    });
    let filters: any = {
      pageNum: get().filter_page + 1,
      pageSize: 6,
    };

    if (get().location) {
      const {city, district, state, country, lat, lng} = get().location;
      // console.log(city, district, state, country, lat, lng)

      if (city || district) {
        filters = {
          ...filters,
          filter_near: [lat, lng, city ? 30 : 50].join(','), // 30 = radius
        };
      } else if (state) {
        filters = {
          ...filters,
          filter_state: state,
        };
      } else if (country) {
        filters = {
          ...filters,
          filter_country: country,
        };
      }
    }
    let filterData = get().filters;
    Object.keys(filterData).map(filter => {
      // console.log('test', filterData[filter]);
      if (Array.isArray(filterData[filter])) {
        if (filterData[filter]?.length > 0) {
          if (filter === 'price') {
            let arrayString = 'btw-' + filterData[filter].join(',');
            let arrayFilterJson = {['filter_' + filter]: arrayString};
            filters = {...filters, ...arrayFilterJson};
          } else {
            let arrayString = 'in-' + filterData[filter].join(',');
            let arrayFilterJson = {['filter_' + filter]: arrayString};
            filters = {...filters, ...arrayFilterJson};
          }
        }
      } else if (typeof filterData[filter] === 'boolean') {
        let arrayFilterJson = {['filter_' + filter]: filterData[filter]};
        filters = {...filters, ...arrayFilterJson};
      } else {
        filters = {...filters, ...{[filter]: filterData[filter]}};
      }
    });
    console.log('filters', filters);
    try {
      const res = await fetchListingsFromAPI(filters, {
        token: get().token,
        clientId: get().clientId,
      });
      set((state: any) => ({
        filter_listings:
          state.filter_page === 0
            ? res.rows
            : [...state.filter_listings, ...res.rows].filter(
                (item, index, self) =>
                  index === self.findIndex(t => t._id === item._id),
              ),
        filter_page: res.pageNum,
        filter_hasMore: res.pageNum < res.pages ? true : false,
        filter_loading: false,
        filter_totalpages: res.total,
      }));
    } catch (err: any) {
      set({filter_error: err.message, filter_loading: false});
    }
  },
  clearFilterList: () =>
    set({
      filter_listings: [],
      filter_page: 0,
      filter_totalpages: 0,
      filter_hasMore: false,
      filter_loading: false,
      filter_triggerRefresh: false,
    }),
  filterSetTriggerRefresh: () =>
    set({
      filter_page: 0,
      filter_totalpages: 0,
      filter_triggerRefresh: true,
      filter_hasMore: false,
      filter_loading: false,
    }),
});
