/* eslint-disable react-native/no-inline-styles */
// import { Fonts } from '@constants/font';
import React from 'react';
import {Text, TextStyle} from 'react-native';

interface HeadingTextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const HeadingText: React.FC<HeadingTextProps> = ({children, style}) => {
  return (
    <Text
      style={[
        {
          color: '#171717',
          // fontFamily: Fonts.BOLD,
          fontWeight:900,
          fontSize: 20,
        },
        style,
      ]}>
      {children}
    </Text>
  );
};

export default HeadingText;
