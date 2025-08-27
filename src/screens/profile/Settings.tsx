/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import CommonHeader from '@components/Header/CommonHeader';
import MenuLink from '@components/MenuLink';
import React from 'react';
import {View, ScrollView, RefreshControl, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import useBoundStore from '@stores/index';
import {logoutAndRedirect} from '../../utils/logoutAndRedirect';
import {SafeAreaView} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';

const Settings = () => {
  const navigation = useNavigation();
  const {logout, fetchUserDetails, userProfileloading} = useBoundStore();
  const version = DeviceInfo.getVersion(); // versionName (e.g. 1.0.3)
  const buildNumber = DeviceInfo.getBuildNumber(); // versionCode (e.g. 12)
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
            icon='information-outline'
            label={'Version ' + version + ' (' + buildNumber + ')'}
            showChevron={false}
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
            showChevron={false}
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
                      await logoutAndRedirect();
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
            showChevron={false}
            // @ts-ignore
            onPress={async () => {
              Alert.alert(
                'Logout from all devices?',
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
            showChevron={false}
            // @ts-ignore
            onPress={async () => {
              Alert.alert(
                'Delete your account?',
                'You will not recieve any messages or notifications until you log in. Are sure want to delete your account?',
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
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
