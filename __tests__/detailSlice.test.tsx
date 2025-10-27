import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';
import { fetchDetailsAPI } from '@api/services';

jest.mock('@api/services', () => ({
  fetchDetailsAPI: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('Detail Slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.setState({
        details: null,
        detailsBackUp: null,
        detailLoading: false,
        detailsError: null,
        chatRoomId: {},
      });
    });
  });

  it('should initialize with default values', () => {
    const state = useBoundStore.getState();
    expect(state.details).toBeNull();
    expect(state.detailsBackUp).toBeNull();
    expect(state.detailLoading).toBe(false);
    expect(state.detailsError).toBeNull();
    expect(state.chatRoomId).toEqual({});
  });

  it('should set loading to true when fetching details', async () => {
    (fetchDetailsAPI as jest.Mock).mockResolvedValueOnce({ _id: 'p1', title: 'Test Property' });

    const fetchPromise = act(async () => {
      const fetchDetails = useBoundStore.getState().fetchDetails;
      const promise = fetchDetails('123');
      expect(useBoundStore.getState().detailLoading).toBe(true); // should be true immediately
      await promise;
    });

    await fetchPromise;
    const state = useBoundStore.getState();

    expect(state.detailLoading).toBe(false);
    expect(state.details).toEqual(expect.objectContaining({ _id: 'p1' }));
    expect(state.detailsBackUp).toEqual(expect.objectContaining({ _id: 'p1' }));
  });

  it('should handle API error when fetching details fails', async () => {
    (fetchDetailsAPI as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    await act(async () => {
      await useBoundStore.getState().fetchDetails('999');
    });

    const state = useBoundStore.getState();
    expect(state.detailLoading).toBe(false);
    expect(state.detailsError).toBe('Network Error');
    expect(state.details).toBeNull();
  });

  it('should clear details successfully', async () => {
    act(() => {
        // @ts-ignore
      useBoundStore.setState({ details: { _id: 'abc' }, detailLoading: true });
    });

    await act(async () => {
      await useBoundStore.getState().clearDetails();
    });

    const state = useBoundStore.getState();
    expect(state.details).toBeNull();
    expect(state.detailLoading).toBe(false);
  });

  it('should set chat room ID correctly', async () => {
    await act(async () => {
      await useBoundStore.getState().setChatRoomId({ room1: 'abc123' });
    });

    expect(useBoundStore.getState().chatRoomId).toEqual({ room1: 'abc123' });

    // Merging new IDs should not remove old ones
    await act(async () => {
      await useBoundStore.getState().setChatRoomId({ room2: 'xyz789' });
    });

    expect(useBoundStore.getState().chatRoomId).toEqual({
      room1: 'abc123',
      room2: 'xyz789',
    });
  });
});
