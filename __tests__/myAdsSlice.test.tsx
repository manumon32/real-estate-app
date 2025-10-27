import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';
import { fetchMyAdsAPI } from '@api/services';

jest.mock('@api/services', () => ({
  fetchMyAdsAPI: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('MyAds Slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.setState({
        myAds: [],
        myAdsLoading: false,
      });
    });
  });

  it('should fetch my ads successfully', async () => {
    const mockAds = [{ _id: '1', title: 'Ad 1' }, { _id: '2', title: 'Ad 2' }];
    (fetchMyAdsAPI as jest.Mock).mockResolvedValueOnce({ rows: mockAds });

    await act(async () => {
      await useBoundStore.getState().fetchMyAds();
    });

    expect(fetchMyAdsAPI).toHaveBeenCalledTimes(1);
    const state = useBoundStore.getState();
    expect(state.myAds).toEqual(mockAds);
    expect(state.myAdsLoading).toBe(false);
  });

  it('should handle fetchMyAds failure', async () => {
    (fetchMyAdsAPI as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await useBoundStore.getState().fetchMyAds();
    });

    const state = useBoundStore.getState();
    expect(state.myAdsLoading).toBe(false);
    expect(state.myAds).toEqual([]);
  });

  it('should reset my ads', () => {
    act(() => {
        // @ts-ignore
      useBoundStore.setState({ myAds: [{ _id: '1', title: 'Ad 1' }] });
      useBoundStore.getState().resetMyads();
    });

    const state = useBoundStore.getState();
    expect(state.myAds).toEqual([]);
  });
});
