import { Listing } from './listingsSlice';

export interface FavoritesSlice {
  favorites: Listing[];
  toggleFavorite: (item: Listing) => void;
}

export const createFavoritesSlice = (set: any): FavoritesSlice => ({
  favorites: [],

  toggleFavorite: (item) =>
    set((state: any) => {
      const exists = state.favorites.find((i: Listing) => i.id === item.id);
      return {
        favorites: exists
          ? state.favorites.filter((i: Listing) => i.id !== item.id)
          : [...state.favorites, item],
      };
    }),
});
