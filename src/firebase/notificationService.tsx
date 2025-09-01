import messaging from '@react-native-firebase/messaging';
import {navigationRef} from '@navigation/RootNavigation';
import {INotification} from '@screens/home/HomeScreen';
import useBoundStore from '@stores/index';
import {registerFCMToken} from '@api/services';
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

export const navigateByNotification = (notification: INotification) => {
  if (!navigationRef?.isReady() || !isReady) {
    pendingNotification = notification;
    return;
  }

  const {entityType, entityId, metadata} = notification;

  if (!entityType) {
    // @ts-ignore
    navigationRef.navigate('Main');
    return;
  }

  const screenName = entityType; // assuming screen name is same as entityType

  const params = {
    items: {
      _id: entityId, // optional
      ...metadata,
    },
  };

  // @ts-ignore
  navigationRef.navigate(screenName, entityId ? params : {});
};
