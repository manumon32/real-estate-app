import {logoutAPI} from '@api/services';
import {navigate} from '@navigation/RootNavigation';
import useBoundStore from '@stores/index';
import {resetAllZustandStores} from '@stores/resetAllStores';

/**
 * Logs out the user, resets all persisted states,
 * and redirects to the main screen.
 */
export const logoutAndRedirect = async (): Promise<void> => {
  try {
    const {token, clientId, bearerToken} = useBoundStore.getState();

    // Attempt logout API call only if authentication data exists
    if (token && clientId && bearerToken) {
      await logoutAPI(
        {},
        {
          token,
          clientId,
          bearerToken,
        },
      );
    } else {
      console.warn(
        '[logoutAndRedirect] Missing authentication tokens, skipping API call.',
      );
    }

    // Clear all local data/states
    resetAllZustandStores();

    // Navigate to main screen (e.g., login or home)
    navigate('Main');
  } catch (error) {
    console.error('[logoutAndRedirect] Logout failed:', error);

    // Still clear states and navigate even if API call fails
    resetAllZustandStores();
    navigate('Main');
  }
};
