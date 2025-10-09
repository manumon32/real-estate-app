// VoiceRecorder.js
// WhatsApp-style voice recorder with MaterialCommunityIcons
// Uses: react-native-audio-recorder-player@3.6.14

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  PanResponder,
  Animated,
  Platform,
  PermissionsAndroid,
  Alert,
  Easing,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function VoiceRecorder({
  onSendAudio = () => {},
  maxDuration = 60,
  style = {},
  setRecording = arg => {},
  recording = false,
}) {
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00');
  const [cancelled, setCancelled] = useState(false);

  const panX = useRef(new Animated.Value(0)).current;
  const micScale = useRef(new Animated.Value(1)).current;
  const hintOpacity = useRef(new Animated.Value(0)).current;
  const cancelThreshold = -120;
  const pathRef = useRef(null);

  useEffect(() => {
    return () => {
      audioRecorderPlayer.removeRecordBackListener();
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.stopRecorder();
    };
  }, [audioRecorderPlayer]);

  async function requestPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        return (
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
          PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(micScale, {
          toValue: 1.3,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(micScale, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const stopPulse = () => {
    micScale.stopAnimation();
    micScale.setValue(1);
  };

  const startRecording = async () => {
    const ok = await requestPermission();
    if (!ok) {
      Alert.alert('Permission required', 'Please enable microphone access');
      return;
    }

    setCancelled(false);
    setRecording(true);
    setRecordSecs(0);
    setRecordTime('00:00');

    startPulse();
    Animated.timing(hintOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const dirs = Platform.OS === 'android' ? 'sdcard' : '';
    const fileName = `voice_${Date.now()}.mp4`;
    const path = Platform.select({
      ios: fileName,
      android: `${dirs}/Download/${fileName}`,
    });

    pathRef.current = path;

    try {
      await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener(e => {
        const secs = Math.floor(e.currentPosition / 1000);
        const mm = String(Math.floor(secs / 60)).padStart(2, '0');
        const ss = String(secs % 60).padStart(2, '0');
        setRecordTime(`${mm}:${ss}`);
        setRecordSecs(secs);
        if (secs >= maxDuration) stopRecording(false);
      });
    } catch (err) {
      console.warn('Recording start error', err);
      setRecording(false);
    }
  };

  const stopRecording = async (isCancelled = false) => {
    try {
      const uri = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      stopPulse();
      Animated.timing(hintOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setRecording(false);

      if (!isCancelled) {
        onSendAudio(uri, recordSecs);
      }
      setRecordSecs(0);
      setRecordTime('00:00');
      panX.setValue(0);
    } catch (err) {
      console.warn('Stop recorder error', err);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        recording && Math.abs(gestureState.dx) > 5,
      onPanResponderMove: (evt, gestureState) => {
        if (!recording) return;
        const x = Math.max(cancelThreshold - 20, Math.min(0, gestureState.dx));
        panX.setValue(x);
        setCancelled(gestureState.dx < cancelThreshold);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (!recording) return;
        stopRecording(gestureState.dx < cancelThreshold);
      },
    }),
  ).current;

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.hintContainer,
          {
            transform: [{translateX: panX}],
            opacity: hintOpacity,
          },
        ]}
        pointerEvents="none">
        <Text style={styles.hintText}>
          {cancelled ? 'Release to cancel' : 'Slide left to cancel'}
        </Text>
      </Animated.View>

      <Pressable
        style={({pressed}) => [
          styles.recordButton,
          recording && styles.recording,
          pressed && {opacity: 0.8},
        ]}
        onPressIn={startRecording}
        onPressOut={() => {
          setTimeout(() => {
            if (recording) stopRecording(false);
          }, 80);
        }}
        {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.innerButton,
            recording && {transform: [{scale: micScale}]},
          ]}>
          {!recording ? (
            <Icon name="microphone" size={32} color="#333" />
          ) : (
            <Text style={styles.timeText}>{recordTime}</Text>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintContainer: {
    position: 'absolute',
    left: -210,
    width: 190,
    height: 46,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintText: {
    color: '#fff',
    fontSize: 12,
  },
  recordButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f2f2f2',
    elevation: 6,
  },
  recording: {
    backgroundColor: '#ff4444',
    elevation: 8,
  },
  innerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
