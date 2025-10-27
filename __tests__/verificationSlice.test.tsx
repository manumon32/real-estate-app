import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';
import {
  fetchverificationDataAPI,
  fetchverificationDetailsAPI,
  startVerificationAPI,
} from '@api/services';
import { navigate } from '@navigation/RootNavigation';

jest.mock('@api/services', () => ({
  fetchverificationDataAPI: jest.fn(),
  fetchverificationDetailsAPI: jest.fn(),
  startVerificationAPI: jest.fn(),
}));

jest.mock('@navigation/RootNavigation', () => ({
  navigate: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('Verification Slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.setState({
        verificationDetails: [],
        verification_loading: false,
        verificationError: null,
        verification_page: 0,
        verification_hasMore: false,
        verification_data: {},
        verification_totalpages: 0,
      });
    });
  });

  it('should start verification successfully and navigate', async () => {
    const mockRes = { _id: 'verification123' };
    (startVerificationAPI as jest.Mock).mockResolvedValueOnce(mockRes);

    await act(async () => {
      await useBoundStore.getState().startVerification('payload');
    });

    expect(startVerificationAPI).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('VerifyListing', { items: { _id: 'verification123' } });
    expect(useBoundStore.getState().verification_loading).toBe(false);
  });

  it('should handle startVerification API failure', async () => {
    (startVerificationAPI as jest.Mock).mockRejectedValueOnce(new Error('Start failed'));

    await act(async () => {
      await useBoundStore.getState().startVerification('payload');
    });

    expect(useBoundStore.getState().verificationError).toBe('Start failed');
    expect(useBoundStore.getState().verification_loading).toBe(false);
  });

  it('should fetch verification details successfully', async () => {
    const mockDetails = [{ _id: 'detail1', message: 'Test message' }];
    (fetchverificationDetailsAPI as jest.Mock).mockResolvedValueOnce({
      rows: mockDetails,
      pageNum: 1,
      pages: 1,
      total: 1,
    });

    await act(async () => {
      await useBoundStore.getState().fetchverificationDetails('verification123');
    });

    expect(fetchverificationDetailsAPI).toHaveBeenCalledTimes(1);
    expect(useBoundStore.getState().verificationDetails).toEqual(mockDetails);
    expect(useBoundStore.getState().verification_loading).toBe(false);
  });

  it('should fetch verification data successfully', async () => {
    const mockData = { _id: 'verification123', status: 'pending' };
    (fetchverificationDataAPI as jest.Mock).mockResolvedValueOnce(mockData);

    await act(async () => {
      await useBoundStore.getState().fetchverificationsData('verification123');
    });

    expect(fetchverificationDataAPI).toHaveBeenCalledTimes(1);
    expect(useBoundStore.getState().verification_data).toEqual(mockData);
    expect(useBoundStore.getState().verification_loading).toBe(false);
  });

  it('should update verification details', () => {
    const msg = { _id: 'detail2', message: 'New message' };

    act(() => {
      useBoundStore.getState().updateVerificationDetails(msg);
    });

    expect(useBoundStore.getState().verificationDetails).toContain(msg);
  });

  it('should reset verification details', () => {
    act(() => {
      useBoundStore.getState().resetverificationDetails();
    });

    expect(useBoundStore.getState().verificationDetails).toEqual([]);
    expect(useBoundStore.getState().verification_page).toBe(0);
    expect(useBoundStore.getState().verification_hasMore).toBe(false);
    expect(useBoundStore.getState().verification_data).toEqual({});
  });
});
