import {create} from 'zustand';
import {devtools, persist, createJSONStorage} from 'zustand/middleware';
import {createHandShakeSlice, HandShakeSlice} from './handShakeSlice';
import {createAuthSlice, AuthSlice} from './authSlice';
import {createFiltersSlice, FiltersSlice} from './filtersSlice';
import {createListingsSlice, ListingsSlice} from './listingsSlice';
import {createFavoritesSlice, FavoritesSlice} from './favoritesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createDetailSlice, DetailSlice} from './detailSlice';
import {createAppConfigStore, AppConfigState} from './useAppConfigStore';
import {
  createFilterListingsSlice,
  FilterListingsSlice,
} from './filterListingsSlice';
import {createLocationSlice, LocationSlice} from './LocationSlice';
import {createPostAdSlice, PostAdSlice} from './PostAdSlice';
import {createMyAdsSlice, MyAdsSlice} from './MyAdsSlice';
import { createReportAdSlice, ReportAdSlice } from './ReportAdsSlice';
import { createManagePlanSlice, ManagePlanSlice } from './managePlanSlice';
import { ChatSlice, createChatSlice } from './ChatSlice';
import { createTransactionsSlice, TransactionsSlice } from './TransactionsSlice';
import { createVerificationSlice, VerificationSlice } from './VerifyListingSlice';
import { createNotificationsSlice, NotificationsSlice } from './NotificationsSlice';
// import {zustandStorage} from './storage';

type StoreState = HandShakeSlice &
  AuthSlice &
  FiltersSlice &
  ListingsSlice &
  DetailSlice &
  AppConfigState &
  FilterListingsSlice &
  LocationSlice &
  PostAdSlice &
  MyAdsSlice &
  ReportAdSlice &
  ManagePlanSlice &
  ChatSlice &
  TransactionsSlice &
  VerificationSlice &
  NotificationsSlice &
  FavoritesSlice;

// get
const useBoundStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        ...createAuthSlice(set, get),
        ...createHandShakeSlice(set),
        ...createAppConfigStore(set, get),
        ...createFilterListingsSlice(set, get),
        ...createPostAdSlice(set, get),
        ...createFiltersSlice(set),
        ...createManagePlanSlice(set,get),
        ...createReportAdSlice(set, get),
        ...createLocationSlice(set, get),
        ...createListingsSlice(set, get),
        ...createTransactionsSlice(set,get),
        ...createChatSlice(set, get),
        ...createVerificationSlice(set,get),
        ...createNotificationsSlice(set,get),
        ...createDetailSlice(set, get),
        ...createMyAdsSlice(set, get),
        ...createFavoritesSlice(set, get),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: state => ({
          token: state.token,
          clientId: state.clientId,
          bearerToken: state.bearerToken,
          user: state.user,
          location: state.location,
          appConfigs: state.appConfigs,
          locationHistory: state.locationHistory,
          chatRoomId: state.chatRoomId,
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
