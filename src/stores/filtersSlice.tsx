export type ListingType = 'rent' | 'sale';

export interface Filters {
  priceRange: [number, number];
  listingType: ListingType;
  amenities: string[];
}

export interface FiltersSlice {
  filters: Filters;
  setFilters: (updates: Partial<Filters>) => void;
  resetFilters: () => void;
}

const defaultFilters: Filters = {
  priceRange: [0, 1000000],
  listingType: 'rent',
  amenities: [],
};

export const createFiltersSlice = (set: any): FiltersSlice => ({
  filters: defaultFilters,

  setFilters: (updates) =>
    set((state: any) => ({
      filters: { ...state.filters, ...updates },
    })),

  resetFilters: () => set({ filters: defaultFilters }),
});
