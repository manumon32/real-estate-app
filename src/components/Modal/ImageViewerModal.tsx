import React from 'react';
import {Modal, View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageViewer from 'react-native-image-zoom-viewer';

type Props = {
  visible: boolean;
  onClose: () => void;
  imageUrls: string[]; // array of image URLs
  startIndex?: number;
};

const ImageViewerModal: React.FC<Props> = ({
  visible,
  onClose,
  imageUrls,
  startIndex = 0,
}) => {
  const images = imageUrls?.map(url => ({url}));

  return (
    <Modal
      statusBarTranslucent
      visible={visible}
      transparent
      onRequestClose={onClose}>
      <ImageViewer
        imageUrls={images}
        index={startIndex}
        enableSwipeDown
        onSwipeDown={onClose}
        renderHeader={() => (
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <Icon name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
  },
  closeIcon: {
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
});

export default ImageViewerModal;
