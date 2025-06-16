import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '@screens/home/HomeScreen';
import BottomTabBar from '@components/BottomTabBar';
import Chat from '@screens/chat';
import FilterScreen from '@screens/filter/index';
import MyAds from '@screens/MyAds';
import Profile from '@screens/profile';

export type MainTabParamList = {
  Home: undefined;
  Chat: undefined;
  AddPost: undefined;
  Profile: undefined;
  MyAds: undefined;
  filter: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          headerShown: true,
          headerTitle: 'Chats',
        }}
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
