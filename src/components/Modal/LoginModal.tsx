/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useCallback,
  useEffect,
  //  useEffect,
  useState,
} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  useColorScheme,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth, { AppleAuthProvider } from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  AccessToken,
  LoginManager,
  Settings,
  Profile,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';

// import LogoIcon from '@assets/svg/logo.svg';
// @ts-ignore
import GroupIcon from '@assets/svg/group.svg';
import IconButton from '@components/Buttons/IconButton';
import {useTheme} from '@theme/ThemeProvider';
import useBoundStore from '@stores/index';
import OtpVerificationScreen from './OtpVerificationScreen';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const LoginModal: React.FC<Props> = ({visible, onClose}) => {
  const {
    login,
    otp,
    clearOTP,
    verifyOTP,
    loginError,
    otpLoading,
    loginErrorMessage,
  } = useBoundStore();
  const [loginVar, setLoginVar] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';

  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const {theme} = useTheme();
  useEffect(() => {
    setSocialLoading(false);
    Settings.initializeSDK();
  }, []);
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleSubmit: any = (arg = null) => {
    if (
      isValidEmail(arg ? arg : loginVar) ||
      isValidPhone(arg ? arg : loginVar)
    ) {
      let flag = isValidEmail(arg ? arg : loginVar) ? 'email' : 'phone';
      login({[flag]: arg ? arg : loginVar});
    } else {
      setMessage('❌  Invalid input');
    }
  };

  const veryFyOTP = (arg: any, userData: any) => {
    let payload: any = {};
    let userInfoData = userData || userInfo;
    setSocialLoading(true);
    if (userInfoData) {
      payload.isSocialLogin = true;
      payload.socialProvider = userInfoData?.socialProvider;
      payload.email = userInfoData?.email ?? null;
      payload.socialProviderId =
        userInfoData?.socialProvider === 'apple'
          ? userInfoData?.uid
          : userInfoData?.id;
      if (userInfoData?.socialProvider === 'facebook') {
        payload.profilePicture = userInfoData?.picture?.data?.url ?? '';
        payload.name = userInfoData?.name;
      }
      if (userInfoData?.socialProvider === 'google') {
        payload.email = userInfoData?.email ?? null;
        payload.profilePicture = userInfoData?.photo ?? '';
        payload.name =
          userInfoData?.givenName || userInfoData?.familyName
            ? userInfoData?.givenName + ' ' + userInfoData?.familyName
            : '';
      }
      if (userInfoData?.socialProvider === 'apple') {
        payload.email = userInfoData?.email ?? null;
        payload.profilePicture = userInfoData?.photoURL ?? '';
        payload.name = userInfoData?.displayName
          ? userInfoData?.displayName
          : '';
      }
    } else {
      payload = {
        phone: isValidPhone(loginVar) ? loginVar : null,
        email: isValidEmail(loginVar) ? loginVar : null,
      };
      payload.otp = arg;
    }
    console.log('payload:', payload);
    verifyOTP(payload);
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '1069084103649-ehn40vvlrdqqdd2qg3n25558uneph9sp.apps.googleusercontent.com',
      offlineAccess: true, // if using with Firebase or for getting refresh tokens
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userData: any = await GoogleSignin.signIn();
      if (userData.type === 'success') {
        let userInfoData = userData?.data?.user;
        setUserInfo({...userInfoData, socialProvider: 'google'});
        setLoginVar(userInfoData?.email ?? '');
        console.log('userInfoData', userInfoData);
        veryFyOTP(false, {...userInfoData, socialProvider: 'google'});
      } else {
        Toast.show({
          type: 'error',
          text1: 'Gmail Sign-in failed',
          position: 'bottom',
          visibilityTime: 1000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (!result.isCancelled) {
        const data = await AccessToken.getCurrentAccessToken();
        if (data) {
          getFacebookUserInfo(data.accessToken);
        }
      }
    } catch (error: any) {
      Alert.alert('Login fail', error.message);
    }
  };

const signInWithApple = async () => {
  if (Platform.OS !== 'ios') return;

  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const { identityToken, nonce } = appleAuthRequestResponse;

    if (!identityToken) {
      throw new Error('Apple Sign-In failed: No identity token returned');
    }
    const appleCredential = AppleAuthProvider.credential(identityToken, nonce);

    // ✅ Sign in with Firebase
    const userCredential = await auth().signInWithCredential(appleCredential);

    if (userCredential.user?.email) {
      setUserInfo({ ...userCredential.user, socialProvider: 'apple' });
      setLoginVar(userCredential.user?.email);
      let payload: any = {
        email: userCredential.user?.email ?? null,
        profilePicture: userCredential.user?.photoURL ?? '',
        name: userCredential.user?.displayName ?? '',
        socialProvider: 'apple',
        socialProviderId: userCredential.user?.uid,
        isSocialLogin: true,
      };
      verifyOTP(payload);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Apple Sign-in failed',
        position: 'bottom',
        visibilityTime: 1000,
      });
    }
  } catch (err: any) {
    Toast.show({
      type: 'error',
      text1: 'Apple Sign-in failed, Email is required',
      position: 'bottom',
      visibilityTime: 1000,
    });
  }
};

  const getFacebookUserInfo = (token: string) => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: token,
        parameters: {
          fields: {
            string: 'id, name, email, picture.type(large)',
          },
        },
      },
      (error, result) => {
        if (error) {
          console.log('Error fetching data: ' + error.toString());
        } else {
          // console.log('Success fetching data: ', result);
          // Alert.alert(`Hi ${result.name}, email: ${result.email}`);
          setUserInfo({...result, socialProvider: 'facebook'});
          // @ts-ignore
          setLoginVar(result?.email ?? '');
          veryFyOTP(false, {...result, socialProvider: 'facebook'});
        }
      },
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  };

  const {height, width} = Dimensions.get('window');

  return (
    <Modal
      visible={visible}
      transparent={true} // not overlay ‑> full sheet
      presentationStyle={
        Platform.OS === 'ios' ? 'overFullScreen' : 'overFullScreen'
      }
      statusBarTranslucent
      animationType="fade"
      onRequestClose={handleClose}>
      <>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
          {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
          <View style={{flex: 1}}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[
                styles.container,
                {
                  flexGrow: 1,
                },
              ]}>
              {otpLoading && (
                <View style={styles.overlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
              {!otp && (
                <>
                  <LinearGradient
                    colors={
                      !isDarkMode
                        ? [
                            '#FFFFFF',
                            '#FFFFFF',
                            '#40DABE',
                            '#40DABE',
                            '#227465',
                          ]
                        : [
                            '#000000',
                            '#40DABE',
                            '#40DABE',
                            '#40DABE',
                            '#000000',
                          ]
                    }
                    start={{x: 0.5, y: 0}}
                    end={{x: 0.5, y: 1}}
                    style={styles.gradient}>
                    {/* Illustration */}
                    <Pressable onPress={handleClose} style={styles.closeButton}>
                      <IconButton
                        iconSize={24}
                        iconColor={theme.colors.text}
                        iconName={'close'}
                      />
                    </Pressable>
                    <View style={styles.illustration}>
                      <GroupIcon />
                    </View>

                    {/* Login Card */}
                    <View
                      style={[
                        styles.card,
                        {backgroundColor: theme.colors.background},
                      ]}>
                      {/* Logo */}
                      <Image
                        source={require('@assets/images/logo.png')}
                        style={styles.logo}
                      />

                      {/* <LogoIcon style={styles.logo} /> */}
                      <Text style={[styles.title, {color: theme.colors.text}]}>
                        Login
                      </Text>

                      {/* Phone Input */}
                      <Text style={[styles.label, {color: theme.colors.text}]}>
                        Phone number or Email
                      </Text>
                      <TextInput
                        value={loginVar}
                        onChangeText={text => {
                          setLoginVar(text);
                          setMessage('');
                        }}
                        placeholder="Phone number or Email"
                        placeholderTextColor={'#ccc'}
                        style={styles.input}
                      />
                      {(message || loginError) && (
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#ff4d4f',
                            margin: 5,
                            marginTop: -5,
                          }}>
                          {'Please enter valid Phone number or Email'}
                        </Text>
                      )}

                      {/* Login Button */}
                      <TouchableOpacity
                        onPress={() => {
                          setUserInfo(null);
                          handleSubmit();
                        }}
                        style={styles.loginBtn}>
                        <Text style={styles.loginText}>Login</Text>
                      </TouchableOpacity>

                      {/* Divider */}
                      <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.orText}>Or</Text>
                        <View style={styles.divider} />
                      </View>

                      {/* Social Logins */}
                      <View style={styles.socialRow}>
                        {Platform.OS === 'ios' && (
                          <Icon
                            name="apple"
                            color={theme.colors.text}
                            size={36}
                            onPress={() => signInWithApple()}
                          />
                        )}
                        <Icon
                          name="google"
                          color={'#4081ee'}
                          size={36}
                          onPress={signInWithGoogle}
                        />
                        <Icon
                          name="facebook"
                          color={theme.colors.text}
                          size={36}
                          onPress={() => {
                            signInWithFacebook();
                          }}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: theme.colors.background,
                            borderRadius: 6,
                          }}
                        />
                      </View>
                    </View>
                  </LinearGradient>
                </>
              )}

              {otp && (
                <OtpVerificationScreen
                  clearOTP={clearOTP}
                  loginVar={loginVar}
                  handleSubmit={handleSubmit}
                  veryFyOTP={veryFyOTP}
                  otpValue={otp}
                  otpLoading={otpLoading}
                  loginErrorMessage={loginErrorMessage}
                />
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#15937c',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // fills the screen
    backgroundColor: 'rgba(0, 0, 0, 0.78)', // transparent dark overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // ensure it's on top
  },
  gradient: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: '80%',
    height: 150,
    alignItems: 'center',
    margin: 10,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginTop: -20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  logo: {
    width: 200,
    height: 50,
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    color: '#444',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f2f3f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f3f5',
    borderRadius: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#444',
  },
  forgotText: {
    fontSize: 13,
    color: '#888',
  },
  loginBtn: {
    backgroundColor: '#15937c',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    color: '#777',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#444',
  },
  registerText: {
    color: '#15937c',
    fontWeight: 'bold',
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: '#ccc',
    padding: 8,
    borderRadius: 20,
  },
});

export default React.memo(LoginModal);
