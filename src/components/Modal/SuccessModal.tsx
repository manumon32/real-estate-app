import React, {useMemo, useCallback} from 'react';
import {Modal, View, Text, StyleSheet, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
// @ts-ignore
import CongratsIcon from '@assets/svg/new/congrats.svg';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  iconName?: string;
  iconColor?: string;
  buttonText?: string;
};

const SuccessModal: React.FC<Props> = ({
  visible,
  onClose,
  title = 'Congratulations !',
  message = 'Your listing will go live after the review.',
  buttonText = 'Go to My Ads',
}) => {
  const insets = useSafeAreaInsets();

  const renderIcon = useMemo(
    () => (
      <View style={styles.iconWrapper}>
        <CongratsIcon />
      </View>
    ),
    [],
  );

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="slide"
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View
          style={[styles.modalContainer, {paddingBottom: insets.bottom + 24}]}>
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
    // justifyContent: 'center',
    alignItems: 'center',
    // padding: 24,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    height: '94%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  iconWrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    marginBottom:15,
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
    marginTop: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SuccessModal;
