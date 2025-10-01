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
  onPickerOpen?: () => void;
  onPickerClose?: () => void;
  maxFileSize?: number; // in MB
}

const CommonImageUploader: React.FC<CommonImageUploaderProps> = ({
  onUpload,
  label,
  handleOnpress,
  limit = 10,
  totalLimit = 10,
  onPickerOpen,
  onPickerClose,
  maxFileSize = 30, // Default 30MB limit
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

    // Trigger skeleton immediately before picker opens
    onPickerOpen?.();

    const response = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: limit,
    });
    if (response.didCancel) {
      console.log('User cancelled');
      onPickerClose?.(); // Close skeleton when user cancels
    } else if (response.errorCode) {
      console.log('Picker Error:', response.errorMessage);
      onPickerClose?.(); // Close skeleton on error
    } else if (response.assets) {
      // @ts-ignore
      const skippedFiles: string[] = [];
      const oversizedFiles: string[] = [];

      // Filter images by type and size
      const validAssets = [];

      for (const asset of response.assets) {
        const mime = asset.type?.toLowerCase() || '';
        const ext = asset.fileName?.split('.').pop()?.toLowerCase();

        const isValidType =
          mime === 'image/jpeg' ||
          mime === 'image/png' ||
          ext === 'jpg' ||
          ext === 'jpeg' ||
          ext === 'png';

        if (!isValidType) {
          skippedFiles.push(asset.fileName || 'Unknown file');
          continue;
        }

        // Check file size using the fileSize property from ImagePicker
        if (asset.fileSize) {
          const sizeInMB = asset.fileSize / (1024 * 1024);

          if (sizeInMB > maxFileSize) {
            oversizedFiles.push(
              `${asset.fileName || 'Unknown file'} (${sizeInMB.toFixed(1)}MB)`,
            );
            continue;
          }
        }

        validAssets.push(asset);
      }

      // Show toast for skipped files
      if (skippedFiles.length > 0) {
        Toast.show({
          type: 'info',
          text1: 'Some images are not supported',
          text2: skippedFiles.join(', '),
          position: 'bottom',
        });
      }

      // Show toast for oversized files
      if (oversizedFiles.length > 0) {
        Toast.show({
          type: 'warning',
          text1: `Images larger than ${maxFileSize}MB were excluded`,
          text2: oversizedFiles.join(', '),
          position: 'bottom',
          visibilityTime: 5000,
        });
      }

      if (
        validAssets.length === 0 &&
        (skippedFiles.length > 0 || oversizedFiles.length > 0)
      ) {
        onPickerClose?.(); // Close skeleton if no valid images
        return;
      }

      onUpload(validAssets);
      // Don't call onPickerClose here as upload function will handle skeleton
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

    // Trigger skeleton immediately before camera opens
    onPickerOpen?.();

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
      onPickerClose?.(); // Trigger close callback on cancel
    } else if (response.errorCode) {
      console.log('Picker Error:', response.errorMessage);
      onPickerClose?.(); // Trigger close callback on error
    } else if (response.assets) {
      // Check file size for camera images too
      const validAssets = [];
      const oversizedFiles: string[] = [];

      for (const asset of response.assets) {
        // Check file size using the fileSize property from ImagePicker
        if (asset.fileSize) {
          const sizeInMB = asset.fileSize / (1024 * 1024);

          if (sizeInMB > maxFileSize) {
            oversizedFiles.push(
              `${asset.fileName || 'Camera image'} (${sizeInMB.toFixed(1)}MB)`,
            );
            continue;
          }
        }

        validAssets.push(asset);
      }

      if (oversizedFiles.length > 0) {
        Toast.show({
          type: 'warning',
          text1: `Image larger than ${maxFileSize}MB`,
          text2: oversizedFiles.join(', '),
          position: 'bottom',
          visibilityTime: 5000,
        });
      }

      if (validAssets.length === 0 && oversizedFiles.length > 0) {
        onPickerClose?.();
        return;
      }

      const imageUris = validAssets.map(asset => asset.uri);
      console.log('Selected images:', imageUris);
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
