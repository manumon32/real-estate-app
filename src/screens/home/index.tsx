/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// AppInitializer.tsx
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Animated, StyleSheet, Text, TouchableOpacity} from 'react-native';
import useBoundStore from '@stores/index';
import DeviceInfo from 'react-native-device-info';
import {Fonts} from '@constants/font';
import {useFocusEffect} from '@react-navigation/native';

function Index({navigation}: any): React.JSX.Element {
  const {token, gethandShakeToken, handShakeError, clientId, getConfigData} =
    useBoundStore();
  const [error, setError] = useState(true);

  const getDeviceId = () => {
    return DeviceInfo.getUniqueId().then(uniqueId => {
      return uniqueId;
    });
  };

  const fetchData = async () => {
    setError(false);
    const deviceId = await getDeviceId();
    const data = {
      deviceId: deviceId,
      appVersion: '1.3.0',
      deviceModel: 'Pixel 6',
      osVersion: 'Android 13',
      fingerprintHash: 'hsde123231',
      rooted: false,
      emulator: false,
      debug: false,
      installer: 'com.android.vending',
    };
    gethandShakeToken(data);
  };

  const getAppConfigData = async () => {
    getConfigData();
  };

  useFocusEffect(
    useCallback(() => {
      const initialize = async () => {
        setError(false);
        try {
          if (!token || !clientId) {
            fetchData();
          } else {
            getAppConfigData();
            navigation.navigate('Main');
          }
        } catch (err) {
          setError(true);
        }
      };

      initialize();

      return () => {};
    }, [token, navigation]),
  );

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
  }, [scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('@assets/images/logo.png')}
        style={[styles.image, {transform: [{scale: scaleAnim}]}]}
      />
      {error ||
        (handShakeError && (
          <View style={{alignItems: 'center', marginTop: 100}}>
            <Text style={{marginBottom: 10, fontFamily: Fonts.MEDIUM}}>
              🔌 APP Initialization failed. Please try again.
            </Text>
            <TouchableOpacity style={styles.loginBtn} onPress={fetchData}>
              <Text style={styles.loginText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  image: {width: 100, height: 100},
  loginBtn: {
    backgroundColor: '#15937c',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    width: 150,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Index;
