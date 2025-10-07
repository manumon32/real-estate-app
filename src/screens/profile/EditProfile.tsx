/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeader';
import useBoundStore from '@stores/index';
import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  //   FlatList,
  //   Text,
  //   RefreshControl,
} from 'react-native';
import {Fonts} from '@constants/font';
import TextInput from '@components/Input/textInput';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonSuccessModal from '@components/Modal/CommonSuccessModal';
import OtpVerificationScreen from '@components/Modal/OtpVerificationScreen';
import {launchImageLibrary} from 'react-native-image-picker';
import {uploadImages} from '@api/services';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@theme/ThemeProvider';
import {compressImage} from '../../helpers/ImageCompressor';
import Toast from 'react-native-toast-message';
const EditProfile = () => {
  const {
    user,
    updateuser,
    updateLoading,
    updateSuccess,
    fetchUserDetails,
    setUpdateSuccess,
    login,
    otp,
    clearOTP,
    otpLoading,
    loginErrorMessage,
    token,
    clientId,
    bearerToken,
    emailOTPLoading,
    verifyEmailOTP,
    sentEmailOTP,
    sentPhoneOTP,
    verifyPhoneOTP,
    phoneOTPLoading,
  } = useBoundStore();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState<any>(
    require('@assets/images/user-avatar.png'),
  );
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [loginVar, setLoginVar] = useState('');
  const [loginType, setLoginType] = useState('');
  const {theme} = useTheme();

  const navigation = useNavigation();

  React.useEffect(() => {
    if (updateSuccess) {
      setVisible(true);
    }
  }, [updateSuccess]);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserDetails();
    }, []),
  );
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  // const sendOTP = (arg: any, flag: any) => {
  //   setLoginVar(flag);
  //   login({[flag]: arg});
  // };

  const handleSubmit = () => {
    login({[loginVar]: loginVar});
  };

  const veryFyOTP = (arg: any) => {
    if (loginVar === 'email') {
      verifyEmailOTP({
        email: email,
        otp: arg,
      });
    } else {
      verifyPhoneOTP({
        phone: phoneNumber,
        otp: arg,
      });

      // let updateVar =
      //   loginVar == 'email'
      //     ? {name: 'newEmail', val: email}
      //     : {name: 'newPhone', val: phoneNumber};
      // updateCOntact({[updateVar.name]: updateVar.val, otp: arg});
    }
  };
  const pick = useCallback(() => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1, // 0 = unlimited
        quality: 0.8,
      },
      (response: any) => {
        if (response.didCancel || response.errorCode) return;
        setImage(response.assets[0]);
      },
    );
  }, []);

  const updateData = async () => {
    var imageUrls: any = '';
    try {
      if (image.uri) {
        setLoading(true);
        let formData = new FormData();
        const sizeInMB = image?.fileSize ? image.fileSize / (1024 * 1024) : 0;
        if (sizeInMB > 30) {
          Toast.show({
            type: 'warning',
            text1: 'Images larger than 30 MB cannot be uploaded.',
            position: 'bottom',
          });
          return;
        } else {
          const compressedUri = await compressImage(image.uri);
          formData.append('images', {
            uri: compressedUri, // local path or blob URL
            name: `photo_.jpg`, // ⬅ server sees this
            type: 'image/jpeg',
          } as any);
          imageUrls = await uploadImages(formData, {
            token: token,
            clientId: clientId,
            bearerToken: bearerToken,
          });
        }
      }
      let payload: any = {
        name: name,
      };
      if (imageUrls?.length > 0) {
        payload.profilePicture = imageUrls[0];
      }
      setLoading(false);
      updateuser(payload);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {!otp && (
        <>
          <CommonHeader
            // title="Edit Profile"
            textColor="#171717"
            backgroundColor="#fff"
            rightButton
            rightButtonText="Save"
            onRightPress={async () => {
              updateData();
            }}
            rightButtonLoading={updateLoading || loading}
            rightButtonDisabled={
              !(name !== user.name || image !== user.profilePicture)
            }
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <View style={{flex: 1}}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={{
                  // paddingBottom: 120,
                  backgroundColor: theme.colors.background,
                  padding: 16,
                  // height: '100%',
                  // paddingBottom: 24,
                  flexGrow: 1,
                }}>
                <Text
                  style={[
                    styles.label,
                    {fontSize: 18, color: theme.colors.text},
                  ]}>
                  Basic Informations
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}>
                  <TouchableOpacity style={{width: '30%'}} onPress={pick}>
                    <Image
                      style={{
                        height: 100,
                        width: 100,
                        borderRadius: 50,
                      }}
                      source={{
                        uri: image.uri ? image.uri : image,
                      }}
                    />
                    <View
                      style={[
                        styles.badge,
                        {
                          borderRadius: 20,
                          // left: -110,
                          bottom: 28,
                          justifyContent: 'center',
                          alignItems: 'center',
                          zIndex: 10,
                        },
                      ]}>
                      <View
                        style={{
                          backgroundColor: '#000',
                          padding: 8,
                          borderRadius: 10,
                        }}>
                        <MaterialCommunityIcons
                          name="camera"
                          size={14}
                          color="#fff"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={[styles.inputContainer, {width: '70%'}]}>
                    <Text style={styles.label}>Full Name</Text>
                    {/* <TextInput onChangeText={() => {}} placeholder="Property Title" /> */}
                    <TextInput
                      placeholder="Name"
                      value={name}
                      onChangeText={text => {
                        setName(text);
                      }}
                      // onBlur={handleBlur('title')}
                      // error={touched?.title && errors?.title ? true : false}
                    />
                  </View>
                </View>

                <Text
                  style={[
                    styles.label,
                    {fontSize: 18, color: theme.colors.text},
                  ]}>
                  Contact Informations
                </Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  {/* <TextInput onChangeText={() => {}} placeholder="Property Title" /> */}
                  <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => {
                      setEmail(text);
                    }}
                    // onBlur={handleBlur('title')}
                    // error={touched?.title && errors?.title ? true : false}
                  />
                </View>
                {isValidEmail(email) &&
                ((email && email !== user?.email) || !user.isEmailVerified) ? (
                  <TouchableOpacity
                    onPress={() => {
                      setLoginVar('email');
                      setLoginType(email);
                      sentEmailOTP({
                        email: email,
                      });
                    }}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      width: 100,
                    }}>
                    {/* <MaterialCommunityIcons name="timer" size={18} color="green" /> */}
                    {emailOTPLoading && <ActivityIndicator size={'small'} />}
                    {!emailOTPLoading && (
                      <Text
                        style={{
                          color: 'green',
                          fontSize: 12,
                          textDecorationLine: 'underline',
                          cursor: 'pointer',
                        }}>
                        Verify Email
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  email && (
                    <TouchableOpacity
                    // onPress={() => {
                    //   setLoginVar('email');
                    //   setLoginType(email);
                    //   sentEmailOTP({
                    //     email: email,
                    //   });
                    // }}
                    >
                      <Text
                        style={{
                          color: 'green',
                          fontSize: 12,
                          textDecorationLine: 'underline',
                          cursor: 'pointer',
                          marginLeft: 15,
                        }}>
                        Verified
                      </Text>
                    </TouchableOpacity>
                  )
                )}
                <View style={[styles.inputContainer]}>
                  <Text style={styles.label}>Phone Number</Text>
                  {/* <TextInput onChangeText={() => {}} placeholder="Property Title" /> */}
                  <TextInput
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={text => {
                      setPhoneNumber(text);
                    }}
                    // onBlur={handleBlur('title')}
                    // error={touched?.title && errors?.title ? true : false}
                  />
                </View>
                {isValidPhone(phoneNumber) &&
                ((phoneNumber && phoneNumber !== user?.phone) ||
                  !user.isPhoneVerified) ? (
                  <TouchableOpacity
                    onPress={() => {
                      setLoginVar('phone');
                      setLoginType(phoneNumber);
                      sentPhoneOTP({
                        phone: phoneNumber,
                      });
                    }}
                    style={{
                      width: 150,
                      marginLeft: 15,
                    }}>
                    {/* <MaterialCommunityIcons name="timer" size={18} color="green" /> */}
                    {phoneOTPLoading && <ActivityIndicator size={'small'} />}
                    {!phoneOTPLoading && (
                      <Text
                        style={{
                          color: 'green',
                          fontSize: 12,
                          textDecorationLine: 'underline',
                          cursor: 'pointer',
                        }}>
                        Verify Phone
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  phoneNumber && (
                    <Text
                      style={{
                        color: 'green',
                        fontSize: 12,
                        textDecorationLine: 'underline',
                        cursor: 'pointer',
                        marginLeft: 15,
                      }}>
                      Verified
                    </Text>
                  )
                )}
              </ScrollView>
              <View style={{padding: 12}}>
                {/* <TouchableOpacity
                  onPress={async () => {
                    var imageUrls: any = '';
                    if (image.uri) {
                      let formData = new FormData();
                      formData.append('images', {
                        uri: image.uri, // local path or blob URL
                        name: `photo_.jpg`, // ⬅ server sees this
                        type: 'image/jpeg',
                      } as any);
                      imageUrls = await uploadImages(formData, {
                        token: token,
                        clientId: clientId,
                        bearerToken: bearerToken,
                      });
                    }
                    let payload: any = {
                      name: name,
                    };
                    if (imageUrls?.length > 0) {
                      payload.profilePicture = imageUrls[0];
                    }
                    updateuser(payload);
                  }}
                  style={styles.buyButton}
                  accessibilityRole="button">
                  {!updateLoading && (
                    <Text style={styles.buyText}>{'Save'}</Text>
                  )}
                  {updateLoading && (
                    <ActivityIndicator color={'#fff'} size={'small'} />
                  )}
                </TouchableOpacity> */}
              </View>
            </View>
          </KeyboardAvoidingView>
          <CommonSuccessModal
            visible={visible}
            title="Success."
            message="Profile Updated Successfully."
            onClose={() => {
              setVisible(false);
              setUpdateSuccess();
              navigation.goBack();
            }}
          />
        </>
      )}

      {otp && (
        <OtpVerificationScreen
          clearOTP={clearOTP}
          loginVar={loginType}
          handleSubmit={handleSubmit}
          veryFyOTP={veryFyOTP}
          otpValue={otp}
          loginErrorMessage={loginErrorMessage}
          otpLoading={otpLoading}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buyButton: {
    backgroundColor: '#2f8f72',
    alignItems: 'center',
    borderRadius: 16,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    bottom: 15,
  },
  buyText: {
    color: '#fff',
    fontSize: 16,
  },
  container: {
    height: '100%',
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    flex: 1,
  },
  badge: {
    // backgroundColor: '#e0f5ec',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    color: '#15937c',
    fontWeight: '600',
  },
  location: {
    fontSize: 13,
    color: '#888',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e1e1e',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  outlinedButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },

  endText: {
    textAlign: 'center',
    color: '#888',
    padding: 12,
    fontStyle: 'italic',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: Fonts.MEDIUM,
  },
  loadingText: {
    marginTop: 8,
    color: '#555',
    fontSize: 14,
  },

  inputContainer: {
    padding: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
    marginBottom: 10,
  },
});

export default React.memo(EditProfile);
