import {fetchNotificationsAPI} from '@api/services';

export interface NotificationsSlice {
  notifications_Loading: Boolean;
  notifications_List: string[];
  fetchNotifications: () => void;
  updateNotifications: (payload: any) => void;
  resetNotifications: () => void;
}

export const createNotificationsSlice = (
  set: any,
  get: any,
): NotificationsSlice => ({
  notifications_List: [],
  notifications_Loading: false,
  fetchNotifications: async () => {
    set({notifications_ListLoading: true});
    try {
      const res = await fetchNotificationsAPI({
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      res?.rows &&
        set(() => ({
          notifications_List: res.rows,
          notifications_ListLoading: false,
        }));
    } catch (err) {
      // Rollback if API fails
      set({notifications_ListLoading: false});
    }
  },
  updateNotifications: async (payload: any) => {
    set({notifications_List: payload});
  },
  resetNotifications: () =>set({notifications_List:[]}),
});
