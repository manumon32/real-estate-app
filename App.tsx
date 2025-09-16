import React, {useEffect} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {Linking} from 'react-native';
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
    setVisible,
  } = useBoundStore();

  // ✅ Linking configuration
  const linking = {
    prefixes: [
      'myapp://',
      'https://hotplotz.com',
      'hotplotz://',
    ],
    config: {
      screens: {
        Root: {
          screens: {
            Home: '', // https://hotplotz.com → Home
            Details: 'details/:id', // https://hotplotz.com/details/123 → Details
          },
        },
      },
    },
  };

  // ✅ Ensure we handle links if NavigationContainer misses it
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      console.log('🔗 Incoming link:', event.url);
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was cold-started with a link
    Linking.getInitialURL().then(url => {
      if (url) console.log('🔗 Initial link:', url);
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        theme={DefaultTheme}
        onReady={onNavigationReady}>
        <RootNavigator />

        {/* Modals */}
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
