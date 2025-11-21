// components/NetworkStatus.tsx
import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Fonts} from '@constants/font';

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [checking, setChecking] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // 🔍 Subscribe to network state changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  // 🎞 Animate visibility
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isConnected ? 0 : 1,
      duration: isConnected ? 400 : 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected, fadeAnim]);

  // 🔄 Retry check
  const handleRetry = useCallback(async () => {
    setChecking(true);
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected ?? false);
    setChecking(false);
  }, []);

  if (isConnected) return null;

  return (
    <Animated.View style={[styles.overlay, {opacity: fadeAnim}]}>
      <View style={styles.card}>
        <MaterialCommunityIcons
          name="wifi-off"
          size={50}
          // color="#009688"
          style={styles.icon}
        />
        <Text style={styles.title}>
          No Internet Connection
        </Text>
        <Text style={styles.subtitle}>
          Please check your network settings or try again.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.retryButton, checking && styles.retryButtonDisabled]}
          onPress={handleRetry}
          disabled={checking}>
          {checking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons
                name="reload"
                size={20}
                color="#fff"
                style={{marginRight: 6}}
              />
              <Text style={styles.retryText}>Retry</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f66666ff', // deep teal
    marginBottom: 8,
    fontFamily: Fonts.BOLD,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    fontFamily: Fonts.MEDIUM,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 26,
    elevation: 3,
    shadowColor: '#009688',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 3},
  },
  retryButtonDisabled: {
    opacity: 0.7,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default NetworkStatus;
