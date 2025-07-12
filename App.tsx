import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import messaging from '@react-native-firebase/messaging';
import {ThemeProvider} from '@theme/ThemeProvider';
import RootNavigator from '@navigation/RootNavigator';
import CommonLocationModal from '@components/Modal/LocationSearchModal';
import useBoundStore from '@stores/index';
import Toast from 'react-native-toast-message';
import {ToastConfig} from './src/config/ToastConfig';
import NetworkStatus from '@components/NetworkStatus';
import {navigationRef} from '@navigation/RootNavigation';
import {onNavigationReady} from './src/firebase/notificationService';

export default function App() {
  const {
    locationModalvisible,
    setlocationModalVisible,
    setLocation,
    locationHistory,
  } = useBoundStore();

  // // Handle background messages using setBackgroundMessageHandler
  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   console.log('Message handled in the background!', remoteMessage);
  // });

  const linking = {
    prefixes: ['myapp://', 'https://myapp.com'],
    config: {
      screens: {
        Home: 'HomeIndex',
      },
    },
  };

  return (
    <ThemeProvider>
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        onReady={onNavigationReady}>
        <RootNavigator />

        <CommonLocationModal
          visible={locationModalvisible}
          onClose={() => setlocationModalVisible()}
          onSelectLocation={setLocation}
          locationHistory={locationHistory}
        />
        <Toast config={ToastConfig} />
        <NetworkStatus />
      </NavigationContainer>
    </ThemeProvider>
  );
}
