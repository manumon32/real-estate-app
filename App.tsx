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
import GlobalSearchModal from '@components/Modal/GlobalSearchModal';
import LoginModal from '@components/Modal/LoginModal';

export default function App() {
  const {
    locationModalvisible,
    setlocationModalVisible,
    globalModalvisible,
    setGlobalModalVisible, 
    setLocation,
    locationHistory,
    visible,
    setVisible
  } = useBoundStore();

  // // Handle background messages using setBackgroundMessageHandler
  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   console.log('Message handled in the background!', remoteMessage);
  // });

  const linking = {
    prefixes: [
      'myapp://', // custom scheme
      'https://hotplotz.com', // universal link
    ],
    config: {
      screens: {
        Home: 'HomeIndex',
        Details: 'details/:id',
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

        <GlobalSearchModal
          visible={globalModalvisible}
          onClose={() => setGlobalModalVisible()}
          onSelectLocation={setLocation}
          locationHistory={locationHistory}
        />

        <LoginModal visible={visible} onClose={() => setVisible()} />
        <Toast config={ToastConfig} />
        <NetworkStatus />
      </NavigationContainer>
    </ThemeProvider>
  );
}
