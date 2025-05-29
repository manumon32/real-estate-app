import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import LogoIcon from '@assets/svg/logo.svg';
import GroupIcon from '@assets/svg/group.svg';

const LoginScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustration} >
        <GroupIcon />
      </View>

      {/* Login Card */}
      <View style={styles.card}>
        {/* Logo */}
        <LogoIcon style={styles.logo} />
        <Text style={styles.title}>Login</Text>

        {/* Phone Input */}
        <Text style={styles.label}>Phone number</Text>
        <TextInput
          placeholder="0832 2132 213"
          style={styles.input}
          keyboardType="phone-pad"
        />

        {/* Password Input */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            secureTextEntry={!passwordVisible}
            placeholder="***********"
            style={[styles.input, {flex: 1, borderWidth: 0}]}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#777"
              style={{paddingHorizontal: 10}}
            />
          </TouchableOpacity>
        </View>

        {/* Remember Me and Forgot Password */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRememberMe(!rememberMe)}>
            <Icon
              name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={20}
              color="#15937c"
            />
            <Text style={styles.checkboxLabel}> Remember me</Text>
          </TouchableOpacity>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginBtn}>
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
          <Icon.Button
            name="apple"
            backgroundColor="#000"
            size={22}
            borderRadius={10}
            onPress={() => {}}
          />
          <Icon.Button
            name="google"
            backgroundColor="#fff"
            color="#000"
            size={22}
            borderRadius={10}
            onPress={() => {}}
          />
          <Icon.Button
            name="facebook"
            backgroundColor="#3b5998"
            size={22}
            borderRadius={10}
            onPress={() => {}}
          />
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Don’t have an account?{' '}
          <Text style={styles.registerText}>Register</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15937c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: '80%',
    height: 150,
    alignItems:'center',
    margin:10
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
});

export default LoginScreen;
