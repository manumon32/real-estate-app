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
  selectMultiple: () => void;
  handleDelete: () => void;
}

const BottomModal: React.FC<AttachModalProps> = ({
  visible,
  onClose,
  handleDelete,
  selectMultiple,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        {/* <Text style={styles.title}>Attach File</Text> */}

        <TouchableOpacity style={styles.option} onPress={handleDelete}>
          <Icon name="delete" size={24} color="#2F8D79" />
          <Text style={styles.optionText}>Delete Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={selectMultiple}>
          <Icon name="information" size={24} color="#2F8D79" />
          <Text style={styles.optionText}>Delete Multiple Chats</Text>
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

export default BottomModal;
