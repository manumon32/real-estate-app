
import useBoundStore from '@stores/index';

export const resetAllSlices = () => {
  console.log('useBoundStore', useBoundStore.getState().bearerToken);
  const state = useBoundStore.getState();

  // Reset each slice manually (set default values)
  state.resetFilters();
  state.logout();

  // You can reset other slices too if needed:
  // e.g. state.resetFilters(), state.resetChat(), etc.

  // Optionally clear persisted storage too:
  useBoundStore.persist.clearStorage();
};
