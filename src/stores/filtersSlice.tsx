export type ListingType = 'rent' | 'sale' | 'lease';

export interface Filters {
  propertyType?:{},
  priceRange?: [number, number];
  listingType?: [ListingType];
  amenities?: [];
  bedrooms?: [number] ;
  bathrooms?: [number] ;
}

export interface FiltersSlice {
  filters: any;
  setFilters: (updates: Partial<any>) => void;
  resetFilters: () => void;
}

const defaultFilters: any = {
};

export const createFiltersSlice = (set: any): FiltersSlice => ({
  filters: defaultFilters,

  setFilters: updates =>
    set((state: any) => ({
      filters: {...state.filters, ...updates},
    })),

  resetFilters: () => set({filters: defaultFilters}),
});
