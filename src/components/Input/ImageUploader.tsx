import React, {useCallback} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  Alert,
} from 'react-native';

import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePick from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import Toast from 'react-native-toast-message';

interface CommonImageUploaderProps {
  onUpload: (uri: any) => void;
  label: string;
  handleOnpress?: any;
  limit?: number;
  totalLimit?: number;
  onPickerOpen?: () => void;
  onPickerClose?: () => void;
  maxFileSize?: number; // in MB
  uploadFlag?: boolean;
  setImageLoading?: any;
}

const CommonImageUploader: React.FC<CommonImageUploaderProps> = ({
  onUpload,
  label,
  handleOnpress,
  limit = 10,
  totalLimit = 15,
  onPickerOpen,
  onPickerClose,
  uploadFlag = false,
  setImageLoading,
}) => {
  const requestPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      const permission = PERMISSIONS.ANDROID.CAMERA;

      let status = await check(permission);

      if (status === RESULTS.DENIED) {
        status = await request(permission);
      }

      if (status === RESULTS.DENIED) {
        status = await request(permission);
      }

      if (status === RESULTS.GRANTED) {
        return true;
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
    }
    return true; // iOS handled by CameraRoll automatically
  }, []);

  const handlePickImage = async () => {
    if (uploadFlag) {
      Toast.show({
        type: 'info',
        text1: 'Please wait...',
        position: 'bottom',
      });
      return;
    }
    if (limit === 0) {
      Toast.show({
        type: 'error',
        text1: `Limit reached, You can only select up to ${totalLimit} images.`,
        position: 'bottom',
      });
      return;
    }
    if (Platform.OS === 'android') {
      openLibraryAndroid();
    } else {
      try {
        setImageLoading(true);
        const images = await ImagePicker.openPicker({
          multiple: limit === 1 ? false : true,
          mediaType: 'photo',
          compressImageQuality: 0.5,
          maxFiles: limit,
          smartAlbums: [
            'PhotoStream',
            'UserLibrary',
            'Screenshots',
            'Panoramas',
            'LivePhotos',
            'UserLibrary',
          ],
        });
        onUpload(limit == 1 ? [images] : images);
      } catch (error: any) {
        cleanImages();
        setImageLoading(false);
        onPickerClose?.();
      }
    }
  };

  const cleanImages = () => {
    ImagePicker.clean().then(() => {
      console.log('removed all tmp images from tmp directory');
    });
  };

  const openCamera = async () => {
    if (uploadFlag) {
       Toast.show({
        type: 'info',
        text1: 'Please wait...',
        position: 'bottom',
      });
      return;
    }
    if (limit === 0) {
      Toast.show({
        type: 'error',
        text1: `Limit reached, You can only select up to ${totalLimit} images.`,
        position: 'bottom',
      });
      return;
    }
    const ok = await requestPermission();
    if (!ok) return;

    if (Platform.OS === 'android') {
      openCameraAndroid();
    } else {
      try {
        // setImageLoading(true);
        const images = await ImagePicker.openCamera({});
        onUpload([images]);
      } catch (error: any) {
        console.log('error', error);
        cleanImages();
        setImageLoading(false);
        onPickerClose?.();
      }
    }
  };

  const openCameraAndroid = async () => {
    if (limit == 0) {
      Toast.show({
        type: 'error',
        text1: `Limit reached, You can only select up to ${totalLimit} images.`,
        position: 'bottom',
      });
      return;
    }

    const response = await ImagePick.launchCamera({
      mediaType: 'photo',
      includeBase64: false,
      saveToPhotos: true,
      quality: 1,
      cameraType: 'back',
      presentationStyle: 'fullScreen',
      // ✅ Important
      includeExtra: true, // provides exif info (orientation, etc.)
    });
    if (response.didCancel) {
      console.log('User cancelled');
      onPickerClose?.(); // Trigger close callback on cancel
    } else if (response.errorCode) {
      console.log('Picker Error:', response.errorMessage);
      onPickerClose?.(); // Trigger close callback on error
    } else if (response.assets) {
      const validAssets = response.assets.map(asset => {
        return {...asset, path: asset.uri, size: asset.fileSize};
      });
      onUpload(validAssets);
      // Don't call onPickerClose here as upload function will handle skeleton
    }
  };

  const openLibraryAndroid = async () => {
    if (limit === 0) {
      Toast.show({
        type: 'error',
        text1: `Limit reached, You can only select up to ${totalLimit} images.`,
        position: 'bottom',
      });
      return;
    }

    onPickerOpen?.();
    setImageLoading(true);
    const response = await ImagePick.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: limit,
    });
    if (response.didCancel) {
      console.log('User cancelled');
      onPickerClose?.(); // Trigger close callback on cancel
    } else if (response.errorCode) {
      console.log('Picker Error:', response.errorMessage);
      onPickerClose?.(); // Trigger close callback on error
    } else if (response.assets) {
      const validAssets = response.assets.map(asset => {
        return {...asset, path: asset.uri, size: asset.fileSize};
      });
      onUpload(validAssets);
      // Don't call onPickerClose here as upload function will handle skeleton
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="cloud-upload-outline"
            size={40}
            color="#219E93"
            onPress={handleOnpress ? handleOnpress : handlePickImage}
            style={styles.uploadIcon}
          />
        </TouchableOpacity>
        <MaterialCommunityIcons
          name="camera"
          size={40}
          color="#219E93"
          onPress={handleOnpress ? handleOnpress : openCamera}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#219E93',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#F7F8FC',
    marginVertical: 10,
  },
  uploadIcon: {width: '100%', marginRight: 20},
  label: {
    marginTop: 10,
    color: '#219E93',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CommonImageUploader;
