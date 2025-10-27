import {act} from 'react-test-renderer';
import {cleanup} from '@testing-library/react-native';

// import ReactTestRenderer from 'react-test-renderer';
import useBoundStore from '../src/stores/index';
import Toast from 'react-native-toast-message';
afterEach(cleanup);

// test('renders root navigator', async () => {
//   const { getByTestId } = render(<App />);

//   await waitFor(() => {
//     expect(getByTestId('root-navigator')).toBeTruthy();
//   });
// });

describe('Auth slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.getState().logout(); // reset state before each test
    });
    jest.clearAllMocks();
  });

  it('should set navigation mode', () => {
    act(() => {
      useBoundStore.getState().setNavigationMode(true);
    });

    expect(useBoundStore.getState().navigationMode).toBe(true);
  });

  it('should send email OTP successfully', async () => {
    await act(async () => {
      await useBoundStore.getState().sentEmailOTP({email: 'test@example.com'});
    });

    expect(useBoundStore.getState().otp).toBe(true);
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        text1: 'OTP send Successfully',
      }),
    );
  });

  it('should verify email OTP successfully', async () => {
    await act(async () => {
      await useBoundStore
        .getState()
        .verifyEmailOTP({email: 'test@example.com', otp: '1234'});
    });

    expect(useBoundStore.getState().user).toEqual(
      expect.objectContaining({
        email: 'test@example.com',
        isEmailVerified: true,
      }),
    );
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        text1: 'Email Verified Successfully',
      }),
    );
  });

  it('should login successfully', async () => {
    await act(async () => {
      await useBoundStore
        .getState()
        .login({email: 'test@example.com', password: '1234'});
    });

    expect(useBoundStore.getState().otp).toBe(true);
    expect(useBoundStore.getState().otpLoading).toBe(false);
  });

  it('should logout successfully', async () => {
    await act(async () => {
      await useBoundStore.getState().logout();
    });

    expect(useBoundStore.getState().user).toBeNull();
    expect(useBoundStore.getState().bearerToken).toBeNull();
  });
});
