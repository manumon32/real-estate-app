import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';
import { fetchReportedAd, reportAdsAPI } from '@api/services';
import Toast from 'react-native-toast-message';

jest.mock('@api/services', () => ({
  fetchReportedAd: jest.fn(),
  reportAdsAPI: jest.fn(),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('ReportAd Slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.getState().resetReportAd(); // reset before each test
    });
  });

  it('should fetch reported ads successfully', async () => {
    const mockData = [{ _id: '1', propertyId: 'p1' }];
    (fetchReportedAd as jest.Mock).mockResolvedValueOnce({ rows: mockData });

    await act(async () => {
      await useBoundStore.getState().fetchReportedAd();
    });

    expect(fetchReportedAd).toHaveBeenCalledTimes(1);
    expect(useBoundStore.getState().reportAdList).toEqual(mockData);
    expect(useBoundStore.getState().reportAdListLoading).toBe(false);
  });

  it('should handle fetchReportedAd API failure', async () => {
    (fetchReportedAd as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await useBoundStore.getState().fetchReportedAd();
    });

    expect(useBoundStore.getState().reportAdListLoading).toBe(false);
  });

  it('should report ad successfully and show toast', async () => {
    (reportAdsAPI as jest.Mock).mockResolvedValueOnce({ success: true });

    await act(async () => {
      await useBoundStore.getState().reportAd({ adId: '1', reason: 'spam' });
    });

    expect(reportAdsAPI).toHaveBeenCalledTimes(1);
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success', text1: 'Repoted Successfully' })
    );
    expect(useBoundStore.getState().reportAdLoading).toBe(false);
  });

  it('should handle reportAd API failure', async () => {
    (reportAdsAPI as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await useBoundStore.getState().reportAd({ adId: '2', reason: 'fraud' });
    });

    expect(useBoundStore.getState().reportAdLoading).toBe(false);
  });

  it('should reset report ad list', () => {
    act(() => {
      useBoundStore.getState().resetReportAd();
    });

    expect(useBoundStore.getState().reportAdList).toEqual([]);
  });
});
