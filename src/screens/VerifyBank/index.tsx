/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// MessageCard.tsx
import CommonHeader from '@components/Header/CommonHeader';
import {Fonts} from '@constants/font';
import {useTheme} from '@theme/ThemeProvider';
import React, {useCallback} from 'react';
import {TouchableRipple, Surface} from 'react-native-paper';

import {TextInput} from 'react-native-paper';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ChatBubble from './ChatBubble';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import useBoundStore from '@stores/index';
import AttachFileModal from './AttachFileModal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {sendBankDetails, uploadDocuments, uploadImages} from '@api/services';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {pick} from '@react-native-documents/picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {compressImage} from '../../helpers/ImageCompressor';
// import SlideToRecordButton from './AudioRecord';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface MessageCardProps {
  items: any;
}

const MessageCard: React.FC<MessageCardProps> = (props: any) => {
  return <ChatBubble items={props} />;
};

// const chats = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];

const ChatFooter = ({setAttachModalVisible, handleSend}: any) => {
  const [message, setMessage] = React.useState<any>('');
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.chatcontainer,
        {backgroundColor: theme.colors.background},
      ]}>
      <Icon
        name="plus"
        onPress={() => setAttachModalVisible(true)}
        size={28}
        color={theme.colors.text}
      />
      <TextInput
        mode="outlined"
        placeholder="Type Here.."
        value={message}
        onChangeText={setMessage}
        style={[styles.input, {borderWidth: 0.1}]}
        theme={{roundness: 50}}
        outlineColor="#ffffffff"
        activeOutlineColor="#c1c1c1ff"
        keyboardType="web-search"
      />
      <Icon
        name="send"
        size={32}
        onPress={() => {
          setMessage(null);
          handleSend(message);
        }}
        disabled={!message?.trim()}
        color={theme.colors.text}
      />
    </View>
  );
};

const Verification = ({navigation}: any) => {
  const {theme} = useTheme();
  const route = useRoute();
  const {
    fetchBankVerificationDetails,
    bankVerificationDetails,
    resetBankVerificationDetails,
    updateBankVerificationDetails,
    token,
    clientId,
    bearerToken,
    // detailsBackUp,
  } = useBoundStore();
  const {items}: any = route.params;
  const [attachModalVisible, setAttachModalVisible] = React.useState(false);
  const [selectedImage, setImage] = React.useState(null);
  const [imageUploading, setImageUploading] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      items?._id && fetchBankVerificationDetails(items?._id);
      return () => {
        resetBankVerificationDetails();
      };
    }, [items?._id]),
  );

  const renderAdItem = useCallback(
    (items: any) => {
      return <MessageCard items={items} />;
    },
    [navigation],
  );
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
        saveToPhotos: true,
        cameraType: 'back',
        presentationStyle: 'fullScreen',
        // ✅ Important
        includeExtra: true, // provides exif info (orientation, etc.)
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
      setImageUploading(true); // start loader
      let formData = new FormData();
      const processedImages = (
        await Promise.all(
          Images.map(async (img: any) => {
            if (!img?.uri) {
              return null;
            }
            const compressedUri = await compressImage(img.uri);
            return compressedUri ? {...img, uri: compressedUri} : null;
          }),
        )
      ).filter(Boolean);

      if (!processedImages.length) {
        return [];
      }
      processedImages.map((items: any, index: any) => {
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
      sendFIles(imageUrls, true);
    } catch (error) {
      return [];
    } finally {
      setImageUploading(false); // start loader
    }
  };

  const pickDocument = async () => {
    try {
      const results = await pick({
        mode: 'import',
        allowMultiSelection: true,
        types: ['public.pdf'], // UTIs for iOS, MIME types valid for Android
        keepLocalCopy: true,
      });
      upLoadDoc(results);
    } catch (err: any) {
      if (err.isCancel) {
        console.log('User canceled');
      } else {
        console.log(err);
      }
    }
  };

  const upLoadDoc = async (docs: any) => {
    try {setImageUploading(true); // start loader
      let formData = new FormData();
      docs.map((items: any) => {
        formData.append('documents', {
          uri: items.uri,
          name: items.name,
          type: items.type,
        } as any);
      });
      const imageUrls: any = await uploadDocuments(formData, {
        token: token,
        clientId: clientId,
        bearerToken: bearerToken,
      });
      setImageUploading(false);
      sendFIles(imageUrls);
    } catch (error) {
      return [];
    }
  };

  const sendFIles = (imageUrls: any, image = false) => {
    const uploadPromises = imageUrls.map((url: any) =>
      sendImageUrlToApi(image ? url : url.location),
    );

    return Promise.all(uploadPromises)
      .then(responses => {
        return responses.map(res => res); // Extract actual response data
      })
      .catch(error => {
        console.log('Upload error:', error);
        throw error;
      });
  };
  const sendImageUrlToApi = async (imageUrl: string): Promise<any> => {
    let payload = {
      bankVerificationId: items?._id,
      senderType: 'user',
      message: null,
      files: [imageUrl],
      createdAt: new Date().toISOString(),
    };
    updateBankVerificationDetails(payload);
    await sendBankDetails(payload, {
      token,
      clientId,
      bearerToken,
    });

    // return fetchBankVerificationDetails(items?._id);
  };

  const handleSend = async (message: string) => {
    if (message.trim()) {
      let payload = {
        bankVerificationId: items?._id,
        senderType: 'user',
        message: message,
        createdAt: new Date().toISOString(),
      };
      updateBankVerificationDetails(payload);
      try {
        await sendBankDetails(payload, {
          token,
          clientId,
          bearerToken,
        });
        // fetchBankVerificationDetails(items?._id);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <CommonHeader
        title={items?.user?.name ?? 'Loan Offers'}
        textColor="#171717"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{height: Platform.OS === 'ios' ? '85%' : '80%', flex: 1}}>
        <TouchableRipple
          onPress={() => {}}
          rippleColor="rgba(0, 0, 0, .1)"
          style={styles.rippleContainer}>
          <Surface
            style={[
              styles.surface,
              {backgroundColor: theme.colors.background},
            ]}>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name={
                  items?.status === 'verified' ? 'check' : 'clock-alert-outline'
                }
                size={24}
                color={theme.colors.primary}
                style={styles.icon}
              />
              <View style={styles.textWrapper}>
                {items.status === 'verified' && (
                  <Text style={[styles.text, {color: theme.colors.text}]}>
                    This property is eligible for loan from {items.name}.
                  </Text>
                )}
                {(items.status === 'pending' ||
                  items.status === 'pickedup') && (
                  <Text style={[styles.text, {color: theme.colors.text}]}>
                    loan process is in progress, You can still upload any
                    documents you have for it.
                  </Text>
                )}
                {!items.status && (
                  <Text style={[styles.text, {color: theme.colors.text}]}>
                    we will asiign an agent for the further proceedings, You can
                    still upload any documents you have for it.
                  </Text>
                )}
                {items.status === 'rejected' && (
                  <Text style={[styles.text, {color: 'red'}]}>
                    Loan process is Rejected
                  </Text>
                )}
              </View>
              <MaterialCommunityIcons
                name="file-upload-outline"
                size={22}
                color={
                  items?.status === 'verified'
                    ? theme.colors.teal
                    : theme.colors.primary
                }
                style={styles.iconRight}
              />
            </View>
          </Surface>
        </TouchableRipple>
        {
          <FlatList
            inverted
            data={[...bankVerificationDetails].reverse()}
            renderItem={renderAdItem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              backgroundColor: theme.colors.background,
              paddingBottom: 24,
              flexGrow: 1,
              minHeight: '90%',
            }}
            ListHeaderComponentStyle={{
              padding: 0,
              backgroundColor: '#fff',
            }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<></>}
          />
        }
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

        {imageUploading && (
          <View style={{padding: 10, alignItems: 'center'}}>
            <ActivityIndicator size="small" color={theme.colors.text} />
            <Text
              style={{fontSize: 12, color: theme.colors.text, marginTop: 4}}>
              Uploading ...
            </Text>
          </View>
        )}
        {items.status !== 'verified' && (
          <ChatFooter
            setAttachModalVisible={setAttachModalVisible}
            handleSend={handleSend}
            items={items}
          />
        )}
      </KeyboardAvoidingView>

      <AttachFileModal
        visible={attachModalVisible}
        onClose={() => setAttachModalVisible(false)}
        onPickCamera={() => {
          setAttachModalVisible(false);
          setTimeout(() => {
            pickCamera(); // your logic
          }, 100);
        }}
        onPickGallery={() => {
          setAttachModalVisible(false);
          setTimeout(() => {
            pickImageLibrary(); // your logic
          }, 100);
        }}
        onPickDocument={() => {
          setAttachModalVisible(false);
          setTimeout(() => {
            pickDocument(); // your logic
          }, 100);
        }}
      />
    </SafeAreaView>
  );
};

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

  rippleContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  surface: {
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 10,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.REGULAR,
  },
  iconRight: {
    marginLeft: 8,
    marginTop: 2,
  },
});

export default Verification;
