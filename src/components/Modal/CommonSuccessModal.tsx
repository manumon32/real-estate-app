import React, { useMemo, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  iconName?: string;
  iconColor?: string;
  buttonText?: string;
};

const CommonSuccessModal: React.FC<Props> = ({
  visible,
  onClose,
  title = 'Your listing is live!',
  message = 'You’ve successfully uploaded your property.',
  iconName = 'check-circle-outline',
  iconColor = '#00C851',
  buttonText = 'Done',
}) => {
  const insets = useSafeAreaInsets();

  const renderIcon = useMemo(() => (
    <View style={styles.iconWrapper}>
      <Icon name={iconName} size={48} color={iconColor} />
    </View>
  ), [iconName, iconColor]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { paddingBottom: insets.bottom + 24 }]}>
          {renderIcon}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <Pressable onPress={handleClose} style={styles.button}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    width: '100%',
    maxWidth: 320,
  },
  iconWrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#269669',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CommonSuccessModal;
