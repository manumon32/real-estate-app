/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  PanResponder,
  Vibration,
} from 'react-native';
import { useVoiceRecorder } from './useVoiceRecorder';

const CANCEL_THRESHOLD = 100;

export default function SlideToRecordButton({ onSend }: { onSend: (audioFile: string) => void }) {
  const { startRecording, stopRecording } = useVoiceRecorder();
  const [isRecording, setIsRecording] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const pan = React.useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: async () => {
      setCanceled(false);
      setIsRecording(true);
      pan.setValue({ x: 0, y: 0 });
      await startRecording();
    },
    onPanResponderMove: (_, gestureState) => {
      if (Math.abs(gestureState.dx) > CANCEL_THRESHOLD) {
        setCanceled(true);
        Vibration.vibrate(50);
      }
      pan.setValue({ x: gestureState.dx, y: 0 });
    },
    onPanResponderRelease: async () => {
      const audioPath = await stopRecording();
      if (!canceled && audioPath) {
        onSend(audioPath);
      }
      setIsRecording(false);
      setCanceled(false);
      pan.setValue({ x: 0, y: 0 });
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }],
          backgroundColor: canceled ? '#aaa' : isRecording ? '#f44336' : '#2196f3',
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.text}>
        {canceled ? 'Recording Cancelled' : isRecording ? 'Slide to Cancel' : 'Hold to Talk'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
