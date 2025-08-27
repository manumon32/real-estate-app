/* eslint-disable react-native/no-inline-styles */
import CommonHeader from '@components/Header/CommonHeader';
import MenuLink from '@components/MenuLink';
import React, {useState} from 'react';
import {View, ScrollView, RefreshControl} from 'react-native';
import useBoundStore from '@stores/index';
import { SafeAreaView } from 'react-native-safe-area-context';

const Communication = () => {
  const {fetchUserDetails, userProfileloading} = useBoundStore();
  const [updateToggle, setUpdatetoggle] = useState(false);
  const [recomandToggle, setRecomandToggle] = useState(false);
  const [call, setCall] = useState(false);
  return (
    <SafeAreaView style={{backgroundColor: '#F6FCFF', height: '100%'}}>
      <CommonHeader
        title="Communication preferences"
        textColor="#171717"
        backgroundColor={'#F6FCFF'}
        // onBackPress={onBackPress}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 120, padding: 10}}
        refreshControl={
          <RefreshControl
            refreshing={userProfileloading}
            onRefresh={() => {
              fetchUserDetails();
            }}
            colors={['#40DABE', '#40DABE', '#227465']}
          />
        }>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            borderColor: '#EBEBEB',
            borderWidth: 1,
            marginTop: 10,
            margin: 10,
          }}>
          <MenuLink
            label="Email"
            selected={updateToggle}
            showToggle
            showChevron={false}
            toggleDisabled
            onToggle={() => setUpdatetoggle(!updateToggle)}
            // @ts-ignore
            onPress={() => setUpdatetoggle(!updateToggle)}
          />
          <View
            style={{
              backgroundColor: '#EBEBEB',
              borderWidth: 1,
              borderColor: '#EBEBEB',
              width: '90%',
              alignSelf: 'center',
            }}
          />
          <MenuLink
            label="SMS"
            selected={recomandToggle}
            showToggle
            toggleDisabled
            onToggle={() => setRecomandToggle(!recomandToggle)}
            showChevron={false}
            // @ts-ignore
            onPress={() => setRecomandToggle(!recomandToggle)}
          />

          <View
            style={{
              backgroundColor: '#EBEBEB',
              borderWidth: 1,
              borderColor: '#EBEBEB',
              width: '90%',
              alignSelf: 'center',
            }}
          />
          <MenuLink
            label="Call"
            selected={call}
            showToggle
            toggleDisabled
            onToggle={() => setCall(!call)}
            showChevron={false}
            // @ts-ignore
            onPress={() => setCall(!call)}
          />

          <View
            style={{
              backgroundColor: '#EBEBEB',
              borderWidth: 1,
              borderColor: '#EBEBEB',
              width: '90%',
              alignSelf: 'center',
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Communication;
