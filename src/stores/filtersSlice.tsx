export type ListingType = 'rent' | 'sale' | 'lease';

export interface Filters {
  priceRange: [number, number];
  listingType: ListingType | null;
  amenities: string[] | null;
  bedrooms: number | null;
  bathrooms: number | null;
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
  bedrooms: 1,
  bathrooms: 1,
};

export const createFiltersSlice = (set: any): FiltersSlice => ({
  filters: defaultFilters,

  setFilters: updates =>
    set((state: any) => ({
      filters: {...state.filters, ...updates},
    })),

  resetFilters: () => set({filters: defaultFilters}),
});
