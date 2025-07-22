import { useState } from 'react';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { PermissionsAndroid, Platform } from 'react-native';

const audioRecorderPlayer: any =  ''; // new AudioRecorderPlayer();

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordedPath, setRecordedPath] = useState<string | null>(null);

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const startRecording = async () => {
    const hasPermission = await checkPermissions();
    if (!hasPermission) return;

    setIsRecording(true);
    const result = await audioRecorderPlayer?.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e: any) => {
      setRecordSecs(e.current_position);
    });
    setRecordedPath(result);
  };

  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
    setRecordSecs(0);
    setRecordedPath(result);
    return result;
  };

  const reset = () => {
    setRecordedPath(null);
    setRecordSecs(0);
    setIsRecording(false);
  };

  return {
    isRecording,
    recordSecs,
    recordedPath,
    startRecording,
    stopRecording,
    reset,
  };
};
