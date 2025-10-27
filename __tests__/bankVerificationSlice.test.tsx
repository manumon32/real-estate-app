import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';
import {
  fetchBankVerificationDetailsAPI,
  fetchVerifiedBankAPI,
  startBankVerificationAPI,
} from '@api/services';

jest.mock('@api/services', () => ({
  fetchBankVerificationDetailsAPI: jest.fn(),
  fetchVerifiedBankAPI: jest.fn(),
  startBankVerificationAPI: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('BankVerification Slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.setState({
        banks: [],
        bankVerificationDetails: [],
        bankVerification_loading: false,
        bankVerificationError: null,
        bankVerification_page: 0,
        bankVerification_hasMore: false,
        bankVerification_totalpages: 0,
      });
    });
  });

  it('should fetch banks successfully', async () => {
    const mockBanks = [{ _id: '1', name: 'Bank A' }];
    (fetchVerifiedBankAPI as jest.Mock).mockResolvedValueOnce({ rows: mockBanks });

    await act(async () => {
      await useBoundStore.getState().fetchBanks('property123');
    });

    expect(fetchVerifiedBankAPI).toHaveBeenCalledTimes(1);
    expect(useBoundStore.getState().banks).toEqual(mockBanks);
    expect(useBoundStore.getState().bankVerification_loading).toBe(false);
  });

  it('should handle fetchBanks API failure', async () => {
    (fetchVerifiedBankAPI as jest.Mock).mockRejectedValueOnce(new Error('API error'));

    await act(async () => {
      await useBoundStore.getState().fetchBanks('property123');
    });

    expect(useBoundStore.getState().bankVerificationError).toBe('API error');
    expect(useBoundStore.getState().bankVerification_loading).toBe(false);
  });

  it('should start bank verification successfully', async () => {
    const mockBanks = [{ _id: '1', name: 'Bank B' }];
    (startBankVerificationAPI as jest.Mock).mockResolvedValueOnce({ rows: mockBanks });

    await act(async () => {
      await useBoundStore.getState().startBankVerification('property123');
    });

    expect(startBankVerificationAPI).toHaveBeenCalledTimes(1);
    expect(useBoundStore.getState().banks).toEqual(mockBanks);
    expect(useBoundStore.getState().bankVerification_loading).toBe(false);
  });

  it('should handle startBankVerification API failure', async () => {
    (startBankVerificationAPI as jest.Mock).mockRejectedValueOnce(new Error('Verification failed'));

    await act(async () => {
      await useBoundStore.getState().startBankVerification('property123');
    });

    expect(useBoundStore.getState().bankVerificationError).toBe('Verification failed');
    expect(useBoundStore.getState().bankVerification_loading).toBe(false);
  });

  it('should fetch bank verification details successfully', async () => {
    const mockDetails = [{ _id: 'detail1', message: 'Test message' }];
    (fetchBankVerificationDetailsAPI as jest.Mock).mockResolvedValueOnce({
      rows: mockDetails,
      pageNum: 1,
      pages: 1,
      total: 1,
    });

    await act(async () => {
      await useBoundStore.getState().fetchBankVerificationDetails('bankVerif123');
    });

    expect(fetchBankVerificationDetailsAPI).toHaveBeenCalledTimes(1);
    expect(useBoundStore.getState().bankVerificationDetails).toEqual(mockDetails);
    expect(useBoundStore.getState().bankVerification_loading).toBe(false);
  });

  it('should update bank verification details', () => {
    const msg = { _id: 'detail2', message: 'New message' };

    act(() => {
      useBoundStore.getState().updateBankVerificationDetails(msg);
    });

    expect(useBoundStore.getState().bankVerificationDetails).toContain(msg);
  });

  it('should reset bank verification details', () => {
    act(() => {
      useBoundStore.getState().resetBankVerificationDetails();
    });

    expect(useBoundStore.getState().bankVerificationDetails).toEqual([]);
    expect(useBoundStore.getState().bankVerification_page).toBe(0);
    expect(useBoundStore.getState().bankVerification_hasMore).toBe(false);
  });

  it('should reset the entire bank slice', () => {
    act(() => {
      useBoundStore.getState().resetBankSlice();
    });

    expect(useBoundStore.getState().banks).toEqual([]);
    expect(useBoundStore.getState().bankVerificationDetails).toEqual([]);
    expect(useBoundStore.getState().bankVerification_loading).toBe(false);
    expect(useBoundStore.getState().bankVerification_page).toBe(0);
  });
});
