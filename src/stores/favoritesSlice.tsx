import {fetchFavoritessAPI, UpdateFavouritesAPI} from '@api/services';

export interface FavoritesSlice {
  favoritesLoading: Boolean;
  favorites: any[];
  toggleFavorite: (item: any) => void;
  fetchFavouriteAds: () => void;
  isFavorite: (id: string) => boolean;
}

export const createFavoritesSlice = (set: any, get: any): FavoritesSlice => ({
  favorites: [],
  favoritesLoading: false,
  toggleFavorite: async item => {
    const {favorites} = get();
    const exists = favorites.find((fav: {_id: any}) => fav._id === item._id);
    let payload = {propertyId: item._id, note: 'Dream flat!'};
    if (exists) {
      set({favorites: favorites.filter((f: {_id: any}) => f._id !== item._id)});
      try {
        await UpdateFavouritesAPI(
          payload,
          {
            token: get().token,
            clientId: get().clientId,
            bearerToken: get().bearerToken,
          },
          'delete',
        );
      } catch (err) {
        // Rollback if API fails
        set({favorites});
      }
    } else {
      const updated = [item, ...favorites];
      set({favorites: updated});
      try {
        await UpdateFavouritesAPI(
          payload,
          {
            token: get().token,
            clientId: get().clientId,
            bearerToken: get().bearerToken,
          },
          'post',
        );
      } catch (err) {
        // Rollback if API fails
        set({favorites});
      }
    }
  },
  fetchFavouriteAds: async () => {
    set({favoritesLoading: true});
    try {
      const res = await fetchFavoritessAPI({
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      res?.rows &&
        set(() => ({
          favorites: res.rows,
          favoritesLoading: false
        }));
    } catch (err) {
      // Rollback if API fails
      // set({favorites});
    }
  },
  isFavorite: _id =>
    !!get().favorites.find((fav: {_id: string}) => fav._id === _id),
});
