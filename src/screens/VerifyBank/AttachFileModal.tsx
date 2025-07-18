import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AttachModalProps {
  visible: boolean;
  onClose: () => void;
  onPickCamera: () => void;
  onPickGallery: () => void;
  onPickDocument: () => void;
}

const AttachFileModal: React.FC<AttachModalProps> = ({
  visible,
  onClose,
  onPickCamera,
  onPickGallery,
  onPickDocument,
}) => {
  return (
    <Modal
      statusBarTranslucent
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        <Text style={styles.title}>Attach File</Text>

        <TouchableOpacity style={styles.option} onPress={onPickCamera}>
          <Icon name="camera" size={24} color="#2F8D79" />
          <Text style={styles.optionText}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={onPickGallery}>
          <Icon name="image" size={24} color="#2F8D79" />
          <Text style={styles.optionText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={onPickDocument}>
          <Icon name="file-document" size={24} color="#2F8D79" />
          <Text style={styles.optionText}>Document</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000055',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#131313',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#333',
  },
});

export default AttachFileModal;
