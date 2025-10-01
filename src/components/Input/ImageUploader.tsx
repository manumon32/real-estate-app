import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

interface CommonImageUploaderProps {
  onUpload: (uri: any) => void;
  label: string;
  handleOnpress?: any;
  limit?: number;
  totalLimit?: number;
}

const CommonImageUploader: React.FC<CommonImageUploaderProps> = ({
  onUpload,
  label,
  handleOnpress,
  limit = 10,
  totalLimit = 10,
}) => {
  const handlePickImage = async () => {
    if (limit === 0) {
      Toast.show({
        type: 'error',
        text1: `Limit reached, You can only select up to ${totalLimit} images.`,
        position: 'bottom',
      });
      return;
    }
    const response = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: limit,
    });
    if (response.didCancel) {
      console.log('User cancelled');
    } else if (response.errorCode) {
      console.log('Picker Error:', response.errorMessage);
    } else if (response.assets) {
      // @ts-ignore
      const skippedFiles: string[] = [];

      const imageAssets =
        response.assets?.filter(asset => {
          const mime = asset.type?.toLowerCase() || '';
          const ext = asset.fileName?.split('.').pop()?.toLowerCase();

          const isValid =
            mime === 'image/jpeg' ||
            mime === 'image/png' ||
            ext === 'jpg' ||
            ext === 'jpeg' ||
            ext === 'png';

          if (!isValid) {
            skippedFiles.push(asset.fileName || 'Unknown file');
          }

          return isValid;
        }) || [];

      if (skippedFiles.length > 0) {
        Toast.show({
          type: 'info',
          text1: 'Some images are not supported',
          text2: skippedFiles.join(', '), // 👈 show filenames
          position: 'bottom',
        });

        console.log('❌ Skipped unsupported files:', skippedFiles);
      }
      onUpload(imageAssets);
      // Use array of URIs as needed
    }
  };

  const openCamera = async () => {
    if (limit == 0) {
      Toast.show({
        type: 'error',
        text1: 'Limit reached, You can only select up to 10 images.',
        position: 'bottom',
      });
      return;
    }
    const response = await ImagePicker.launchCamera({
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
    } else if (response.errorCode) {
      console.log('Picker Error:', response.errorMessage);
    } else if (response.assets) {
      const imageUris = response.assets.map(asset => asset.uri);
      console.log('Selected images:', imageUris);
      onUpload(response.assets);
      // Use array of URIs as needed
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
