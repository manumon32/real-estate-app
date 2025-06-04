import {create} from 'zustand';
import {devtools, persist, createJSONStorage} from 'zustand/middleware';
import {createHandShakeSlice, HandShakeSlice} from './handShakeSlice';
import {createAuthSlice, AuthSlice} from './authSlice';
import {createFiltersSlice, FiltersSlice} from './filtersSlice';
import {createListingsSlice, ListingsSlice} from './listingsSlice';
import {createFavoritesSlice, FavoritesSlice} from './favoritesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createDetailSlice, DetailSlice} from './detailSlice';
// import {zustandStorage} from './storage';

type StoreState = HandShakeSlice &
  AuthSlice &
  FiltersSlice &
  ListingsSlice &
  DetailSlice &
  FavoritesSlice;

// get
const useBoundStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        ...createAuthSlice(set),
        ...createHandShakeSlice(set),
        ...createFiltersSlice(set),
        ...createListingsSlice(set, get),
        ...createDetailSlice(set, get),
        ...createFavoritesSlice(set),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: state => ({
          token: state.token,
          clientId: state.clientId,
        }),
        onRehydrateStorage: () => state => {
          console.log('🔄 Rehydrated Zustand state:', state);
        },
      },
    ),
    {name: 'BoundStore'},
  ),
);

export default useBoundStore;
