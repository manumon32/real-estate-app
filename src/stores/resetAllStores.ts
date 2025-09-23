// import useBoundStore from '@stores/index';
// import { createAuthSlice } from './authSlice';
// import { createChatSlice } from './ChatSlice';
// import { createDetailSlice } from './detailSlice';
// import { createFavoritesSlice } from './favoritesSlice';
// import { createFilterListingsSlice } from './filterListingsSlice';
// import { createFiltersSlice } from './filtersSlice';
// import { createListingsSlice } from './listingsSlice';
// import { createLocationSlice } from './LocationSlice';
// import { createManagePlanSlice } from './managePlanSlice';
// import { createMyAdsSlice } from './MyAdsSlice';
// import { createNotificationsSlice } from './NotificationsSlice';
// import { createPostAdSlice } from './PostAdSlice';
// import { createReportAdSlice } from './ReportAdsSlice';
// import { createTransactionsSlice } from './TransactionsSlice';
// import { createAppConfigStore } from './useAppConfigStore';
// import { createBankVerificationSlice } from './VerifyBankSlice';
// import { createVerificationSlice } from './VerifyListingSlice';
// import { createHandShakeSlice } from './handShakeSlice';

// const getInitialStateExcludingHandShake = () => ({
//   ...createAuthSlice(() => {}, () => useBoundStore.getState()),
//   ...createAppConfigStore(() => {}, () => useBoundStore.getState()),
//   ...createFilterListingsSlice(() => {}, () => useBoundStore.getState()),
//   ...createPostAdSlice(() => {}, () => useBoundStore.getState()),
//   ...createFiltersSlice(() => {}),
//   ...createManagePlanSlice(() => {}, () => useBoundStore.getState()),
//   ...createReportAdSlice(() => {}, () => useBoundStore.getState()),
//   ...createLocationSlice(() => {}, () => useBoundStore.getState()),
//   ...createListingsSlice(() => {}, () => useBoundStore.getState()),
//   ...createTransactionsSlice(() => {}, () => useBoundStore.getState()),
//   ...createChatSlice(() => {}, () => useBoundStore.getState()),
//   ...createVerificationSlice(() => {}, () => useBoundStore.getState()),
//   ...createBankVerificationSlice(() => {}, () => useBoundStore.getState()),
//   ...createNotificationsSlice(() => {}, () => useBoundStore.getState()),
//   ...createDetailSlice(() => {}, () => useBoundStore.getState()),
//   ...createMyAdsSlice(() => {}, () => useBoundStore.getState()),
//   ...createFavoritesSlice(() => {}, () => useBoundStore.getState()),
// });


// export const resetAllStoresExceptHandshake = async () => {
//   const store = useBoundStore;

//   // Clear persisted data
//   if (store.persist?.clearStorage) {
//     await store.persist.clearStorage();
//   }

//   // Get preserved handshake slice
//   const handShakeState = {
//     ...store.getState(),
//     ...createHandShakeSlice(() => {}), // safe fallback if needed
//   };

//   // Replace the entire store with preserved `handShake` + fresh others
//   const newState = {
//     ...getInitialStateExcludingHandShake(),
//     ...handShakeState, // override with existing handshake data
//   };

//   store.setState(newState, true); // full replace
// };




import useBoundStore from '@stores/index';

export const resetAllZustandStores = () => {
  console.log('useBoundStore', useBoundStore.getState().bearerToken);
  const state = useBoundStore.getState();

  // Reset each slice manually (set default values)
  state.resetChatDetails();
  state.resetFilters();
  state.clearDetails();
  state.resetFavourites();
  state.clearFilterList();
  state.resetMyads();
  state.resetNotifications();
  state.resetReportAd();
  state.resetTransactions();
  state.resetBankSlice();
  state.resetverificationDetails();
  state.resetChat();
  // state.resetLocation();
  state.resetLocationHistory();
  state.logout();

  // Optionally clear persisted storage too:
  useBoundStore.persist.clearStorage();
};
