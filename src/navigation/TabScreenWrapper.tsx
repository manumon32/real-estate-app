// TabScreenWrapper.tsx
import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type Props = {
  index: number; // 0, 1, 2...
  children: React.ReactNode;
};

const TabScreenWrapper = ({ children }: Props) => {
  const offset = useSharedValue(width); // start offscreen

  useEffect(() => {
    offset.value = withTiming(0, { duration: 300 });
  }, [offset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return <Animated.View style={[{ flex: 1, height:200 }, animatedStyle]}>{children}</Animated.View>;
};

export default TabScreenWrapper;
