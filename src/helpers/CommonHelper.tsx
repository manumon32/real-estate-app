import {Platform, Alert} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {
  PERMISSIONS,
  check,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';
import {v4 as uuidv4} from 'uuid';

export const getPersistentDeviceId = async () => {
  let credentials = await Keychain.getGenericPassword({service: 'device_id'});
  if (!credentials) {
    const newId = await uuidv4();
    console.log('newId', newId);
    await Keychain.setGenericPassword('device', newId, {service: 'device_id'});

    return newId;
  }
  return credentials.password;
};

export const requestCameraPermission = async () => {
  const permission =
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  let status = await check(permission);

  if (status === RESULTS.DENIED) {
    status = await request(permission);
  }

  if (status === RESULTS.BLOCKED) {
    Alert.alert(
      'Permission Required',
      'Please Camera permission in settings to continue.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: () => openSettings()},
      ],
    );
  }
  return status === RESULTS.GRANTED; // iOS handled by CameraRoll automatically
};

export const requestImageLibraryPermission = async () => {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES ||
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE; // for older Android versions

  let status = await check(permission);

  if (status === RESULTS.DENIED) {
    status = await request(permission);
  }

  if (status === RESULTS.BLOCKED) {
    Alert.alert(
      'Permission Required',
      'Please enable photo library access in settings to select images.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: () => openSettings()},
      ],
    );
    return false;
  }

  return status === RESULTS.GRANTED;
};
