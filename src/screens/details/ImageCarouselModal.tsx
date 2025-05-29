import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Pressable,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '@theme/ThemeProvider';
import Carousel from 'react-native-reanimated-carousel';
import IconButton from '@components/Buttons/IconButton';

const {width, height} = Dimensions.get('window');

type ImageCarouselModalProps = {
  visible: boolean;
  images: string[];
  onClose: () => void;
};

const ImageCarouselModal: React.FC<ImageCarouselModalProps> = ({
  visible,
  images,
  onClose,
}) => {
  const {theme} = useTheme();
  const carouselConfig = useMemo(
    () => ({
      width,
      height,
      autoPlay: false,
      scrollAnimationDuration: 800,
      mode: 'parallax' as const,
      modeConfig: {
        parallaxScrollingScale: 0.9,
        parallaxScrollingOffset: 50,
      },
    }),
    [],
  );

  const [loadingMap, setLoadingMap] = useState<boolean[]>(
    images.map(() => true),
  );

  const handleLoadStart = useCallback((index: number) => {
    setLoadingMap((prev: any) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  const handleLoadEnd = useCallback((index: number) => {
    setLoadingMap((prev: any) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  }, []);

  // Callback for rendering each image item
  const renderItem = useCallback(
    ({item, index}: {item: string; index: number}) => (
      <>
        {loadingMap[index] && (
          <View
            style={[
              styles.loader,
              {
                flex: 1, // fill the screen
                justifyContent: 'center', // vertical center
                alignItems: 'center', // horizontal center,
                top:200
              },
            ]}>
            <ActivityIndicator
              size="large"
              color="#fff"
              style={styles.loader}
            />
          </View>
        )}
        <Image
          source={{uri: item}}
          resizeMode="contain"
          style={styles.image}
          onLoadStart={() => handleLoadStart(index)}
          onLoadEnd={() => handleLoadEnd(index)}
        />
      </>
    ),
    [handleLoadEnd, handleLoadStart, loadingMap],
  );

  // Callback for closing modal
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal visible={visible} style={styles.modal}>
      <View style={styles.container}>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <IconButton
            iconSize={24}
            //red , heart
            iconColor={theme.colors.text}
            iconName={'close'}
          />
        </Pressable>

        <Carousel {...carouselConfig} data={images} renderItem={renderItem} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // Fullscreen modal
    justifyContent: 'flex-end',
  },
  loader: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
  },
});

export default ImageCarouselModal;
