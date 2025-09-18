/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
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
    clientId,
    getConfigData,
    fetchSuggestions,
    fetchFavouriteAds,
    bearerToken,
    fetchInitialListings,
  } = useBoundStore();

  const [error, setError] = useState(false);
  const [deepLink, setDeepLink] = useState<any>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  /** Get device info once and memoize */
  const deviceInfo = useMemo(() => {
    return Promise.all([
      DeviceInfo.getUniqueId(),
      DeviceInfo.getVersion(),
      DeviceInfo.getModel(),
      DeviceInfo.getSystemVersion(),
    ]).then(([deviceId, version, model, osVersion]) => ({
      deviceId: deviceId || '123456',
      appVersion: version || '',
      deviceModel: model,
      osVersion: osVersion,
      fingerprintHash: 'hsde123231',
      rooted: false,
      emulator: false,
      debug: false,
      installer: 'com.android.vending',
    }));
  }, []);

  /** Fetch handshake data */
  const fetchData = useCallback(async () => {
    setError(false);
    try {
      const data = await deviceInfo;
      console.log('handshake payload', data);
      gethandShakeToken(data);
    } catch (err) {
      setError(true);
    }
  }, [deviceInfo]);

  /** Get config data */
  const getAppConfigData = useCallback(() => {
    getConfigData();
  }, []);

  /** Handle deep links */
  const handleDeepLink = useCallback(
    (event: {url: string}) => {
      const url = event.url;
      const match = url.match(/details\/(\w+)/);
      if (match) {
        const propertyId = match[1];
        navigation.navigate('Details', {items: {_id: propertyId}});
      }
    },
    [navigation],
  );

  /** Setup deep link listeners */
  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then(url => {
      if (url) setDeepLink({url});
    });

    return () => subscription.remove();
  }, [handleDeepLink]);

  /** Initialize app state when focused */
  useFocusEffect(
    useCallback(() => {
      const initialize = async () => {
        setError(false);
        try {
          console.log('Token & ClientId', token, clientId);
          if (!token || !clientId) {
            await fetchData();
          } else {
            if (bearerToken) {
              fetchFavouriteAds();
            }
            Promise.allSettled([
              getAppConfigData(),
              fetchSuggestions(),
            ]);
            if (deepLink) {
              handleDeepLink(deepLink);
            } else {
              fetchInitialListings()
            }
          }
        } catch (err) {
          setError(true);
        }
      };
      initialize();
    }, [
      token,
      clientId,
      bearerToken,
      deepLink,
      fetchData,
      getAppConfigData,
      handleDeepLink,
      navigation,
    ]),
  );

  /** Start animation once */
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
    return () => pulse.stop();
  }, []);

  return (
    <View style={styles.container}>
      <AppUpdateChecker />
      <Animated.Image
        source={require('@assets/images/logo.png')}
        style={[styles.image, {transform: [{scale: scaleAnim}]}]}
      />
      {(error || handShakeError) && (
        <View style={{alignItems: 'center', marginTop: 100}}>
          <Text style={{marginBottom: 10, fontFamily: Fonts.MEDIUM}}>
            🔌 APP Initialization failed. Please try again.
          </Text>
          <TouchableOpacity style={styles.loginBtn} onPress={fetchData}>
            <Text style={styles.loginText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
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
