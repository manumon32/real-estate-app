/* eslint-disable react-native/no-inline-styles */
import ImageViewerModal from '@components/Modal/ImageViewerModal';
import {Fonts} from '@constants/font';
import useBoundStore from '@stores/index';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
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
          <View style={styles.messageWrapper}>
            {/* <Text style={styles.name}>Arnold Schurli</Text> */}

            <View style={styles.bubbleleft}>
              {items.type == 'image' && (
                <TouchableOpacity onPress={() => setVisible(true)}>
                  <Image
                    source={{
                      uri:
                        items.body ??
                        'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?semt=ais_items_boosted&w=740',
                    }}
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 20,
                    }}
                  />
                </TouchableOpacity>
              )}
              {items.type == 'text' && (
                <Text style={styles.messageText}>{items?.body}</Text>
              )}
            </View>

            <Text style={styles.timestamp}>
              {getTimeAgo(new Date(items?.createdAt)?.getTime())}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.containerRight}>
          <View style={styles.messageWrapper}>
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
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 20,
                  }}
                />
              </TouchableOpacity>
            )}
            {items.type == 'text' && (
              <View style={[styles.bubble]}>
                <Text style={styles.messageTextRight}>{items?.body}</Text>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name={items.status === 'sent' ? 'check' : 'check-all'}
                size={16}
                color={items.status === 'read' ? 'blue' : '#000'}
                style={{marginRight: 5}}
              />

              <Text style={[styles.timestamp, {textAlign: 'right'}]}>
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
    marginVertical: 12,
    marginHorizontal: 16,
  },
  containerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 12,
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
