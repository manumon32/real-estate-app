import React, {useRef, useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For play/pause icon

interface AudioPlayerProps {
  filePath: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({filePath}) => {
  const player = useRef(new AudioRecorderPlayer()).current;
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // total duration in seconds
  const [position, setPosition] = useState(0); // current position in seconds
  const [paused, setPausedPosition] = useState(false);
  useEffect(() => {
    return () => {
      player.stopPlayer();
      player.removePlayBackListener();
    };
  }, [player]);

  const playPause = async () => {
    if (!playing) {
      // If paused, resume
      if (paused) {
        await player.resumePlayer(); // resume from paused position
      } else {
        await player.startPlayer(filePath); // start new
      }

      player.addPlayBackListener(e => {
        setPosition(Math.floor(e.currentPosition / 1000));
        setDuration(Math.floor(e.duration / 1000));

        if (e.currentPosition === e.duration) {
          player.stopPlayer();
          setPlaying(false);
          setPausedPosition(false);
          player.removePlayBackListener();
        }
      });
      setPlaying(true);
    } else {
      await player.pausePlayer(); // returns current position in ms
      setPausedPosition(true); // save paused position
      setPlaying(false);
    }
  };

  const onSeek = async (value: number) => {
    await player.seekToPlayer(value * 1000);
    setPosition(value);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={playPause} style={styles.playButton}>
        <Icon name={playing ? 'pause' : 'play-arrow'} size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.sliderContainer}>
        <Slider
          style={{flex: 1}}
          minimumValue={0}
          maximumValue={duration}
          value={position}
         minimumTrackTintColor="#128C7E"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#25D366"
          onSlidingComplete={onSeek}
        />
        <Text style={styles.timer}>
          {formatTime(position)} / {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2FFC7',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    elevation: 2,
  },
  playButton: {
    backgroundColor: '#25D366',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -2,
  },
  timer: {
    fontSize: 11,
    color: '#555',
  },
});
