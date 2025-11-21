import React, {useRef} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const MainTabNavigator = React.lazy(() => import('./MainTabNavigator'));

const DetailsScreen = React.lazy(() => import('@screens/details'));
const PostAd = React.lazy(() => import('@screens/postAd'));
const HomePage = React.lazy(() => import('@screens/home'));
const ThreeDModelViewer = React.lazy(
  () => import('@screens/details/ThreeDModelViewer'),
);
const FavAds = React.lazy(() => import('@screens/FavAds'));
const EditProfile = React.lazy(() => import('@screens/profile/EditProfile'));
const PrivacyPolicy = React.lazy(() => import('@screens/PrivacyPolicy'));
const TermsConditions = React.lazy(() => import('@screens/TermsConditions'));
const Settings = React.lazy(() => import('@screens/profile/Settings'));
const Notifications = React.lazy(
  () => import('@screens/profile/Notifications'),
);
const Communication = React.lazy(
  () => import('@screens/profile/Communication'),
);
const ReportAd = React.lazy(() => import('@screens/RepotedAds'));
const ManagePlans = React.lazy(() => import('@screens/ManagePlan'));
const ChatDetails = React.lazy(() => import('@screens/chat/Details'));
const Transactions = React.lazy(() => import('@screens/Transactions'));
const HelpSupport = React.lazy(() => import('@screens/profile/HelpSupport'));
const VerifyListing = React.lazy(() => import('@screens/VerifyListing'));
const NotificationList = React.lazy(() => import('@screens/Notifications'));
const VerifyBank = React.lazy(() => import('@screens/VerifyBank'));
const LoanCalculator = React.lazy(() => import('@screens/EmiCalculator'));
const Appointments = React.lazy(() => import('@screens/Appontments'));
const ChatSupport = React.lazy(() => import('@screens/ChatSupport'));
const MapPickerScreen = React.lazy(
  () => import('@screens/chat/MapPickerScreen'),
);

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  // ⛔ Prevent double stack navigations
  const lastPressRef = useRef(0);

  const preventDoubleNavigation = () => {
    const now = Date.now();
    if (now - lastPressRef.current < 600) {
      return true;
    }
    lastPressRef.current = now;
    return false;
  };

  return (
    <React.Suspense fallback={null}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/** HOME INDEX */}
        <Stack.Screen
          name="HomeIndex"
          component={HomePage}
          listeners={{
            beforeRemove: e => {
              if (preventDoubleNavigation()) e.preventDefault();
            },
          }}
        />

        {/** MAIN TAB NAVIGATION */}
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          listeners={{
            beforeRemove: e => {
              if (preventDoubleNavigation()) e.preventDefault();
            },
          }}
        />

        {/** SCREENS */}
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
    </React.Suspense>
  );
};

export default RootNavigator;
