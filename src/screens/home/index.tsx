/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import useBoundStore from '@stores/index';
import DeviceInfo from 'react-native-device-info';
import {Fonts} from '@constants/font';
import {useFocusEffect} from '@react-navigation/native';
import AppUpdateChecker from './AppUpdateChecker';

function Index({navigation}: any): React.JSX.Element {
  const {
    token,
    gethandShakeToken,
    handShakeError,
    // habdshakeErrorLog,
    clientId,
    getConfigData,
    fetchFavouriteAds,
    bearerToken,
  } = useBoundStore();
  const [error, setError] = useState(true);
  const [deepLink, setDeepLink] = useState<any>(null);

  const getDeviceId = () => {
    return DeviceInfo.getUniqueId().then(uniqueId => {
      return uniqueId;
    });
  };

  const fetchData = async () => {
    setError(false);
    const deviceId = await getDeviceId();
    let version = DeviceInfo.getVersion();
    const deviceModel = DeviceInfo.getModel();
    const osVersion = DeviceInfo.getSystemVersion();
    const data = {
      deviceId: deviceId ? deviceId : '123456',
      appVersion: version ?? '',
      deviceModel: deviceModel,
      osVersion: osVersion,
      fingerprintHash: 'hsde123231',
      rooted: false,
      emulator: false,
      debug: false,
      installer: 'com.android.vending',
    };
    console.log('handshake payload', data);
    gethandShakeToken(data);
  };

  const getAppConfigData = async () => {
    getConfigData();
  };

  const handleDeepLink = (event: {url: string}) => {
    const url = event.url; // e.g., myapp://property/12345
    const match = url.match(/details\/(\w+)/);
    if (match) {
      // const propertyId = match[1];
      // navigation.navigate('Details', {items: {_id: propertyId}});
    }
  };

  useEffect(() => {
    // Listen when app is already open
    const sub = Linking.addEventListener('url', handleDeepLink);

    // Also handle when app is opened from a killed state
    Linking.getInitialURL().then(url => {
      if (url) {
        setDeepLink({url});
      }
    });

    return () => sub.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const initialize = async () => {
        setError(false);
        try {
          console.log('Token & ClientId', token, clientId);
          if (!token || !clientId) {
            fetchData();
          } else {
            if (bearerToken) {
              fetchFavouriteAds();
            }
            getAppConfigData();
            if (deepLink) {
              handleDeepLink(deepLink);
            } else {
              navigation.navigate('Main');
            }
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
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
  }, [scaleAnim]);

  return (
    <View style={styles.container}>
      <AppUpdateChecker />
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
            {/* <Text style={{marginBottom: 10, fontFamily: Fonts.MEDIUM}}>
              {JSON.stringify(habdshakeErrorLog)}
            </Text> */}
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
  image: {
    width: 300,
    height: 50,
  },
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
