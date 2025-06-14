import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';

interface CommonImageUploaderProps {
  onUpload: (uri: any) => void;
  label:string
}

const CommonImageUploader: React.FC<CommonImageUploaderProps> = ({
  onUpload,
  label
}) => {
  const handlePickImage = async () => {
    const response = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: 10,
    });
    if (response.didCancel) {
      console.log('User cancelled');
    } else if (response.errorCode) {
      console.error('Picker Error:', response.errorMessage);
    } else if (response.assets) {
      const imageUris = response.assets.map(asset => asset.uri);
      console.log('Selected images:', imageUris);
      onUpload(response.assets);
      // Use array of URIs as needed
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePickImage}>
      <MaterialCommunityIcons
        name="cloud-upload-outline"
        size={40}
        color="#219E93"
      />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
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
