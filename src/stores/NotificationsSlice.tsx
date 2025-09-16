import {fetchNotificationsAPI} from '@api/services';

export interface NotificationsSlice {
  notifications_Loading: Boolean;
  notifications_List: string[];
  notificationsCount: number;
  updateNotificationCount: (payload: any) => void;
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
  notificationsCount: 0,
  fetchNotifications: async () => {
    set({notifications_ListLoading: true, notifications_Loading: true});
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
          notifications_Loading: false,
        }));
    } catch (err) {
      // Rollback if API fails
      set({notifications_ListLoading: false,notifications_Loading: false,});
    }
  },
  updateNotificationCount: async (payload: any) => {
    set({notificationsCount: payload,});
  },
  updateNotifications: async (payload: any) => {
    set({notifications_List: payload});
  },
  resetNotifications: () =>set({notifications_List:[], notificationsCount:0}),
});
