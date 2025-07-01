/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import CommonHeader from '@components/Header/CommonHeader';
import MenuLink from '@components/MenuLink';
import React from 'react';
import {View, SafeAreaView, ScrollView, RefreshControl, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import useBoundStore from '@stores/index';

const Settings = () => {
  const navigation = useNavigation();
  const {logout, fetchUserDetails, userProfileloading} = useBoundStore();
  return (
    <SafeAreaView style={{backgroundColor: '#F6FCFF', height: '100%'}}>
      <CommonHeader
        title="Settings"
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
            icon="heart-outline"
            label="Notifications"
            // value={12}
            // @ts-ignore
            onPress={() => navigation.navigate('Notifications')}
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
            icon="email"
            label="Communication preferences"
            // @ts-ignore
            onPress={() => navigation.navigate('Communication')}
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
            icon="logout"
            label="Logout"
            // @ts-ignore
            onPress={async () => {
              Alert.alert(
                'Logout?',
                'You will not recieve any messages or notifications until you log in. Are sure want to log out?',
                [
                  {text: 'Cancel', style: 'cancel'},
                  {
                    text: 'Log out',
                    onPress: async () => {
                      await logout();
                      // @ts-ignore
                      navigation.reset({index: 0, routes: [{name: 'Main'}]});
                    },
                  },
                ],
              );
            }}
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
            icon="logout"
            label="Logout from all devices"
            // @ts-ignore
            onPress={async () => {
              Alert.alert(
                'Logout?',
                'You will not recieve any messages or notifications until you log in. Are sure want to log out?',
                [
                  {text: 'Cancel', style: 'cancel'},
                  {
                    text: 'Log out',
                    onPress: async () => {
                      await logout();
                      // @ts-ignore
                      navigation.reset({index: 0, routes: [{name: 'Main'}]});
                    },
                  },
                ],
              );
            }}
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
            icon="delete"
            label="Delete account"
            // @ts-ignore
            // onPress={() => navigation.navigate('PrivacyPolicy')}
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

export default Settings;
