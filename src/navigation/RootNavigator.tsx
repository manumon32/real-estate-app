import React, { useRef, useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

/** Lazy loaded screens */
const MainTabNavigator = React.lazy(() => import('./MainTabNavigator'));
// const DetailsScreen = React.lazy(() => import('@screens/details'));

import DetailsScreen from '@screens/details';
const PostAd = React.lazy(() => import('@screens/postAd'));
const HomePage = React.lazy(() => import('@screens/home'));
const ThreeDModelViewer = React.lazy(() => import('@screens/details/ThreeDModelViewer'));
const FavAds = React.lazy(() => import('@screens/FavAds'));
const EditProfile = React.lazy(() => import('@screens/profile/EditProfile'));
const Settings = React.lazy(() => import('@screens/profile/Settings'));
const Notifications = React.lazy(() => import('@screens/profile/Notifications'));
const Communication = React.lazy(() => import('@screens/profile/Communication'));
const ReportAd = React.lazy(() => import('@screens/RepotedAds'));
const ManagePlans = React.lazy(() => import('@screens/ManagePlan'));
const ChatDetails = React.lazy(() => import('@screens/chat/Details'));
const VerifyListing = React.lazy(() => import('@screens/VerifyListing'));
const VerifyBank = React.lazy(() => import('@screens/VerifyBank'));
const NotificationList = React.lazy(() => import('@screens/Notifications'));
const Transactions = React.lazy(() => import('@screens/Transactions'));
const HelpSupport = React.lazy(() => import('@screens/profile/HelpSupport'));
const LoanCalculator = React.lazy(() => import('@screens/EmiCalculator'));
const Appointments = React.lazy(() => import('@screens/Appontments'));
const ChatSupport = React.lazy(() => import('@screens/ChatSupport'));
const MapPickerScreen = React.lazy(() => import('@screens/chat/MapPickerScreen'));

const RootNavigator = () => {
  const lastPressRef = useRef(0);

  const preventDoubleNavigation = useCallback(() => {
    const now = Date.now();
    if (now - lastPressRef.current < 500) return true;
    lastPressRef.current = now;
    return false;
  }, []);

  return (
    <React.Suspense fallback={null}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="HomeIndex"
          component={HomePage}
          listeners={{ beforeRemove: e => preventDoubleNavigation() && e.preventDefault() }}
        />

        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          listeners={{ beforeRemove: e => preventDoubleNavigation() && e.preventDefault() }}
        />

        {/* Other screens */}
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="PostAd" component={PostAd} />
        <Stack.Screen name="FavAds" component={FavAds} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Communication" component={Communication} />
        <Stack.Screen name="ReportAd" component={ReportAd} />
        <Stack.Screen name="ManagePlans" component={ManagePlans} />
        <Stack.Screen name="ChatDetails" component={ChatDetails} />
        <Stack.Screen name="ThreeDModelViewer" component={ThreeDModelViewer} />
        <Stack.Screen name="VerifyListing" component={VerifyListing} />
        <Stack.Screen name="VerifyBankList" component={VerifyBank} />
        <Stack.Screen name="NotificationList" component={NotificationList} />
        <Stack.Screen name="LoanCalculator" component={LoanCalculator} />
        <Stack.Screen name="Appointments" component={Appointments} />
        <Stack.Screen name="HelpSupport" component={HelpSupport} />
        <Stack.Screen name="Transactions" component={Transactions} />
        <Stack.Screen name="ChatSupport" component={ChatSupport} />
        <Stack.Screen name="MapPickerScreen" component={MapPickerScreen} />
      </Stack.Navigator>
    </React.Suspense>
  );
};

export default React.memo(RootNavigator);
