/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// MessageCard.tsx
import CommonHeader from '@components/Header/CommonHeader';
import {Fonts} from '@constants/font';
import {useTheme} from '@theme/ThemeProvider';
import React, {useCallback, useEffect} from 'react';

import {TextInput, IconButton} from 'react-native-paper';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import ChatBubble from './ChatBubble';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute} from '@react-navigation/native';
import useBoundStore from '@stores/index';
import AttachFileModal from './AttachFileModal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {sendChat, uploadImages} from '@api/services';
// import SlideToRecordButton from './AudioRecord';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface MessageCardProps {
  items: any;
}

const MessageCard: React.FC<MessageCardProps> = (props: any) => {
  return <ChatBubble items={props} />;
};

// const chats = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];

const ChatFooter = React.memo(({setAttachModalVisible, handleSend}: any) => {
  const [message, setMessage] = React.useState<any>('');

  return (
    <View style={styles.chatcontainer}>
      <Icon
        name="plus"
        onPress={() => setAttachModalVisible(true)}
        size={20}
        color="#000"
      />
      <TextInput
        mode="outlined"
        placeholder="Say something..."
        value={message}
        onChangeText={setMessage}
        style={styles.input}
        theme={{roundness: 50}}
        outlineColor="#F5F6FA"
        activeOutlineColor="#F5F6FA"
      />
      <IconButton
        icon="send"
        size={18}
        onPress={() => {
          setMessage(null);
          handleSend(message);
        }}
        disabled={!message?.trim()}
        iconColor="#696969"
      />

      {/* <IconButton
        icon="microphone"
        size={20}
        onPress={() => {
          setMessage(null);
          handleSend(message);
        }}
        iconColor="#696969"
      /> */}
    </View>
  );
});

const Chat = React.memo(({navigation}: any) => {
  const {theme} = useTheme();
  const route = useRoute();
  const {
    fetchChatDetails,
    chatDetails,
    chat_hasMore,
    chat_loading,
    updateChat,
    token,
    clientId,
    bearerToken,
    loading,
    resetChatDetails,
  } = useBoundStore();
  const {items}: any = route.params;
  console.log('items', items);
  const [attachModalVisible, setAttachModalVisible] = React.useState(false);
  const [selectedImage, setImage] = React.useState(null);

  useEffect(() => {
    fetchChatDetails(items.propertyId);
  }, [items.propertyId]);

  const renderAdItem = useCallback(
    (items: any) => {
      return <MessageCard items={items} />;
    },
    [navigation],
  );

  useEffect(() => {
    return () => {
      resetChatDetails([]);
    };
  }, []);

  const pickImageLibrary = useCallback(() => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1, // 0 = unlimited
        quality: 0.8,
      },
      (response: any) => {
        if (response.didCancel || response.errorCode) return;
        upLoadImage(response.assets);
      },
    );
  }, []);

  const pickCamera = useCallback(() => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response: any) => {
        if (response.didCancel || response.errorCode) return;
        console.log(response.assets[0].uri);
        upLoadImage(response.assets);
      },
    );
  }, []);

  const upLoadImage = async (Images: any) => {
    try {
      let formData = new FormData();
      Images.map((items: any, index: any) => {
        formData.append('images', {
          uri: items.uri, // local path or blob URL
          name: `photo_${index}.jpg`, // ⬅ server sees this
          type: 'image/jpeg',
        } as any);
      });
      const imageUrls: any = await uploadImages(formData, {
        token: token,
        clientId: clientId,
        bearerToken: bearerToken,
      });
      sendImages(imageUrls);
    } catch (error) {
      return [];
    }
  };

  const sendImages = (imageUrls: any) => {
    const uploadPromises = imageUrls.map((url: string) =>
      sendImageUrlToApi(url),
    );

    return Promise.all(uploadPromises)
      .then(responses => {
        return responses.map(res => res.data); // Extract actual response data
      })
      .catch(error => {
        console.error('Upload error:', error);
        throw error;
      });
  };
  const sendImageUrlToApi = (imageUrl: string): Promise<any> => {
    let payload = {
      roomId: items.propertyId,
      type: 'image',
      body: imageUrl,
      createdAt: new Date().toISOString(),
    };
    updateChat(payload);
    return sendChat(payload, {
      token,
      clientId,
      bearerToken,
    });
  };

  const handleSend = async (message: string) => {
    if (message.trim()) {
      let payload = {
        roomId: items.propertyId,
        type: 'text',
        body: message,
        createdAt: new Date().toISOString(),
      };
      console.log('payload', payload);
      updateChat(payload);
      try {
        const res = await sendChat(payload, {
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
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <CommonHeader title={items.user?.name ?? 'Chats'} textColor="#171717" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{height: Platform.OS === 'ios' ? '85%' : '80%', flex: 1}}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Details', {items: {_id: items.property._id}})
          }
          style={{
            backgroundColor: theme.colors.background,
            paddingLeft: 10,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderWidth: 0.5,
            padding: 10,
          }}>
          <Image
            style={{
              height: 30,
              width: 30,
              marginLeft: 5,
            }}
            source={{
              uri:
                items.property?.coverImage ??
                'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?semt=ais_items_boosted&w=740',
            }}
          />
          <Text numberOfLines={1} style={styles.name}>
            {items.property?.title}
          </Text>
        </TouchableOpacity>
        <FlatList
          inverted
          data={[...chatDetails].reverse()}
          renderItem={renderAdItem}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            backgroundColor: theme.colors.background,
            paddingBottom: 24,
            flexGrow: 1,
            minHeight: '90%',
          }}
          ListHeaderComponent={
            <>
              {loading && (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.activityIndicatorColor}
                />
              )}
            </>
          }
          ListHeaderComponentStyle={{
            padding: 0,
            backgroundColor: '#fff',
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            chat_hasMore || chat_loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={theme.colors.activityIndicatorColor}
                />
                {chat_loading && chatDetails?.length > 0 && (
                  <Text style={styles.loadingText}>
                    Loading more properties...
                  </Text>
                )}
              </View>
            ) : chatDetails.length <= 0 ? (
              <></>
            ) : (
              <></>
            )
          }
        />
        {/* <SlideToRecordButton
          onSend={filePath => {
            console.log('📤 Sending audio file:', filePath);

            // You can now:
            // 1. Upload to server
            // 2. Send in chat message
            // 3. Share or preview
          }}
        /> */}
        {selectedImage && (
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
        )}
        <ChatFooter
          setAttachModalVisible={setAttachModalVisible}
          handleSend={handleSend}
          items={items}
        />
      </KeyboardAvoidingView>

      <AttachFileModal
        visible={attachModalVisible}
        onClose={() => setAttachModalVisible(false)}
        onPickCamera={() => {
          pickCamera(); // your logic
          setAttachModalVisible(false);
        }}
        onPickGallery={() => {
          pickImageLibrary(); // your logic
          setAttachModalVisible(false);
        }}
        onPickDocument={() => {
          // pickDocument(); // your logic
          setAttachModalVisible(false);
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
  chatcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#6A6A6A40',
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
