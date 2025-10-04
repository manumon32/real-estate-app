/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
  Dimensions,
  Linking,
} from 'react-native';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import Image from 'react-native-fast-image';
import {Fonts} from '@constants/font';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@theme/ThemeProvider';
import IconButton from '@components/Buttons/IconButton';
import Carousel from 'react-native-reanimated-carousel';
import FavoriteButton from '@components/FavoriteButton';
import ImageViewerModal from '@components/Modal/ImageViewerModal';
import useBoundStore from '@stores/index';
import FastImage from 'react-native-fast-image';
function Header(props: any): React.JSX.Element {
  const {details} = props;
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {user, detailLoading} = useBoundStore();
  const [visible, setVisible] = useState(false);
  const {width} = Dimensions.get('window');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImagePress = useCallback(() => {
    setModalVisible(true);
  }, []);

  const shareProperty = async (details: any) => {
    try {
      const link = `https://hotplotz.com/details/${details._id}`;
      const message = `I found this on Hotplotz: ${details.title}\n\nCheck out this property 👇\n${link}`;

      let imagePath: string | undefined;

      if (details?.imageUrls?.[0]) {
        // ✅ Save into cache dir, not app-private dir
        const destPath = `${
          RNFS.CachesDirectoryPath
        }/hotplotz_${Date.now()}.jpg`;

        const download = await RNFS.downloadFile({
          fromUrl: details.imageUrls[0],
          toFile: destPath,
        }).promise;

        if (download.statusCode === 200) {
          imagePath = `file://${destPath}`;
        }
      }

      const shareOptions: any = {
        title: 'Hotplotz',
        message,
        failOnCancel: false,
      };

      if (imagePath) {
        shareOptions.urls = [imagePath]; // ✅ use array
        shareOptions.type = 'image/jpeg';
      }

      console.log('Final shareOptions =>', shareOptions);

      await Share.open(shareOptions);
    } catch (error) {
      console.log('Share Error =>', error);
    }
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

  useEffect(() => {
    // preload property images
    if (details?.images?.length > 0) {
      FastImage.preload(
        details?.images.map((url: any) => ({
          uri: url,
          priority: FastImage.priority.high,
        })),
      );
    }

    // preload floor plan images
    if (details?.floorPlanUrl?.length > 0) {
      FastImage.preload(
        details?.floorPlanUrl.map((url: any) => ({
          uri: url,
          priority: FastImage.priority.high,
        })),
      );
    }
  }, [details]);

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
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                // @ts-ignore
                navigation.navigate('Main');
              }
            }}>
            <IconButton
              style={[styles.heart, {backgroundColor: theme.colors.background}]}
              iconSize={24}
              //red , heart
              iconColor={theme.colors.text}
              iconName={'arrow-left'}
            />
          </TouchableOpacity>
          <View style={styles.headerIconContainer}>
            {details?.adStatus !== 'sold' && (
              <TouchableOpacity
                onPress={() => {
                  shareProperty(details);
                }}>
                <IconButton
                  style={[
                    styles.heartRight,
                    {backgroundColor: theme.colors.background},
                  ]}
                  iconSize={24}
                  //red , heart
                  iconColor={theme.colors.text}
                  iconName={'share-variant'}
                />
              </TouchableOpacity>
            )}
            {/* <TouchableOpacity>
              <IconButton
                style={[styles.heartRight]}
                iconSize={24}
                //red , heart
                iconColor={theme.colors.text}
                iconName={'heart-outline'}
              />
            </TouchableOpacity> */}
            {!detailLoading &&
              (user?._id !== details?.customerId?._id || !user?._id) && (
                <FavoriteButton
                  IconButtonStyle={styles.heartRight}
                  iconSize={24}
                  item={details}
                />
              )}
          </View>
        </View>
        <Carousel
          loop
          width={width}
          height={360}
          autoPlay={false}
          data={details?.imageUrls}
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
          {details?.floorPlanUrl?.length > 0 && (
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
            {currentIndex + 1 + '/' + details?.imageUrls?.length}
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
        imageUrls={details?.imageUrls ? details?.imageUrls : []}
        startIndex={currentIndex}
      />

      <ImageViewerModal
        visible={visible}
        onClose={() => setVisible(false)}
        imageUrls={details?.floorPlanUrl ? details?.floorPlanUrl : []}
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
