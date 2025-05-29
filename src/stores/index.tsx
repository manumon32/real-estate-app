import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {createHandShakeSlice, HandShakeSlice} from './handShakeSlice';
import {createAuthSlice, AuthSlice} from './authSlice';
import {createFiltersSlice, FiltersSlice} from './filtersSlice';
import {createListingsSlice, ListingsSlice} from './listingsSlice';
import {createFavoritesSlice, FavoritesSlice} from './favoritesSlice';
import {zustandStorage} from './storage';

type StoreState = HandShakeSlice &
  AuthSlice &
  FiltersSlice &
  ListingsSlice &
  FavoritesSlice;

// get
const useBoundStore = create<StoreState>()(
  devtools(
    persist(
      set => ({
        ...createAuthSlice(set),
        ...createHandShakeSlice(set),
        ...createFiltersSlice(set),
        ...createListingsSlice(set),
        ...createFavoritesSlice(set),
      }),
      {
        name: 'auth-storage',
        storage: zustandStorage,
        partialize: state => ({
          clientId: state.clientId,
          token: state.token,
        }),
      },
    ),
    {name: 'BoundStore'},
  ),
);

export default useBoundStore;
