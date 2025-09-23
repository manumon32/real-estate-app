/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeader';
import useBoundStore from '@stores/index';
import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  //   FlatList,
  //   Text,
  //   RefreshControl,
} from 'react-native';
import {Fonts} from '@constants/font';
import TextInput from '@components/Input/textInput';
import {useNavigation} from '@react-navigation/native';
import CommonSuccessModal from '@components/Modal/CommonSuccessModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@theme/ThemeProvider';
import ContactUsCard from './ContactUsCard';
const HelpSupport = () => {
  const {
    user,
    updateLoading,
    updateSuccess,
    setUpdateSuccess,
    otp,
    submitRequest,
  } = useBoundStore();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [description, setDescription] = useState('');
  const {theme} = useTheme();

  const navigation = useNavigation();

  React.useEffect(() => {
    if (updateSuccess) {
      setVisible(true);
    }
  }, [updateSuccess]);

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {!otp && (
        <>
          <CommonHeader
            title="Help & Support"
            textColor="#171717"
            backgroundColor="#fff"
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
                  backgroundColor: theme.colors.background,
                  padding: 16,
                  // height: '100%',
                  flexGrow: 1,
                }}>
                <ContactUsCard />
                <View style={styles.requestContainer}>
                  <Text
                    style={{
                      fontFamily: Fonts.MEDIUM,
                      fontSize: 18,
                      color: theme.colors.text,
                    }}>
                    Submit a Request
                  </Text>
                  <View style={styles.inputContainer}>
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
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email*</Text>
                    {/* <TextInput onChangeText={() => {}} placeholder="Property Title" /> */}
                    <TextInput
                      placeholder="Email"
                      value={email}
                      editable={!user?.email}
                      onChangeText={text => {
                        setEmail(text);
                      }}
                      onFocus={() => {}}
                      // onBlur={handleBlur('title')}
                      // error={touched?.title && errors?.title ? true : false}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone Number</Text>
                    {/* <TextInput onChangeText={() => {}} placeholder="Property Title" /> */}
                    <TextInput
                      placeholder="Phone"
                      value={phoneNumber}
                      editable={!user?.phone}
                      onChangeText={text => {
                        setPhoneNumber(text);
                      }}
                      // onBlur={handleBlur('title')}
                      // error={touched?.title && errors?.title ? true : false}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description*</Text>
                    {/* <TextInput onChangeText={() => {}} placeholder="Property Title" /> */}
                    <TextInput
                      placeholder="Description"
                      multiline
                      value={description}
                      onChangeText={text => {
                        setDescription(text);
                      }}
                      style={{minHeight: 100, justifyContent: 'center'}}
                      // onBlur={handleBlur('title')}
                      // error={touched?.title && errors?.title ? true : false}
                    />
                  </View>

                  <View style={{padding: 12, top: 10}}>
                    <TouchableOpacity
                      onPress={() => {
                        if (name && email && phoneNumber && description) {
                          if (
                            isValidEmail(email) ||
                            isValidPhone(phoneNumber)
                          ) {
                            let payload = {
                              fullName: name,
                              email: email,
                              phone: phoneNumber,
                              topic: 'Request',
                              description: description,
                            };
                            submitRequest(payload);
                          }
                        }
                      }}
                      style={[
                        styles.buyButton,
                        (!name ||
                          !email ||
                          !phoneNumber ||
                          !description ||
                          !isValidEmail(email)) && {
                          backgroundColor: '#ccc',
                        },
                      ]}
                      accessibilityRole="button">
                      {!updateLoading && (
                        <Text style={styles.buyText}>{'Submit'}</Text>
                      )}
                      {updateLoading && (
                        <ActivityIndicator color={'#fff'} size={'small'} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
          <CommonSuccessModal
            visible={visible}
            title="Success."
            message="Thank you for reaching us, our team will contact you as soon as possible."
            onClose={() => {
              setVisible(false);
              setUpdateSuccess();
              navigation.goBack();
            }}
          />
        </>
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
  requestContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    top: 10,
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

export default React.memo(HelpSupport);
