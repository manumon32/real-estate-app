import messaging from '@react-native-firebase/messaging';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken(); // fetch FCM token
  }
};

const getFcmToken = async () => {
  try{

  const token = await messaging().getToken();
  if (token) {
    console.log('FCM Token:', token);
    // TODO: Send this token to your server
  }
  }catch(err){
    console.log(err)
  }
};
