import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import * as ImagePicker from 'react-native-image-picker';
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
  const handlePickImage = async () => {
    if (uploadFlag) {
      return false;
    }
    if (limit === 0) {
      Toast.show({
        type: 'error',
        text1: `Limit reached, You can only select up to ${totalLimit} images.`,
        position: 'bottom',
      });
      return;
    }
    try {
      setImageLoading(true);
      const images = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        compressImageQuality: 0.5,
        maxFiles: limit,
        smartAlbums:['PhotoStream','UserLibrary','Screenshots','Panoramas','LivePhotos','UserLibrary']

      });
      console.log('images', images);
      onUpload(images);
    } catch (error: any) {
      cleanImages();
      setImageLoading(false);
      onPickerClose?.();
    }
  };

  const cleanImages = () => {
    ImagePicker.clean().then(() => {
      console.log('removed all tmp images from tmp directory');
    });
  };

  const openCamera = async () => {
    if (uploadFlag) {
      return false;
    }
    if (limit == 0) {
      Toast.show({
        type: 'error',
        text1: 'Limit reached, You can only select up to 10 images.',
        position: 'bottom',
      });
      return;
    }

    // Trigger skeleton immediately before camera opens
    onPickerOpen?.();
    try {
      setImageLoading(true);
      const images = await ImagePicker.openCamera({
        compressImageQuality: 0.5,
      });
      onUpload([images]);
    } catch (error: any) {
      cleanImages();
      setImageLoading(false);
      onPickerClose?.();
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
