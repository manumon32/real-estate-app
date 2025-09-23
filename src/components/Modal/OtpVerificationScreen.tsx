/* eslint-disable react-native/no-inline-styles */
import {useTheme} from '@theme/ThemeProvider';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  getHash,
  startOtpListener,
  removeListener,
} from 'react-native-otp-verify';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const OTP_LENGTH = 6;

const OtpVerificationScreen = ({
  clearOTP,
  handleSubmit,
  loginVar,
  veryFyOTP,
  otpValue,
  loginErrorMessage,
  otpLoading,
}: any) => {
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(72);
  const [error, setError] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const hiddenInputRef = useRef<TextInput>(null);

  const {theme} = useTheme();

  // Format timer as MM:SS
  const formattedTimer = useMemo(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timer]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (index === OTP_LENGTH - 1) {
        Number(text) && veryFyOTP(newOtp.join(''));
        return;
      }
      if (text && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp, veryFyOTP],
  );

  const handleBackspace = useCallback(
    (index: number) => {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const resendCode = useCallback(() => {
    if (timer === 0) {
      setOtp(new Array(OTP_LENGTH).fill(''));
      setTimer(72); // restart timer
      handleSubmit();
    }
  }, [handleSubmit, timer]);

  // Timer countdown
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // OTP listener (Android auto-read)
  useEffect(() => {
    getHash()
      .then(hashArray => {
        console.log('App hash:', hashArray[0]);
      })
      .catch(console.log);

    startOtpListener(message => {
      console.log('OTP message:', message);

      const otps = message.match(/\d{6}/g);
      if (otps && otps.length > 0) {
        const code = otps[otps.length - 1];
        setOtp(code.split(''));
        veryFyOTP(code);
      }
    });

    return () => removeListener();
  }, [veryFyOTP]);

  // Handle OTP autofill from hidden input (iOS only)
  const handleOtpChange = (code: string) => {
    if (code.length === OTP_LENGTH) {
      const otpArr = code.split('');
      setOtp(otpArr);
      veryFyOTP(code);
    }
  };

  // Auto focus hidden input on iOS (shows suggestion bar)
  useEffect(() => {
    if (Platform.OS === 'ios') {
    setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 500);
    } else {
    }
  }, []);

  return (
    <>
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <TouchableOpacity
          onPress={() => {
            clearOTP();
          }}
          style={styles.backButton}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        <Text style={[styles.title, {color: theme.colors.text}]}>
          Verification Code
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.text}]}>
          We have sent the verification code to{' '}
          <Text style={styles.phone}>{loginVar}</Text>
        </Text>

        {loginErrorMessage && (
          <Text style={[styles.subtitle, {color: 'red'}]}>
            {loginErrorMessage}
          </Text>
        )}

        {/* 🔑 Hidden input (for iOS autofill full OTP, invisible to user) */}
        <TextInput
          ref={hiddenInputRef}
          style={{position: 'absolute', opacity: 0, height: 0, width: 0}}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          importantForAutofill="yes"
          value={otp.join('')}
          onChangeText={handleOtpChange}
        />

        {/* Visible OTP boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              value={digit}
              onChangeText={text => {
                handleChange(text.slice(-1), index);
              }}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace') handleBackspace(index);
              }}
              style={[
                styles.otpInput,
                digit ? styles.otpFilled : null,
                index === otp.findIndex(d => d === '') && styles.otpActive,
                error && {borderColor: 'red'},
              ]}
              autoFocus={Platform.OS === 'android' && index === 0}
              keyboardType="number-pad"
              maxLength={1}
              returnKeyType="done"
            />
          ))}
        </View>

        {/* Footer (resend + timer) */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={resendCode} disabled={timer > 0}>
            <Text
              style={[
                styles.resendText,
                {color: theme.colors.text},
                timer > 0 && styles.resendDisabled,
              ]}>
              Resend
            </Text>
          </TouchableOpacity>
          <Text style={[styles.timer, {color: theme.colors.text}]}>
            {formattedTimer}
          </Text>
        </View>
      </View>

      {/* Verify button */}
      <TouchableOpacity
        onPress={() => {
          setError(false);
          if (otp.length !== OTP_LENGTH) {
            setError(true);
          } else {
            setError(false);
            veryFyOTP(otp.join(''));
          }
        }}
        style={styles.loginBtn}>
        {otpLoading && <ActivityIndicator size={'small'} color={'#fff'} />}
        {!otpLoading && <Text style={styles.loginText}>Verify</Text>}
      </TouchableOpacity>
    </>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 32,
  },
  phone: {
    color: '#2F80ED',
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    margin: 2,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  otpActive: {
    borderColor: '#2F80ED',
  },
  otpFilled: {
    borderColor: '#2F80ED',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resendText: {
    color: '#2F80ED',
    fontWeight: '500',
  },
  resendDisabled: {
    color: '#aaa',
  },
  timer: {
    color: '#333',
  },
  loginBtn: {
    backgroundColor: '#15937c',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
    padding: 20,
    margin: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
