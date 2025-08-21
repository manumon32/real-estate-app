/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
  Dimensions,
  Linking,
  Share,
} from 'react-native';
import Image from 'react-native-fast-image';
import {Fonts} from '@constants/font';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@theme/ThemeProvider';
import IconButton from '@components/Buttons/IconButton';
import Carousel from 'react-native-reanimated-carousel';
import FavoriteButton from '@components/FavoriteButton';
import ImageViewerModal from '@components/Modal/ImageViewerModal';

function Header(props: any): React.JSX.Element {
  const {details} = props;
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const {width} = Dimensions.get('window');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = useMemo(() => {
    return details?.imageUrls ?? [];
  }, [details]);

  const floorPlans = useMemo(() => {
    return details?.floorPlanUrl ?? [];
  }, [details]);

  const handleImagePress = useCallback(() => {
    setModalVisible(true);
  }, []);

  const shareProperty = (id: string) => {
    const link = `https:/myapp://Details/${id}`;
    Share.share({
      message: `${link}`,
    });
  };

  const renderItem = useCallback(
    ({item}: {item: string; index: number}) => (
      <TouchableOpacity activeOpacity={0.9} onPress={() => handleImagePress()}>
        <Image
          source={{uri: item, cache: Image.cacheControl.immutable}}
          resizeMode="contain"
          style={styles.image}
        />
      </TouchableOpacity>
    ),
    [handleImagePress],
  );

  return (
    <>
      <View style={styles.mainContainer}>
        <View
          style={[
            styles.headerContainer,
            {
              paddingTop: Platform.OS === 'android' ? 10 : 10, // adjust for status bar
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <IconButton
              style={styles.heart}
              iconSize={24}
              //red , heart
              iconColor={theme.colors.text}
              iconName={'arrow-left'}
            />
          </TouchableOpacity>
          <View style={styles.headerIconContainer}>
            <TouchableOpacity
              onPress={() => {
                shareProperty(details._id);
              }}>
              <IconButton
                style={[styles.heartRight]}
                iconSize={24}
                //red , heart
                iconColor={theme.colors.text}
                iconName={'share-variant'}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity>
              <IconButton
                style={[styles.heartRight]}
                iconSize={24}
                //red , heart
                iconColor={theme.colors.text}
                iconName={'heart-outline'}
              />
            </TouchableOpacity> */}
            <FavoriteButton
              IconButtonStyle={styles.heartRight}
              iconSize={24}
              item={details}
            />
          </View>
        </View>
        <Carousel
          loop
          width={width}
          height={360}
          autoPlay={false}
          data={images}
          scrollAnimationDuration={1000}
          onSnapToItem={index => {
            setCurrentIndex(index);
          }}
          renderItem={renderItem}
        />

        <View style={[styles.footerContainer]}>
          {details?.videoUrl && (
            <TouchableOpacity
              onPress={async () => {
                const url = details?.videoUrl; // replace with your video URL

                console.log("Can't open URL:", url);
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                  console.log('open URL:', url);
                  await Linking.openURL(url);
                } else {
                  console.log("Can't open URL:", url);
                }
              }}>
              <View style={[styles.heartBootom]}>
                <View style={styles.iconConainer}>
                  <IconButton
                    // style={}
                    iconSize={24}
                    //red , heart
                    iconColor={'#2F8D79'}
                    iconName={'video-outline'}
                  />
                </View>
                <Text style={styles.icontextStyle}>Video</Text>
              </View>
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.navigate('ThreeDModelViewer', {id: '123'});
            }}>
            <View style={[styles.heartBootom]}>
              <View style={styles.iconConainer}>
                <IconButton
                  // style={}
                  iconSize={24}
                  //red , heart
                  iconColor={'#2F8D79'}
                  iconName={'cube'}
                />
              </View>
              <Text style={styles.icontextStyle}>3D Tour</Text>
            </View>
          </TouchableOpacity> */}
          {floorPlans.length > 0 && (
            <TouchableOpacity onPress={() => setVisible(true)}>
              <View style={[styles.heartBootom]}>
                <View style={styles.iconConainer}>
                  <IconButton
                    // style={}
                    iconSize={24}
                    //red , heart
                    iconColor={'#2F8D79'}
                    iconName={'floor-plan'}
                  />
                </View>
                <Text style={styles.icontextStyle}>Floor Plan</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.paginationContainer}>
          <Text style={{fontSize: 14, fontFamily: Fonts.MEDIUM}}>
            {currentIndex + 1 + '/' + images?.length}
          </Text>
        </View>
      </View>
      {/* <ImageCarouselModal
        visible={modalVisible}
        images={images}
        onClose={() => setModalVisible(false)}
        currentIndex={currentIndex}
      /> */}
      <ImageViewerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        imageUrls={images}
        startIndex={currentIndex}
      />

      <ImageViewerModal
        visible={visible}
        onClose={() => setVisible(false)}
        imageUrls={floorPlans}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height:
      200 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
    backgroundColor: 'transparent',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    margin: 5,
  },
  activeDot: {
    backgroundColor: '#333',
    width: 100,
    height: 10,
  },
  mainContainer: {height: 350, width: '100%'},
  image: {height: 350, width: '100%'},
  heart: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  iconConainer: {
    backgroundColor: '#E3FFF8',
    width: 26,
    height: 26,
    borderRadius: 8,
    marginRight: 2,
  },
  icontextStyle: {
    fontSize: 12,
    fontFamily: Fonts.MEDIUM,
    fontWeight: '500',
  },
  paginationTextStle: {},
  heartBootom: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    height: 32,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartRight: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    width: '102%',
  },

  footerContainer: {
    position: 'absolute',
    bottom: 25,
    right: 5,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    zIndex: 10,
  },

  paginationContainer: {
    position: 'absolute',
    bottom: 28,
    left: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 5,
    height: 39,
    width: 39,
  },

  headerIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationContainer: {
    width: '90%',
    flexDirection: 'row',
  },
  arrowDown: {
    top: 2,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  textStyle: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    marginRight: 5,
  },
  iconStyle: {
    marginRight: 5,
  },
  freshTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    margin: 10,
    marginBottom: 2,
  },
});

export default Header;
