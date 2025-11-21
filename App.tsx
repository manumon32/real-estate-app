import React, {useEffect} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {ThemeProvider} from '@theme/ThemeProvider';
import RootNavigator from '@navigation/RootNavigator';
import CommonLocationModal from '@components/Modal/LocationSearchModal';
import useBoundStore from '@stores/index';
import {getMessaging, onMessage} from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import {ToastConfig} from './src/config/ToastConfig';
import NetworkStatus from '@components/NetworkStatus';
import {navigationRef} from '@navigation/RootNavigation';
import {
  navigateByNotification,
  onNavigationReady,
  requestUserPermission,
} from './src/firebase/notificationService';
import GlobalSearchModal from '@components/Modal/GlobalSearchModal';
import LoginModal from '@components/Modal/LoginModal';
import {getNavigationMode} from 'react-native-navigation-mode';

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
    setNavigationMode,
  } = useBoundStore();

  // ✅ Linking configuration
  const linking = {
    prefixes: ['myapp://', 'https://hotplotz.com', 'hotplotz://'],
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

  const fetchNavigationMode = async () => {
    const navInfo = await getNavigationMode();
    setNavigationMode(navInfo.type);
  };
  useEffect(() => {
    fetchNavigationMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // no dependencies → runs only once on mount

  useEffect(() => {
    requestUserPermission();
    const messaging = getMessaging();

    const unsubscribeForeground = onMessage(messaging, remoteMessage => {
      const data = remoteMessage?.data;
      if (data?.type) {
        Toast.show({
          type: 'info',
          text1: data?.title ? String(data.title) : 'Notification',
          text2: data?.message ? String(data.message) : '',
          position: 'top',
          onPress: () => navigateByNotification(data as any),
        });
      }
    });

    return () => {
      unsubscribeForeground();
    };
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        theme={DefaultTheme}
        // @ts-ignore
        testID="root-navigator"
        onReady={onNavigationReady}>
        <RootNavigator />

        <Toast config={ToastConfig} />
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
        <NetworkStatus />
      </NavigationContainer>
    </ThemeProvider>
  );
}
