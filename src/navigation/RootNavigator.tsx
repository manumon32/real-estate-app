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
import Settings from '@screens/profile/Settings';
import Notifications from '@screens/profile/Notifications';
import Communication from '@screens/profile/Communication';
import ReportAd from '@screens/RepotedAds';
import ManagePlans from '@screens/ManagePlan';
import ChatDetails from '@screens/chat/Details';
import Transactions from '@screens/Transactions';
import HelpSupport from '@screens/profile/HelpSupport';
import VerifyListing from '@screens/VerifyListing';
import NotificationList from '@screens/Notifications';
import VerifyBank from '@screens/VerifyBank';
import LoanCalculator from '@screens/EmiCalculator';
import Appointments from '@screens/Appontments';
import ChatSupport from '@screens/ChatSupport';
import MapPickerScreen from '@screens/chat/MapPickerScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeIndex" component={HomePage} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="LoanCalculator" component={LoanCalculator} />
      <Stack.Screen name="ChatSupport" component={ChatSupport} />
      <Stack.Screen name="ThreeDModelViewer" component={ThreeDModelViewer} />
      <Stack.Screen name="PostAd" component={PostAd} />
      <Stack.Screen name="FavAds" component={FavAds} />
      <Stack.Screen name="Appointments" component={Appointments} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Communication" component={Communication} />
      <Stack.Screen name="ReportAd" component={ReportAd} />
      <Stack.Screen name="ManagePlans" component={ManagePlans} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} />
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="HelpSupport" component={HelpSupport} />
      <Stack.Screen name="ChatDetails" component={ChatDetails} />
      <Stack.Screen name="MapPickerScreen" component={MapPickerScreen} />
      <Stack.Screen name="VerifyListing" component={VerifyListing} />
      <Stack.Screen name="VerifyBankList" component={VerifyBank} />
      <Stack.Screen name="NotificationList" component={NotificationList} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
