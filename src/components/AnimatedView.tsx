import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const SlideInView = ({ children, direction = 'right', duration = 600 }:any) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: direction === 'right' ? [500, 0] : [-500, 0], // 500px slide
  });

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [slideAnim, duration]);

  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      {children}
    </Animated.View>
  );
};
export default SlideInView;