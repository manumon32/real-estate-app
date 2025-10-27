import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';
import { fetchListingsFromAPI } from '@api/services';
import { navigateandReset } from '@navigation/RootNavigation';

jest.mock('@api/services', () => ({
  fetchListingsFromAPI: jest.fn(),
}));

jest.mock('@navigation/RootNavigation', () => ({
  navigateandReset: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('Listings Slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.setState({
        listings: [],
        page: 0,
        hasMore: false,
        loading: false,
        error: null,
        triggerRefresh: false,
      });
    });
  });

  it('should set trigger refresh', () => {
    act(() => {
      useBoundStore.getState().setTriggerRefresh();
    });

    const state = useBoundStore.getState();
    expect(state.page).toBe(0);
    expect(state.triggerRefresh).toBe(true);
  });

  it('should set trigger reload', () => {
    act(() => {
        // @ts-ignore
      useBoundStore.setState({ listings: [{ _id: '1' }] });
      useBoundStore.getState().setTriggerRelaod();
    });

    const state = useBoundStore.getState();
    expect(state.page).toBe(0);
    expect(state.listings).toEqual([]);
  });

  it('should fetch listings successfully', async () => {
    const mockListings = {
      rows: [{ _id: '1', title: 'Listing 1' }],
      pageNum: 1,
      pages: 2,
    };
    (fetchListingsFromAPI as jest.Mock).mockResolvedValueOnce(mockListings);

    await act(async () => {
      await useBoundStore.getState().fetchListings();
    });

    const state = useBoundStore.getState();
    expect(fetchListingsFromAPI).toHaveBeenCalledTimes(1);
    expect(state.listings).toEqual(mockListings.rows);
    expect(state.page).toBe(1);
    expect(state.hasMore).toBe(true);
    expect(state.loading).toBe(false);
  });

  it('should handle fetch listings error', async () => {
    (fetchListingsFromAPI as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );

    await act(async () => {
      await useBoundStore.getState().fetchListings();
    });

    const state = useBoundStore.getState();
    expect(state.error).toBe('Network error');
    expect(state.loading).toBe(false);
  });

  it('should fetch initial listings successfully and call navigateandReset', async () => {
    const mockListings = {
      rows: [{ _id: 'init1', title: 'Init Listing' }],
      pageNum: 1,
      pages: 1,
    };
    (fetchListingsFromAPI as jest.Mock).mockResolvedValueOnce(mockListings);

    await act(async () => {
      await useBoundStore.getState().fetchInitialListings();
    });

    const state = useBoundStore.getState();
    expect(fetchListingsFromAPI).toHaveBeenCalledTimes(1);
    expect(state.listings).toEqual(mockListings.rows);
    expect(navigateandReset).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch initial listings error and call navigateandReset', async () => {
    (fetchListingsFromAPI as jest.Mock).mockRejectedValueOnce(
      new Error('API fail'),
    );

    await act(async () => {
      await useBoundStore.getState().fetchInitialListings();
    });

    const state = useBoundStore.getState();
    expect(state.error).toBe('API fail');
    expect(navigateandReset).toHaveBeenCalledTimes(1);
  });
});
