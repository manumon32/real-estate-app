import React, {useMemo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BottomTabBar from '@components/BottomTabBar';

// 🚀 Lazy load screens (improves performance)
const HomeScreen = React.lazy(() => import('@screens/home/HomeScreen'));
const ChatScreen = React.lazy(() => import('@screens/chat'));
const PostAdScreen = React.lazy(() => import('@screens/postAd'));
const MyAdsScreen = React.lazy(() => import('@screens/MyAds'));
const ProfileScreen = React.lazy(() => import('@screens/profile'));
const FilterScreen = React.lazy(() => import('@screens/filter'));

export type MainTabParamList = {
  Home: undefined;
  Chat: undefined;
  AddPost: undefined;
  MyAds: undefined;
  Profile: undefined;
  Filter: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  // Memoize screenOptions to avoid remounting
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      lazy: true, // RN Navigation lazy loading
    }),
    [],
  );

  return (
    <React.Suspense fallback={null}>
      <Tab.Navigator
        screenOptions={screenOptions}
        backBehavior="initialRoute"
        tabBar={props => <BottomTabBar {...props} />}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="AddPost" component={PostAdScreen} />
        <Tab.Screen name="MyAds" component={MyAdsScreen} />

        <Tab.Screen name="Profile" component={ProfileScreen} />
        {/* @ts-ignore */}
        <Tab.Screen name="filter" component={FilterScreen} />
      </Tab.Navigator>
    </React.Suspense>
  );
};

export default MainTabNavigator;
