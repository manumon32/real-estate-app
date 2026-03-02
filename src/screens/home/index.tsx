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

function HomeScreenIndex(): React.JSX.Element {
  const handShakeError = useBoundStore(s => s.handShakeError);
  const bearerToken = useBoundStore(s => s.bearerToken);
  const gethandShakeToken = useBoundStore(s => s.gethandShakeToken);
  const getConfigData = useBoundStore(s => s.getConfigData);
  const fetchSuggestions = useBoundStore(s => s.fetchSuggestions);
  const fetchFavouriteAds = useBoundStore(s => s.fetchFavouriteAds);
  const fetchInitialListings = useBoundStore(s => s.fetchInitialListings);

  // Stable device ID for the lifetime of this component instance
  const deviceIdRef = useRef<string>(String(uuid.v4()));
  // Guard against concurrent fetches
  const isFetchingRef = useRef(false);

  const isActive = {current: true};
  const [error, setError] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  /** Collect device metadata once per call */
  const getDeviceInfo = useCallback(async () => {
    const [version, model, osVersion, isEmulator, installer] =
      await Promise.all([
        DeviceInfo.getVersion(),
        DeviceInfo.getModel(),
        DeviceInfo.getSystemVersion(),
        DeviceInfo.isEmulator(),
        DeviceInfo.getInstallerPackageName(),
      ]);
    console.log('Device Info:', {
      deviceId: deviceIdRef.current,
      appVersion: version,
      deviceModel: model,
      osVersion,
      emulator: isEmulator,
      installer,
    });

    return {
      deviceId: deviceIdRef.current,
      appVersion: version ?? '',
      deviceModel: model,
      osVersion,
      emulator: isEmulator,
      debug: __DEV__,
      installer: '', //installer || 'unknown',
      rooted: false, // use Play Integrity for real check
      fingerprintHash: 'hsde123231', // generate on backend
    };
  }, []);

  /** Initialise the app: handshake → config/suggestions → listings */
  const fetchData = useCallback(
    async (isActive: {current: boolean}, isHandshakeNeeded = false) => {
      if (isFetchingRef.current) {
        return;
      }
      isFetchingRef.current = true;
      setError(false);
      setRetryLoading(true);

      try {
        if (isHandshakeNeeded) {
          const data = await getDeviceInfo();
          await gethandShakeToken(data);
          fetchInitialListings();
        }

        if (bearerToken) {
          fetchFavouriteAds();
        }

        // Run config + suggestions in parallel; don't block listings on them
        Promise.allSettled([getConfigData(), fetchSuggestions()]);
      } catch {
        if (isActive.current) {
          setError(true);
        }
      } finally {
        isFetchingRef.current = false;
        if (isActive.current) {
          setRetryLoading(false);
        }
      }
    },
    [],
  );

  /** Retry handler exposed to the UI — always safe to call */
  const handleRetry = useCallback(() => {
    fetchData(isActive, true);
  }, [fetchData]);

  const fetchInitialData = useCallback(async () => {
    try {
      await fetchInitialListings();
      fetchData(isActive);
    } catch (err: any) {
      fetchData(isActive, true);
    }
  }, [fetchData, fetchInitialListings]);

  /** Initialize on first focus */
  useFocusEffect(
    useCallback(() => {
      fetchInitialData();
      return () => {
        isActive.current = false;
      };
    }, [fetchInitialData]),
  );

  /** Pulse animation — runs once on mount */
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
  }, [scaleAnim]);

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
          <TouchableOpacity style={styles.loginBtn} onPress={handleRetry}>
            {retryLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Retry</Text>
            )}
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

export default React.memo(HomeScreenIndex);
