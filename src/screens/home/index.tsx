/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import useBoundStore from '@stores/index';
import DeviceInfo from 'react-native-device-info';
import {Fonts} from '@constants/font';
import {useFocusEffect} from '@react-navigation/native';
import AppUpdateChecker from './AppUpdateChecker';

function Index({}: any): React.JSX.Element {
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
  const [retryLoading, setRetryLoading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  /** Get device info once and memoize */
  const deviceInfo = useMemo(() => {
    return Promise.all([
      DeviceInfo.getUniqueId(),
      DeviceInfo.getVersion(),
      DeviceInfo.getModel(),
      DeviceInfo.getSystemVersion(),
    ]).then(([deviceId, version, model, osVersion]) => ({
      deviceId: deviceId,
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
    setRetryLoading(true);
    try {
      const data = await deviceInfo;
      await gethandShakeToken(data);
      if (bearerToken) {
        fetchFavouriteAds();
      }
      // 4️⃣ Fetch initial listings
      fetchInitialListings();

      // 3️⃣ App config + suggestions (parallel)
      Promise.allSettled([getAppConfigData(), fetchSuggestions()]);

      setRetryLoading(false);
    } catch (err) {
      setRetryLoading(false);
      setError(true);
    }
  }, [deviceInfo]);

  /** Get config data */
  const getAppConfigData = useCallback(() => {
    getConfigData();
  }, []);

  /** Initialize app state when focused */
  useFocusEffect(
    useCallback(() => {
      let isActive = true; // Prevent updates after unmount

      const initialize = async () => {
        setError(false);

        try {
          // 1️⃣ First-time load (token/clientId missing)
          const dataResult: any = await fetchData(); // <-- MUST succeed

          // If fetchData failed or returned nothing, stop
          if (!dataResult || !isActive) return;

          // 2️⃣ Authenticated flow
        } catch (err) {
          if (isActive) {
            setError(true);
          }
        }
      };

      initialize();

      return () => {
        isActive = false; // cleanup
      };
    }, [
      token,
      clientId,
      bearerToken,
      fetchData,
      fetchFavouriteAds,
      getAppConfigData,
      fetchSuggestions,
      fetchInitialListings,
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
        <View style={styles.handShakeContainer}>
          <Text style={styles.init}>
            🔌 APP Initialization failed. Please try again.
          </Text>
          <TouchableOpacity style={styles.loginBtn} onPress={fetchData}>
            {!retryLoading && <Text style={styles.loginText}>Retry</Text>}
            {retryLoading && <ActivityIndicator color={'#fff'} />}
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
  handShakeContainer: {alignItems: 'center', marginTop: 100},
  init: {marginBottom: 10, fontFamily: Fonts.MEDIUM},
});

export default Index;
