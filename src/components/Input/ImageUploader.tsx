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
}

const CommonImageUploader: React.FC<CommonImageUploaderProps> = ({
  onUpload,
  label,
  handleOnpress,
  limit = 10,
}) => {
  const handlePickImage = async () => {
    if (limit == 0) {
      Toast.show({
        type: 'error',
        text1: 'Limit reached, You can only select up to 10 images.',
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
      const imageAssets = response.assets.filter((asset: {type: string}) =>
        asset.type?.startsWith('image/'),
      );
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
            style={{width: '100%', marginRight: 20}}
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
  label: {
    marginTop: 10,
    color: '#219E93',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CommonImageUploader;
