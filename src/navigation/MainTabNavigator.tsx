import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '@screens/home/HomeScreen';
import BottomTabBar from '@components/BottomTabBar';
import Chat from '@screens/chat';
import FilterScreen from '@screens/filter/index';
import MyAds from '@screens/MyAds';
import Profile from '@screens/profile';
// import Settings from '@screens/profile/Settings';
// import Notifications from '@screens/profile/Notifications';
// import Communication from '@screens/profile/Communication';
// import PrivacyPolicy from '@screens/PrivacyPolicy';
// import TermsConditions from '@screens/TermsConditions';

export type MainTabParamList = {
  Home: undefined;
  Chat: undefined;
  AddPost: undefined;
  Profile: undefined;
  MyAds: undefined;
  filter:undefined;
  Settings: undefined;
  Notifications: undefined;
  Communication: undefined;
  PrivacyPolicy: undefined;
  TermsConditions: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <BottomTabBar {...props} />}
      backBehavior='initialRoute'
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Chat"
        component={Chat}
      />
      <Tab.Screen name="AddPost" component={HomeScreen} />
      <Tab.Screen
        name="MyAds"
        component={MyAds}
      />
      <Tab.Screen name="Profile" component={Profile} 
        options={{
          headerShown: false,
          headerTitle: 'My Profile',
        }}/>
      <Tab.Screen name="filter" component={FilterScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
