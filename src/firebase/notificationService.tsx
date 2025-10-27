import {
  getMessaging,
  requestPermission,
  getToken,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import {getApp} from '@react-native-firebase/app';
import {navigationRef} from '@navigation/RootNavigation';
import useBoundStore from '@stores/index';
import {markAllReadNotificationsAPI, registerFCMToken} from '@api/services';
import {PermissionsAndroid, Platform} from 'react-native';

export interface INotification {
  userId: string;
  type: 'message' | 'system' | 'property' | 'alert' | 'reminder';
  title: string;
  message: string;
  notificationId:string;
  entityId?: string;
  entityType?: 'chatRoom' | 'property' | 'user' | 'transaction';
  read: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

let isReady = false;
let pendingNotification: INotification | null = null;

export const requestUserPermission = async () => {
  const {bearerToken} = useBoundStore?.getState();
  const messaging = getMessaging(getApp());

  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled && bearerToken) {
    console.log('Authorization status:', authStatus);
    try {
      getFcmToken(); // fetch FCM token
    } catch (err) {
      console.log('FCM error:', err);
    }
  }
};

const getFcmToken = async () => {
  const {token, clientId, bearerToken} = useBoundStore.getState();
  const messaging = getMessaging(getApp());

  try {
    const fcmToken = await getToken(messaging);
    if (fcmToken) {
      let payload = {fcmToken};
      await registerFCMToken(payload, {token, clientId, bearerToken});
      console.log('fcmToken', fcmToken);
    }
  } catch (err) {
    console.log('getFcmToken error:', err);
  }
};

export const onNavigationReady = () => {
  isReady = true;

  // Navigate if any notification was queued
  if (pendingNotification && navigationRef) {
    navigateByNotification(pendingNotification);
    pendingNotification = null;
  }
};

const SCREENS: any = {
  detail: 'Details',
  transaction: 'Transactions',
  appointments: 'Appointments',
  verifylisting: 'VerifyListing',
  verifybanklist: 'VerifyBankList',
};

const TabSCREENS: any = {
  chat: 'Chat',
  myads: 'MyAds',
  profile: 'Profile',
  addpost: 'AddPost',
  filter: 'filter',
};

export const navigateByNotification = async (notification: INotification) => {
  const {token, clientId, bearerToken, updateNotificationCount} =
    useBoundStore.getState();
    console.log('Test', notification)
  if (!navigationRef?.isReady() || !isReady) {
    pendingNotification = notification;
    return;
  }

  const {entityType, entityId, metadata, notificationId} = notification;


  if (!entityType) {
    navigationRef.navigate('Main' as never);
    return;
  }

  const screenName = SCREENS?.[entityType] ?? TabSCREENS[entityType];
  const parsedData =
    typeof metadata === 'string' ? JSON.parse(metadata) : metadata;

  const params = {
    items: {
      _id: entityId,
      ...parsedData,
    },
  };

  try {
    if (bearerToken && notificationId) {
      const body = {notifications: [notificationId]};

      try {
        const res = await markAllReadNotificationsAPI(body, {
          token,
          clientId,
          bearerToken,
        });

        if (res?.message) {
          console.log('notification count', res.count);
          updateNotificationCount(res?.count ?? 0);
        }
      } catch (apiErr) {
        console.log('markAllReadNotificationsAPI error:', apiErr);
      }
    }

    // Single navigation decision
    if (SCREENS[entityType]) {
      navigationRef.navigate(
        // @ts-ignore
        screenName as never,
        entityId ? (params as never) : {},
      );
    } else {
      navigationRef.navigate(
        // @ts-ignore
        'Main' as never,
        {
          screen: 'Home',
          params,
        } as never,
      );
    }
  } catch (err) {
    navigationRef.navigate('Main' as never);
  }
};
