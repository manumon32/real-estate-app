/* eslint-disable react-native/no-inline-styles */
import ImageViewerModal from '@components/Modal/ImageViewerModal';
import PropertyMap from '@components/PropertyMap';
import {Fonts} from '@constants/font';
import useBoundStore from '@stores/index';
import {useTheme} from '@theme/ThemeProvider';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const getTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000); // in seconds

  if (diff < 60) return `Just now`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function ChatBubble(props: any) {
  const {user} = useBoundStore();
  const [visible, setVisible] = useState(false);
  const items = props?.items?.items?.item ?? {};
  let left = !items?.senderId || items?.senderId === user?._id;
  const {theme} = useTheme();
  let locationDetails = [];
  if (items.type === 'location') {
    locationDetails = items?.body?.split(',');
  }

  const openMap = (latitude: any, longitude: any) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${latitude},${longitude}`;
    const label = 'Custom Location';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url!).catch(() => {
      Alert.alert('Error', 'Unable to open the map app.');
    });
  };

  return (
    <>
      <ImageViewerModal
        visible={visible}
        onClose={() => setVisible(false)}
        imageUrls={[items?.body]}
      />
      {!left ? (
        <View style={styles.container}>
          {items?.profilePicture && (
            <Image
              source={{uri: items?.profilePicture}} // Replace with real image
              style={styles.avatar}
            />
          )}
          <View
            style={[
              styles.messageWrapper,
              items.type === 'location' && styles.messageWrapperLocation,
            ]}>
            {/* <Text style={styles.name}>Arnold Schurli</Text> */}

            <View
              style={[
                items.type !== 'location' && styles.bubbleleft,
                {backgroundColor: theme.colors.chatBubbleLeft},
              ]}>
              {items.type == 'image' && (
                <TouchableOpacity onPress={() => setVisible(true)}>
                  <Image
                    source={{
                      uri: items.body,
                    }}
                    style={styles.imageStyle}
                  />
                </TouchableOpacity>
              )}
              {items.type == 'text' && (
                <Text style={styles.messageText}>{items?.body}</Text>
              )}
            </View>

            {items.type === 'location' && (
              // <View style={[styles.bubble]}>
              <TouchableOpacity
                onPress={() => {
                  openMap(locationDetails[0], locationDetails[1]);
                }}>
                <PropertyMap
                  latitude={Number(locationDetails[0])}
                  longitude={Number(locationDetails[1])}
                  height={150} // optional
                  zoomDelta={0.01} // optional
                />
              </TouchableOpacity>
              // </View>
            )}
            <Text style={[styles.timestamp, {color: theme.colors.text}]}>
              {getTimeAgo(new Date(items?.createdAt)?.getTime())}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.containerRight}>
          <View
            style={[
              styles.messageWrapper,
              items.type === 'location' && styles.messageWrapperLocation,
            ]}>
            {items.type == 'image' && (
              <TouchableOpacity
                onPress={async () => {
                  Keyboard.dismiss();
                  setTimeout(() => {
                    setVisible(true);
                  }, 250);
                }}>
                <Image
                  source={{
                    uri: items.body,
                  }}
                  style={styles.imageStyle}
                />
              </TouchableOpacity>
            )}
            {items.type == 'text' && (
              <View style={[styles.bubble]}>
                <Text style={[styles.messageTextRight]}>{items?.body}</Text>
              </View>
            )}
            {items.type === 'location' && (
              // <View style={[styles.bubble]}>
              <TouchableOpacity
                onPress={() => {
                  openMap(locationDetails[0], locationDetails[1]);
                }}>
                <PropertyMap
                  latitude={Number(locationDetails[0])}
                  longitude={Number(locationDetails[1])}
                  height={150} // optional
                  zoomDelta={0.01} // optional
                />
              </TouchableOpacity>
              // </View>
            )}
            <View style={styles.recieveContainer}>
              <MaterialCommunityIcons
                name={items.status === 'sent' ? 'check' : 'check-all'}
                size={16}
                color={items.status === 'read' ? '#307bfc' : theme.colors.text}
                style={{marginRight: 5}}
              />

              <Text
                style={[
                  styles.timestamp,
                  {textAlign: 'right', color: theme.colors.text},
                ]}>
                {getTimeAgo(new Date(items?.createdAt)?.getTime())}
              </Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
    marginHorizontal: 16,
  },
  containerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 5,
    marginHorizontal: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 18,
    marginRight: 10,
    alignSelf: 'center',
  },
  messageWrapper: {
    maxWidth: '80%',
  },

  messageWrapperLocation: {
    width: '60%',
  },
  name: {
    color: '#282A37',
    fontSize: 12,
    marginBottom: 2,
    fontWeight: '500',
    fontFamily: Fonts.REGULAR,
  },
  bubbleleft: {
    backgroundColor: 'rgba(229, 229, 229, 0.55)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  recieveContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bubble: {
    backgroundColor: '#2F8D79',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  messageTextRight: {
    fontSize: 14,
    color: '#fff',
    fontFamily: Fonts.MEDIUM,
  },
  imageStyle: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  messageText: {
    fontSize: 14,
    color: '#171717',
    fontFamily: Fonts.MEDIUM,
  },
  timestamp: {
    fontSize: 11,
    color: '#515978',
    marginTop: 4,
    fontFamily: Fonts.REGULAR,
  },
});
