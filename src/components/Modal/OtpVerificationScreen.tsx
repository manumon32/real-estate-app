import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
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
  const [timer, setTimer] = useState(72); // 1:12
  const [error, setError] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

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
      if (text && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
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

  // Timer countdown (optional)
  React.useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            clearOTP();
          }}
          style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          We have sent the verification code to{' '}
          <Text style={styles.phone}>{loginVar}</Text>
        </Text>
        <Text style={styles.subtitle}>OTP- {otpValue}</Text>
        {loginErrorMessage && (
          <Text style={[styles.subtitle, {color: 'red'}]}>
            {loginErrorMessage}
          </Text>
        )}

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              // @ts-ignore
              ref={ref => (inputRefs.current[index] = ref)}
              value={digit}
              onChangeText={text => handleChange(text.slice(-1), index)}
              onKeyPress={({nativeEvent}) => {
                if (nativeEvent.key === 'Backspace') handleBackspace(index);
              }}
              style={[
                styles.otpInput,
                digit ? styles.otpFilled : null,
                index === otp.findIndex(d => d === '') && styles.otpActive,
                error && {borderColor: 'red'},
              ]}
              keyboardType="number-pad"
              maxLength={1}
              returnKeyType="done"
              autoFocus={index === 0}
            />
          ))}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={resendCode} disabled={timer > 0}>
            <Text
              style={[styles.resendText, timer > 0 && styles.resendDisabled]}>
              Resend
            </Text>
          </TouchableOpacity>
          <Text style={styles.timer}>{formattedTimer}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          setError(false);
          if (otp.join('') !== otpValue) {
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
    color: '#000',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#444',
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
