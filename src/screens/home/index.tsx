/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import uuid from 'react-native-uuid';

import {Fonts} from '@constants/font';
import {useFocusEffect} from '@react-navigation/native';
import AppUpdateChecker from './AppUpdateChecker';

function Index({}: any): React.JSX.Element {
  const handShakeError = useBoundStore(s => s.handShakeError);
  const bearerToken = useBoundStore(s => s.bearerToken);
  const gethandShakeToken = useBoundStore(s => s.gethandShakeToken);
  const getConfigData = useBoundStore(s => s.getConfigData);
  const fetchSuggestions = useBoundStore(s => s.fetchSuggestions);
  const fetchFavouriteAds = useBoundStore(s => s.fetchFavouriteAds);
  const fetchInitialListings = useBoundStore(s => s.fetchInitialListings);
  const isFetchingRef = useRef(false);

  const [error, setError] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  /** Get device info once and memoize */
  const deviceInfo = useCallback(async () => {
    let storedDeviceId = uuid.v4();

    const [version, model, osVersion, isEmulator, installer, isDebug] =
      await Promise.all([
        DeviceInfo.getVersion(),
        DeviceInfo.getModel(),
        DeviceInfo.getSystemVersion(),
        DeviceInfo.isEmulator(),
        DeviceInfo.getInstallerPackageName(),
        false,
      ]);
    console.log(installer);

    return {
      deviceId: String(storedDeviceId), // stable per install
      appVersion: version || '',
      deviceModel: model,
      osVersion,
      emulator: isEmulator,
      debug: isDebug,
      installer: '', //installer || 'unknown',
      rooted: false, // use Play Integrity for real check
      fingerprintHash: 'hsde123231', // generate on backend
    };
  }, []);

  /** Fetch handshake data */
  const fetchData = useCallback(async () => {
    // Ignore if already running
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;

    setError(false);
    setRetryLoading(true);
    try {
      const data = await deviceInfo();
      await gethandShakeToken(data);
      if (bearerToken) {
        fetchFavouriteAds();
      }

      // App config + suggestions (parallel)
      Promise.allSettled([getAppConfigData(), fetchSuggestions()]);
      // Fetch initial listings
      fetchInitialListings();

      setRetryLoading(false);
    } catch (err) {
      setRetryLoading(false);
      setError(true);
    }
  }, []);

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
          if (!dataResult || !isActive) {
            return;
          }

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
    }, []),
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

export default React.memo(Index);
