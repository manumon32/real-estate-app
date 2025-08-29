/* eslint-disable react-native/no-inline-styles */
import CommonHeader from '@components/Header/CommonHeader';
import MenuLink from '@components/MenuLink';
import React, {useState} from 'react';
import {View, ScrollView, RefreshControl} from 'react-native';
import useBoundStore from '@stores/index';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@theme/ThemeProvider';

const Notifications = () => {
  const {fetchUserDetails, userProfileloading} = useBoundStore();
  const [updateToggle, setUpdatetoggle] = useState(false);
  const [recomandToggle, setRecomandToggle] = useState(false);
    const {theme} = useTheme();
  return (
    <SafeAreaView style={{backgroundColor: theme.colors.background, height: '100%'}}>
      <CommonHeader
        title="Notifications"
        textColor="#171717"
        backgroundColor={theme.colors.background}
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
            backgroundColor: theme.colors.background,
            borderRadius: 16,
            borderColor: '#EBEBEB',
            borderWidth: 1,
            marginTop: 10,
            margin: 10,
          }}>
          <MenuLink
            label="Receive Updates"
            selected={updateToggle}
            showToggle
            onToggle={() => setUpdatetoggle(!updateToggle)}
            showChevron={false}
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
            label="Receive Recomandations"
            selected={recomandToggle}
            showToggle
            onToggle={() => setRecomandToggle(!recomandToggle)}
            showChevron={false}
            // @ts-ignore
            onPress={() => setRecomandToggle(!recomandToggle)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
