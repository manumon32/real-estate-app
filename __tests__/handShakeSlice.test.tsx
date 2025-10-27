import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';
import { getHandshakeTokenApi } from '@api/services';
import * as Keychain from 'react-native-keychain';

jest.mock('@api/services', () => ({
  getHandshakeTokenApi: jest.fn(),
}));

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('HandShake Slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.setState({
        clientId: null,
        token: null,
        handShakeError: false,
        habdshakeErrorLog: null,
      });
    });
  });

  it('should initialize with default state', () => {
    const state = useBoundStore.getState();
    expect(state.clientId).toBeNull();
    expect(state.token).toBeNull();
    expect(state.handShakeError).toBe(false);
    expect(state.habdshakeErrorLog).toBeNull();
  });

  it('should get handshake token successfully', async () => {
    const mockResp = { clientId: '123', secretKey: 'token_abc' };
    (getHandshakeTokenApi as jest.Mock).mockResolvedValueOnce(mockResp);

    await act(async () => {
      await useBoundStore.getState().gethandShakeToken({ username: 'test' });
    });

    const state = useBoundStore.getState();
    expect(getHandshakeTokenApi).toHaveBeenCalledTimes(1);
    expect(state.clientId).toBe('123');
    expect(state.token).toBe('token_abc');
    expect(state.handShakeError).toBe(false);
  });

  it('should handle handshake API failure (no secretKey)', async () => {
    const mockResp = { error: 'Invalid request' };
    (getHandshakeTokenApi as jest.Mock).mockResolvedValueOnce(mockResp);

    await act(async () => {
      await useBoundStore.getState().gethandShakeToken({ username: 'fail' });
    });

    const state = useBoundStore.getState();
    expect(state.handShakeError).toBe(true);
    expect(state.habdshakeErrorLog).toEqual(mockResp);
  });

  it('should handle handshake API rejection', async () => {
    const mockError = new Error('Network error');
    (getHandshakeTokenApi as jest.Mock).mockRejectedValueOnce(mockError);

    await act(async () => {
      await useBoundStore.getState().gethandShakeToken({ username: 'error' });
    });

    const state = useBoundStore.getState();
    expect(state.handShakeError).toBe(true);
    expect(state.habdshakeErrorLog).toBe(mockError);
  });

  it('should load token from Keychain', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValueOnce({
      username: 'user',
      password: 'keychain_token',
    });

    await act(async () => {
      await useBoundStore.getState().loadToken();
    });

    const state = useBoundStore.getState();
    expect(Keychain.getGenericPassword).toHaveBeenCalledTimes(1);
    expect(state.token).toBe('keychain_token');
  });

  it('should handle empty Keychain', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValueOnce(false);

    await act(async () => {
      await useBoundStore.getState().loadToken();
    });

    const state = useBoundStore.getState();
    expect(state.token).toBeNull();
  });
});
