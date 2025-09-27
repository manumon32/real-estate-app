/* eslint-disable react-native/no-inline-styles */
import useBoundStore from '@stores/index';
import React from 'react';
import {Platform, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  floating?: boolean; // makes the footer slightly elevated
};

export default function SafeFooter({children, style}: Props) {
  const insets = useSafeAreaInsets();
  const {navigationMode} = useBoundStore();
  const isGestureMode = navigationMode === 'gesture';
  const androIdDeviceHeight =
    navigationMode === 'gesture' ? 60 : navigationMode === '2_button' ? 75 : 100;
  const bottomPadding =
    navigationMode === '2_button'
      ? Math.max(insets.bottom, 0)
      : Math.max(insets.bottom, 12);

  return (
    <View
      style={[
        style,
        {
          paddingBottom: isGestureMode ? 0 : bottomPadding,
          height: Platform.OS === 'ios' ? 60 : androIdDeviceHeight,
        },
      ]}>
      {children}
    </View>
  );
}
