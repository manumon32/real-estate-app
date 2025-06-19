/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useCallback,
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import LogoIcon from '@assets/svg/logo.svg';
import GroupIcon from '@assets/svg/group.svg';
import IconButton from '@components/Buttons/IconButton';
import {useTheme} from '@theme/ThemeProvider';
import useBoundStore from '@stores/index';
import OtpVerificationScreen from './OtpVerificationScreen';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const LoginModal: React.FC<Props> = ({visible, onClose}) => {
  const {login, otp, clearOTP, verifyOTP, loginError} = useBoundStore();
  const [loginVar, setLoginVar] = useState('');
  const [message, setMessage] = useState('');
  const {theme} = useTheme();

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

  const handleSubmit = () => {
    if (isValidEmail(loginVar) || isValidPhone(loginVar)) {
      login({phone: loginVar});
    } else {
      setMessage('❌  Invalid input');
    }
  };

  const veryFyOTP = (arg: any) => {
    verifyOTP({phone: loginVar, email: null, otp: arg});
  };

  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId:
  //       // '888933323180-hb2t8o1bm16981prm0q8dcios6n8qsph.apps.googleusercontent.com',
  //       // '888933323180-1pflhpbmfpph3s9jke2lit42rkcvt57l.apps.googleusercontent.com',
  //       '888933323180-ecjddjlmr785c82mvg9mv4o3437l3u0f.apps.googleusercontent.com',
  //     offlineAccess: true, // if using with Firebase or for getting refresh tokens
  //   });
  // }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google user', userInfo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={false} // not overlay ‑> full sheet
      presentationStyle={
        Platform.OS === 'ios' ? 'fullScreen' : 'overFullScreen'
      }
      statusBarTranslucent
      animationType="fade"
      onRequestClose={handleClose}>
      <View style={styles.container}>
        {!otp && (
          <>
            <LinearGradient
              colors={[
                '#FFFFFF',
                '#FFFFFF',
                '#40DABE',
                '#40DABE',
                '#227465',
              ]}
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
              <View style={styles.card}>
                {/* Logo */}
                <LogoIcon style={styles.logo} />
                <Text style={styles.title}>Login</Text>

                {/* Phone Input */}
                <Text style={styles.label}>Phone number or Email</Text>
                <TextInput
                  value={loginVar}
                  onChangeText={text => {
                    setLoginVar(text);
                    setMessage('');
                  }}
                  placeholder="Phone number or Email"
                  placeholderTextColor={'#ccc'}
                  style={styles.input}
                  keyboardType="phone-pad"
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
                  onPress={handleSubmit}
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
                  <Icon
                    name="apple"
                    size={36}
                    onPress={() => {}}
                  />
                  <Icon
                    name="google"
                    color="#000"
                    size={36}
                    // onPress={signInWithGoogle}
                  />
                  <Icon
                    name="facebook"
                    color="#3b5998"
                    size={36}
                    onPress={() => {}}
                    style={{justifyContent:'center', alignItems:'center'}}
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
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15937c',
    // alignItems: 'center',
    // justifyContent: 'center',
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
    width: 60,
    height: 60,
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
