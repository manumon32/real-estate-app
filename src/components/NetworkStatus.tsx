// components/NetworkStatus.tsx
import React, {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {Text, StyleSheet, Animated} from 'react-native';

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, isConnected]);

  if (isConnected) return null;

  return (
    <Animated.View style={[styles.banner, {opacity: fadeAnim}]}>
      <Text style={styles.text}>No Internet Connection</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#ff4d4d',
    padding: 10,
    height: 60,
    zIndex: 999,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
});

export default NetworkStatus;
