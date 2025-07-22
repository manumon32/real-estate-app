/* eslint-disable react-native/no-inline-styles */
// import { Fonts } from '@constants/font';
import { Fonts } from '@constants/font';
import React from 'react';
import {Image, Text} from 'react-native';

interface HeadingTextProps {
  text: string;
}

const EmptyText: React.FC<HeadingTextProps> = ({text}) => {
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
          color: '#000',
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
