/* eslint-disable react-native/no-inline-styles */
// import CommonHeader from '@components/Header/CommonHeader';
import React from 'react';
import {SafeAreaView} from 'react-native';
import PostAdContainer from './stepper';

const PostAd = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor:'#fff'}}>
      <PostAdContainer />
    </SafeAreaView>
  );
};

export default PostAd;
