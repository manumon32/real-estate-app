import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import DetailsScreen from '@screens/details';
import PostAd from '@screens/postAd';
import HomePage from '@screens/home';
import ThreeDModelViewer from '@screens/details/ThreeDModelViewer';
import FavAds from '@screens/FavAds';
import EditProfile from '@screens/profile/EditProfile';
import PrivacyPolicy from '@screens/PrivacyPolicy';
import TermsConditions from '@screens/TermsConditions';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeIndex" component={HomePage} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="ThreeDModelViewer" component={ThreeDModelViewer} />
      <Stack.Screen name="PostAd" component={PostAd} />
      <Stack.Screen name="FavAds" component={FavAds} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
