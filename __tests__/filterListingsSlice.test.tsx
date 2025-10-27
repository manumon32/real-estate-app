import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';
import { fetchListingsFromAPI, fetchSuggesionsAPI } from '@api/services';

jest.mock('@api/services', () => ({
  fetchListingsFromAPI: jest.fn(),
  fetchSuggesionsAPI: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('FilterListings Slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.setState({
        filter_listings: [],
        filter_suggestions: [],
        filter_page: 0,
        filter_hasMore: false,
        filter_loading: false,
        filter_error: null,
        filter_triggerRefresh: false,
        filter_totalpages: 0,
      });
    });
  });

  it('should initialize with default state', () => {
    const state = useBoundStore.getState();
    expect(state.filter_listings).toEqual([]);
    expect(state.filter_suggestions).toEqual([]);
    expect(state.filter_page).toBe(0);
    expect(state.filter_loading).toBe(false);
    expect(state.filter_hasMore).toBe(false);
  });

  it('should fetch filter listings successfully', async () => {
    const mockResponse = {
      rows: [{ _id: '1', title: 'Test Listing', price: 100 }],
      pageNum: 1,
      pages: 2,
      total: 10,
    };
    (fetchListingsFromAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

    await act(async () => {
      await useBoundStore.getState().fetchFilterListings();
    });

    const state = useBoundStore.getState();
    expect(fetchListingsFromAPI).toHaveBeenCalledTimes(1);
    expect(state.filter_listings).toEqual(mockResponse.rows);
    expect(state.filter_page).toBe(1);
    expect(state.filter_hasMore).toBe(true);
    expect(state.filter_totalpages).toBe(10);
    expect(state.filter_loading).toBe(false);
  });

  it('should handle fetch listings API failure', async () => {
    (fetchListingsFromAPI as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await useBoundStore.getState().fetchFilterListings();
    });

    const state = useBoundStore.getState();
    expect(state.filter_error).toBe('Network error');
    expect(state.filter_loading).toBe(false);
  });

  it('should fetch suggestions successfully', async () => {
    const mockSuggestions = { suggestions: ['Pool', 'Gym'] };
    (fetchSuggesionsAPI as jest.Mock).mockResolvedValueOnce(mockSuggestions);

    await act(async () => {
      await useBoundStore.getState().fetchSuggestions();
    });

    const state = useBoundStore.getState();
    expect(fetchSuggesionsAPI).toHaveBeenCalledTimes(1);
    expect(state.filter_suggestions).toEqual(['Pool', 'Gym']);
  });

  it('should clear filter list correctly', () => {
    act(() => {
      useBoundStore.setState({
        // @ts-ignore
        filter_listings: [{ _id: '1' }],
        filter_page: 2,
        filter_totalpages: 5,
        filter_hasMore: true,
      });
      useBoundStore.getState().clearFilterList();
    });

    const state = useBoundStore.getState();
    expect(state.filter_listings).toEqual([]);
    expect(state.filter_page).toBe(0);
    expect(state.filter_totalpages).toBe(0);
    expect(state.filter_hasMore).toBe(false);
    expect(state.filter_loading).toBe(false);
    expect(state.filter_triggerRefresh).toBe(false);
  });

  it('should set trigger refresh correctly', () => {
    act(() => {
      useBoundStore.getState().filterSetTriggerRefresh();
    });

    const state = useBoundStore.getState();
    expect(state.filter_triggerRefresh).toBe(true);
    expect(state.filter_page).toBe(0);
    expect(state.filter_totalpages).toBe(0);
    expect(state.filter_hasMore).toBe(false);
    expect(state.filter_loading).toBe(false);
  });
});
