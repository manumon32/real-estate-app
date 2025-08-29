/* eslint-disable react-native/no-inline-styles */
// import { Fonts } from '@constants/font';
import { Fonts } from '@constants/font';
import { useTheme } from '@theme/ThemeProvider';
import React from 'react';
import {Image, Text} from 'react-native';

interface HeadingTextProps {
  text: string;
}

const EmptyText: React.FC<HeadingTextProps> = ({text}) => {

    const {theme} = useTheme();
  return (
    <>
      <Image
        source={require('@assets/images/noads.png')}
        style={{
          height: 200,
          width: 200,
          alignContent: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
      />
      <Text
        style={{
          textAlign: 'center',
          color: theme.colors.text,
          padding: 12,
          fontWeight: 500,
          fontFamily: Fonts.BOLD,
          top: -30,
        }}>
        {text}
      </Text>
    </>
  );
};

export default EmptyText;
