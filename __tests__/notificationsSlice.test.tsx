import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';
import { fetchNotificationsAPI } from '@api/services';

jest.mock('@api/services', () => ({
  fetchNotificationsAPI: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('Notifications Slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.setState({
        notifications_List: [],
        notifications_Loading: false,
        notificationsCount: 0,
      });
    });
  });

  it('should fetch notifications successfully', async () => {
    const mockNotifications = ['Notification 1', 'Notification 2'];
    (fetchNotificationsAPI as jest.Mock).mockResolvedValueOnce({ rows: mockNotifications });

    await act(async () => {
      await useBoundStore.getState().fetchNotifications();
    });

    expect(fetchNotificationsAPI).toHaveBeenCalledTimes(1);
    const state = useBoundStore.getState();
    expect(state.notifications_List).toEqual(mockNotifications);
    expect(state.notifications_Loading).toBe(false);
  });

  it('should handle fetchNotifications failure', async () => {
    (fetchNotificationsAPI as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await useBoundStore.getState().fetchNotifications();
    });

    const state = useBoundStore.getState();
    expect(state.notifications_List).toEqual([]);
    expect(state.notifications_Loading).toBe(false);
  });

  it('should update notification count', () => {
    act(() => {
      useBoundStore.getState().updateNotificationCount(5);
    });
    const state = useBoundStore.getState();
    expect(state.notificationsCount).toBe(5);
  });

  it('should update notifications list', () => {
    const newNotifications = ['New 1', 'New 2'];
    act(() => {
      useBoundStore.getState().updateNotifications(newNotifications);
    });
    const state = useBoundStore.getState();
    expect(state.notifications_List).toEqual(newNotifications);
  });

  it('should reset notifications', () => {
    act(() => {
      useBoundStore.setState({
        notifications_List: ['Old 1'],
        notificationsCount: 3,
      });
      useBoundStore.getState().resetNotifications();
    });

    const state = useBoundStore.getState();
    expect(state.notifications_List).toEqual([]);
    expect(state.notificationsCount).toBe(0);
  });
});
