import messaging from '@react-native-firebase/messaging';
import {navigationRef} from '@navigation/RootNavigation';
import {INotification} from '@screens/home/HomeScreen';
import useBoundStore from '@stores/index';
import {markAllReadNotificationsAPI, registerFCMToken} from '@api/services';
import {PermissionsAndroid, Platform} from 'react-native';

var isReady = false;
let pendingNotification: INotification | null = null;

export const requestUserPermission = async () => {
  const {bearerToken} = useBoundStore.getState();
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled && bearerToken) {
    console.log('Authorization status:', authStatus);
    try {
      // await messaging().registerDeviceForRemoteMessages();
      getFcmToken(); // fetch FCM token
    } catch (err) {
      console.log('FCM', err);
      console.log(err);
    }
  }
};

const getFcmToken = async () => {
  const {token, clientId, bearerToken} = useBoundStore.getState();
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      let payload = {
        fcmToken: fcmToken,
      };
      await registerFCMToken(payload, {
        token: token,
        clientId: clientId,
        bearerToken,
      });
      console.log('fcmToken', fcmToken);
    }
  } catch (err) {
    console.log(err);
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
  if (!navigationRef?.isReady() || !isReady) {
    pendingNotification = notification;
    return;
  }

  const {entityType, entityId, metadata, notificationId} = notification;

  if (!entityType) {
    // @ts-ignore
    navigationRef.navigate('Main');
    return;
  }

  const screenName = SCREENS?.[entityType]
    ? SCREENS[entityType]
    : TabSCREENS[entityType]; // assuming screen name is same as entityType
  // @ts-ignore
  let parsedData =
    typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
  const params = {
    items: {
      _id: entityId, // optional
      ...parsedData,
    },
  };
  try {
    console.log('notificationId', notificationId);
    if (bearerToken && notificationId) {
      const body = {notifications: [notificationId]};

      // run in a safe block so navigation isn't blocked
      try {
        const res = await markAllReadNotificationsAPI(body, {
          token,
          clientId,
          bearerToken,
        });

        if (res?.message) {
          console.log('notification count', res.count);
          updateNotificationCount(res?.count ?? 0);
          if (SCREENS[entityType]) {
            // @ts-ignore
            navigationRef.navigate(screenName, entityId ? params : {});
          } else {
            // @ts-ignore
            navigationRef.navigate('Main', {
              screen: 'Chat',
              params,
            });
          }
        }
      } catch (apiErr) {
        if (SCREENS[entityType]) {
          // @ts-ignore
          navigationRef.navigate(screenName, entityId ? params : {});
        } else {
          // @ts-ignore
          navigationRef.navigate('Main', {
            screen: 'Chat',
            params,
          });
        }
      }
    }

    if (SCREENS[entityType]) {
      // @ts-ignore
      navigationRef.navigate(screenName, entityId ? params : {});
    } else {
      // @ts-ignore
      navigationRef.navigate('Main', {
        screen: 'Chat',
        params,
      });
    }
  } catch (err) {
    console.warn('Unexpected error:', err);
    // @ts-ignore
    navigationRef.navigate('Main');
  }
};
