import React, {useCallback, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import GalleryList from './GalleryList';
import ImagePickerButton from './ImagePickerButton';

type Props = {
  visible: boolean;
  onClose: () => void;
  onImagesSelected: (uris: string[]) => void;
};

const ImagePickerModal: React.FC<Props> = ({
  visible,
  onClose,
  onImagesSelected,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleAssetsPicked = useCallback((assets: any[]) => {
    const uris = assets.map(a => a.uri).filter(Boolean);
    setSelected(prev => Array.from(new Set([...prev, ...uris])));
  }, []);

  const handleGallerySelect = useCallback((photo: any) => {
    const uri = photo?.node?.image?.uri;
    if (!uri) return;
    setSelected(prev => (prev.includes(uri) ? prev : [...prev, uri]));
  }, []);

  const handleDone = useCallback(() => {
    onImagesSelected(selected);
    onClose();
    setSelected([]);
  }, [selected, onImagesSelected, onClose]);

  const handleRemove = (uriToRemove: string) => {
    setSelected(prev => prev.filter(uri => uri !== uriToRemove));
  };

  return (
    <Modal
      statusBarTranslucent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerBtn}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Select Images</Text>
          <TouchableOpacity onPress={handleDone}>
            <Text style={styles.headerBtn}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Library Picker */}
        <View style={styles.pickerRow}>
          <ImagePickerButton
            onPicked={handleAssetsPicked}
            title="Pick from Library"
          />
        </View>

        {/* Selected Images Preview */}
        <FlatList
          data={selected}
          horizontal
          keyExtractor={uri => uri}
          contentContainerStyle={{paddingHorizontal: 10}}
          renderItem={({item}) => (
            <View style={styles.previewImageWrap}>
              <Image source={{uri: item}} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemove(item)}>
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />

        {/* Full Gallery */}
        <GalleryList onSelect={handleGallerySelect} />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  previewImageWrap: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#0009',
    borderRadius: 12,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ImagePickerModal;
