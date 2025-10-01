import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ImageUploadSkeletonProps {
  count?: number;
  horizontal?: boolean;
}

const ImageUploadSkeleton: React.FC<ImageUploadSkeletonProps> = ({ 
  count = 3, 
  horizontal = true 
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [opacity]);

  const skeletonItems = Array.from({ length: count }, (_, index) => (
    <Animated.View
      key={index}
      style={[
        styles.skeletonItem,
        {
          opacity,
        },
      ]}
    />
  ));

  return (
    <View style={[styles.container, horizontal && styles.horizontal]}>
      {skeletonItems}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 5,
  },
  horizontal: {
    flexDirection: 'row',
  },
  skeletonItem: {
    width: 80,
    height: 80,
    backgroundColor: '#E1E9EE',
    borderRadius: 8,
  },
});

export default ImageUploadSkeleton;