/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// MessageCard.tsx
import CommonHeader from '@components/Header/CommonHeader';
import {Fonts} from '@constants/font';
import {useTheme} from '@theme/ThemeProvider';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import uuid from 'react-native-uuid';
import {TextInput} from 'react-native-paper';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  // ActivityIndicator,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ChatBubble from './ChatBubble';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute} from '@react-navigation/native';
import useBoundStore from '@stores/index';
import AttachFileModal from './AttachFileModal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {reportUser, sendChat, uploadImages} from '@api/services';
import {SafeAreaView} from 'react-native-safe-area-context';
import ChatDetailSkeleton from '@components/SkeltonLoader/ChatDetailSkeleton';
import ReportUserModal from './ReportUserModal';
import Toast from 'react-native-toast-message';
import {checkImageValidation} from '../../helpers/ImageCompressor';
import ChatMessageSuggestions from './ChatMessageSuggestions';
import {
  requestCameraPermission,
  requestImageLibraryPermission,
} from '../../helpers/CommonHelper';

// import SlideToRecordButton from './AudioRecord';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface MessageCardProps {
  items: any;
}

const MessageCard: React.FC<MessageCardProps> = (props: any) => {
  return <ChatBubble items={props} />;
};

const ChatFooter = React.memo(
  ({
    theme,
    setAttachModalVisible,
    handleSend,
    items,
    imageUploading,
    user,
  }: any) => {
    console.log('items', items);
    const [message, setMessage] = React.useState<any>('');
    // @ts-ignore
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
      const timeout = setTimeout(() => {
        // inputRef.current?.focus(); //
      }, 300); // Delay ensures UI is ready

      return () => clearTimeout(timeout);
    }, []);
    const isActive = items.property?.adStatus === 'active';

    const suggestions = [
      'Is this still available?',
      'I’m interested, can you share more details?',
      'When can I visit?',
      'Can you lower the price?',
    ];

    return (
      <View
        style={{
          backgroundColor: '#fff',
          borderTopWidth: 0.5,
          borderTopColor: '#6A6A6A40',
        }}>
        {user?._id !== items.property?.customerId && (
          <ChatMessageSuggestions
            suggestions={suggestions}
            onSelectSuggestion={text => {
              handleSend(text);
            }}
          />
        )}
        <View
          style={[
            styles.chatcontainer,
            {backgroundColor: theme.colors.background},
          ]}>
          {!isActive && (
            <Text style={styles.disabledtext}>
              This ad is disabled by the owner.
            </Text>
          )}
          {isActive && (
            <>
              <TouchableOpacity
                onPress={() =>
                  !imageUploading?.[items.propertyId] &&
                  setAttachModalVisible(true)
                }>
                <Icon
                  name="plus"
                  onPress={() =>
                    !imageUploading?.[items.propertyId] &&
                    setAttachModalVisible(true)
                  }
                  size={28}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              <TextInput
                ref={inputRef}
                mode="outlined"
                placeholder="Say something..."
                value={message}
                onChangeText={setMessage}
                style={[styles.input]}
                theme={{roundness: 50}}
                outlineColor="#F5F6FA"
                activeOutlineColor="#c1c1c1ff"
              />
              <TouchableOpacity
                onPress={() => {
                  if (message?.trim()) {
                    setMessage(null);
                    handleSend(message);
                  }
                }}>
                <Icon
                  name="send"
                  size={30}
                  disabled={!message?.trim()}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  },
);

const Addetails = React.memo(({theme, navigation, items}: any) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Details', {items: {_id: items.property._id}})
      }
      style={[styles.adContainer, {backgroundColor: theme.colors.background}]}>
      {items.property?.coverImage && (
        <Image
          style={styles.adImage}
          source={{
            uri: items.property?.coverImage,
          }}
        />
      )}
      <Text numberOfLines={1} style={[styles.name, {color: theme.colors.text}]}>
        {items.property?.title}
      </Text>
    </TouchableOpacity>
  );
});

const UploadImage = React.memo(({theme}: any) => {
  return (
    <View style={styles.uploadImageStyle}>
      <ActivityIndicator size="small" color={theme.colors.text} />
      <Text style={[styles.uploadImageText, {color: theme.colors.text}]}>
        Sending images...
      </Text>
    </View>
  );
});

const LoadImage = React.memo(({selectedImage, setImage}: any) => {
  return (
    <View style={styles.imagePreviewContainer}>
      {/* @ts-ignore */}
      <Image source={{uri: selectedImage?.uri}} style={styles.image} />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          setImage(null);
        }}>
        <Icon name="close-circle" size={20} color="#ff3333" />
      </TouchableOpacity>
    </View>
  );
});

const Chat = React.memo(({navigation}: any) => {
  const {theme} = useTheme();
  const route = useRoute();
  const {
    fetchChatListings,
    fetchChatDetails,
    chatDetails,
    chat_loading,
    updateChat,
    token,
    clientId,
    bearerToken,
    onlineUsers,
    updateChatUnreadCount,
    user,
    imageUploading,
    setImageUploading,
  } = useBoundStore();
  const {items}: any = route.params;
  const [attachModalVisible, setAttachModalVisible] = useState(false);
  const [selectedImage, setImage] = useState(null);
  const [isReportVisible, setIsReportVisible] = useState(false);
  // const [imageUploading, setImageUploading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchChatDetails(items.propertyId);
    updateChatUnreadCount(items.propertyId, 0);
  }, [items.propertyId]);

  const handleLocationSelected = (location: {mapLink: any}) => {
    handleSendLocation(location.mapLink);
  };

  const renderAdItem = useCallback(
    (items: any) => {
      return <MessageCard items={items} />;
    },
    [navigation],
  );

  const pickImageLibrary = useCallback(async () => {
    const hasPermission = await requestImageLibraryPermission();
    if (!hasPermission) {
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 10, // 0 = unlimited
        quality: 0.8,
      },
      (response: any) => {
        if (response.didCancel || response.errorCode) {
          return;
        }
        upLoadImage(response.assets);
      },
    );
  }, []);

  const pickCamera = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return;
    }
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
        cameraType: 'back',
        presentationStyle: 'fullScreen',
        // ✅ Important
        includeExtra: true, // provides exif info (orientation, etc.)
      },
      (response: any) => {
        if (response.didCancel || response.errorCode) {
          return;
        }
        console.log(response.assets[0].uri);
        upLoadImage(response.assets);
      },
    );
  }, []);
  const upLoadImage = async (images: any) => {
    if (!images?.length) {
      return [];
    }

    setImageUploading({[items.propertyId]: true}); // start loader

    try {
      const processedImages = await checkImageValidation(images);

      if (!processedImages.length) {
        return [];
      }

      // Prepare and upload inside Promise.all
      const uploadedUrls = await Promise.allSettled(
        processedImages.map(async (img, index) => {
          const formData = new FormData();
          formData.append('images', {
            uri: img.uri,
            name: img.name || `photo_${index}.jpg`,
            type: img.type || 'image/jpeg',
          } as any);

          // Upload to server
          const newUploadedUrls = await uploadImages(formData, {
            token,
            clientId,
            bearerToken,
          });

          // Call callback or handler with uploaded URLs
          sendImages(newUploadedUrls);
          return newUploadedUrls;
        }),
      );

      return uploadedUrls;
    } catch (error) {
      console.log('Upload error:', error);
      return [];
    } finally {
      setImageUploading({[items.propertyId]: false}); // stop loader
    }
  };

  const sendImages = (imageUrls: any) => {
    const uploadPromises = imageUrls.map((url: string) =>
      sendImageUrlToApi(url),
    );

    return Promise.allSettled(uploadPromises)
      .then(responses => {
        fetchChatDetails(items.propertyId);
        fetchChatListings();
        return responses.map(res => res); // Extract actual response data
      })
      .catch(error => {
        console.error('Upload error:', error);
        throw error;
      });
  };

  const sendImageUrlToApi = (imageUrl: string): Promise<any> => {
    let payload = {
      roomId: items.propertyId,
      status: 'sent',
      type: 'image',
      body: imageUrl,
      createdAt: new Date().toISOString(),
      messageId: uuid.v4(),
    };
    updateChat(payload);
    return sendChat(payload, {
      token,
      clientId,
      bearerToken,
    });
  };
  const handleSendLocation = async (message: string) => {
    let payload = {
      roomId: items.propertyId,
      type: 'location',
      status: 'sent',
      // @ts-ignore
      body: message?.join(),
      createdAt: new Date().toISOString(),
      messageId: uuid.v4(),
    };
    updateChat(payload);
    try {
      const res = sendChat(payload, {
        token,
        clientId,
        bearerToken,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = async (message: string) => {
    if (message.trim()) {
      let payload = {
        roomId: items.propertyId,
        type: 'text',
        status: 'sent',
        body: message,
        createdAt: new Date().toISOString(),
        messageId: uuid.v4(),
      };
      updateChat(payload);
      try {
        const res = sendChat(payload, {
          token,
          clientId,
          bearerToken,
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const reportUsers = async (data: any) => {
    const uploadParams = {token, clientId, bearerToken};
    try {
      let payload = {
        reportedBy: user._id,
        reportedUser: items.user._id,
        status: 'pending',
        ...data,
      };
      await reportUser(payload, uploadParams);
      Toast.show({
        type: 'success',
        text1: 'Reported sucessfully',
        position: 'bottom',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        position: 'bottom',
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <CommonHeader
        onlineStatus={onlineUsers.includes(items.user?._id)}
        title={items.user?.name ?? 'Chats'}
        textColor="#171717"
        rightIcon="flag-outline"
        onRightPress={() => {
          setIsReportVisible(true);
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={styles.keybordViewcontainer}>
        {/* Ads Details  */}
        <Addetails theme={theme} navigation={navigation} items={items} />

        {/* @ts-ignore */}
        {chat_loading && !chatDetails?.[items.propertyId] && (
          <ChatDetailSkeleton />
        )}

        <FlatList
          inverted
          ref={flatListRef}
          data={
            // @ts-ignore
            chatDetails[items.propertyId]
              ? // @ts-ignore
                [...chatDetails[items.propertyId]].reverse()
              : []
          }
          renderItem={renderAdItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.flatListContainer,
            {
              backgroundColor: theme.colors.background,
              minHeight: chat_loading ? 0 : '90%',
            },
          ]}
          showsVerticalScrollIndicator={false}
        />

        {selectedImage && (
          <LoadImage selectedImage={selectedImage} setImage={setImage} />
        )}

        {imageUploading?.[items.propertyId] === true && (
          <UploadImage theme={theme} />
        )}

        <ChatFooter
          setAttachModalVisible={setAttachModalVisible}
          handleSend={handleSend}
          items={items}
          theme={theme}
          imageUploading={imageUploading}
          user={user}
        />
      </KeyboardAvoidingView>

      <AttachFileModal
        visible={attachModalVisible}
        onClose={() => setAttachModalVisible(false)}
        onPickGallery={() => {
          setAttachModalVisible(false);
          setTimeout(() => pickImageLibrary(), 100); // 👈 delay closing
        }}
        onPickCamera={() => {
          setAttachModalVisible(false);
          setTimeout(() => pickCamera(), 200);
        }}
        onPickDocument={() => {
          setAttachModalVisible(false);
        }}
        onShareLocation={() => {
          setAttachModalVisible(false);
          setTimeout(
            () =>
              navigation.navigate('MapPickerScreen', {
                items,
                onLocationSelected: handleLocationSelected,
              }),
            200,
          );
        }}
      />

      <ReportUserModal
        visible={isReportVisible}
        onClose={() => setIsReportVisible(false)}
        onSubmit={(payload: any) => {
          setIsReportVisible(false);
          reportUsers(payload);
        }}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    position: 'relative',
  },
  keybordViewcontainer: {
    height: Platform.OS === 'ios' ? '85%' : '80%',
    flex: 1,
  },
  adContainer: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopWidth: 0.2,
    borderBottomWidth: 0.8,
    borderColor: '#ccc',
    padding: 10,
  },
  adImage: {
    height: 30,
    width: 30,
    marginLeft: 5,
  },
  uploadImageStyle: {padding: 10, alignItems: 'center'},
  flatListContainer: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  uploadImageText: {fontSize: 12, marginTop: 4},
  chatcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  disabledtext: {
    color: 'red',
    fontFamily: Fonts.BOLD,
    textAlign: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#F5F6FA',
    paddingVertical: 1,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    fontWeight: '600',
    fontSize: 12,
    color: '#131313',
    fontFamily: Fonts.BOLD,
    marginLeft: 5,
    maxWidth: '90%',
  },
  time: {
    fontSize: 12,
    color: '#2F8D79',
  },
  message: {
    color: '#131313',
    fontSize: 13,
    fontFamily: Fonts.MEDIUM,
    width: '90%',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#555',
    fontSize: 14,
  },
  badge: {
    backgroundColor: '#2a9d8f',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -20,
    top: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  endText: {
    textAlign: 'center',
    color: '#888',
    padding: 12,
    fontStyle: 'italic',
    // top: -40,
    fontFamily: Fonts.MEDIUM_ITALIC,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 8,
    width: 100,
    height: 100,
    margin: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});

export default Chat;
