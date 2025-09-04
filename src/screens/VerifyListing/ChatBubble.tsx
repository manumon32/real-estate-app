/* eslint-disable react-native/no-inline-styles */
import ImageViewerModal from '@components/Modal/ImageViewerModal';
import {Fonts} from '@constants/font';
import useBoundStore from '@stores/index';
import React, {useState} from 'react';
import {viewDocument} from '@react-native-documents/viewer';
import RNFS from 'react-native-fs';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '@theme/ThemeProvider';

export const getTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000); // in seconds

  if (diff < 60) return `Just now`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

async function openRemoteFile(url: string) {
  try {
    // Get filename from URL
    const filename = url.split('/').pop() || 'file';
    const localPath = `${RNFS.DocumentDirectoryPath}/${filename}`;
    console.log(url);
    // Download to local path
    const exists = await RNFS.exists(localPath);
    if (!exists) {
      await RNFS.downloadFile({
        fromUrl: url,
        toFile: localPath,
      }).promise;
    }

    // Open with viewer (now that it's local)
    await viewDocument({uri: `file://${localPath}`});
  } catch (err) {
    console.error('Failed to open document:', err);
  }
}

export default function ChatBubble(props: any) {
  const {user} = useBoundStore();
  const [visible, setVisible] = useState(false);
  const items = props?.items?.items?.item ?? {};
  let left = !items?.senderId || items?.senderId === user?._id;

  const {theme} = useTheme();
  const isImageUrl = (url: string): boolean => {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
  };
  return (
    <>
      <ImageViewerModal
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        imageUrls={[items.files?.[0]]}
      />
      {!left ? (
        <View style={styles.container}>
          <View style={styles.messageWrapper}>
            {/* <Text style={styles.name}>Arnold Schurli</Text> */}
            <View style={[styles.bubble, {backgroundColor: theme.colors.text}]}>
              <Text
                style={[styles.messageText, {color: theme.colors.background}]}>
                {items?.message}
              </Text>
            </View>

            <Text style={[styles.timestamp, {color: theme.colors.text}]}>
              {getTimeAgo(new Date(items?.createdAt)?.getTime())}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.containerRight}>
          <View style={styles.messageWrapper}>
            <View
              style={[
                styles.bubble,
                {backgroundColor: theme.colors.chatBubbleLeft},
              ]}>
              {items.files?.[0] && (
                <TouchableOpacity
                  onPress={() => {
                    isImageUrl(items.files?.[0])
                      ? setVisible(true)
                      : openRemoteFile(items.files?.[0]).catch(err =>
                          console.error('Failed to view file', err),
                        );
                  }}>
                  {isImageUrl(items.files?.[0]) ? (
                    <Image
                      source={{
                        uri: items.files[0],
                      }}
                      style={{
                        width: 200,
                        height: 200,
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <>
                      <Icon name="file" size={50} color="#e74c3c" />
                      <Text
                        numberOfLines={3}
                        style={[
                          styles.messageText,
                          {
                            width: 120,
                            color: 'blue',
                            textDecorationLine: 'underline',
                          },
                        ]}>
                        {items.files?.[0]}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
              {items?.message && (
                <Text
                  style={[
                    styles.messageText,
                    {color: theme.colors.chatBubbleText},
                  ]}>
                  {items?.message}
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  styles.timestamp,
                  {textAlign: 'right', color: theme.colors.text},
                ]}>
                {items?.createdAt &&
                  getTimeAgo(new Date(items?.createdAt)?.getTime())}
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
  bubble: {
    backgroundColor: 'rgba(229, 229, 229, 0.55)',
    paddingVertical: 8,
    paddingHorizontal: 14,
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
