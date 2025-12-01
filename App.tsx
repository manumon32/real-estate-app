import React, {useEffect, useMemo} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {ThemeProvider} from '@theme/ThemeProvider';
import useBoundStore from '@stores/index';
import Toast from 'react-native-toast-message';
import {ToastConfig} from './src/config/ToastConfig';
import {navigationRef} from '@navigation/RootNavigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {
  navigateByNotification,
  onNavigationReady,
  requestUserPermission,
} from './src/firebase/notificationService';

import {getMessaging, onMessage} from '@react-native-firebase/messaging';
import {getNavigationMode} from 'react-native-navigation-mode';
const LoginModal = React.lazy(() => import('@components/Modal/LoginModal'));
const NetworkStatus = React.lazy(() => import('@components/NetworkStatus'));

// Lazy-load entire RootNavigator
const RootNavigator = React.lazy(() => import('@navigation/RootNavigator'));

function App() {
  const visible = useBoundStore(s => s.visible);
  const setVisible = useBoundStore(s => s.setVisible);
  const setNavigationMode = useBoundStore(s => s.setNavigationMode);

  /** Fetch navigation mode ONCE */
  useEffect(() => {
    getNavigationMode().then(navInfo => setNavigationMode(navInfo.type));
  }, [setNavigationMode]);

  /** FCM Foreground listener */
  useEffect(() => {
    requestUserPermission();
    const messaging = getMessaging();

    const unsubscribeForeground = onMessage(messaging, remoteMessage => {
      const data = remoteMessage?.data;
      if (!data?.type) return;

      Toast.show({
        type: 'info',
        text1: data?.title ? String(data.title) : 'Notification',
        text2: data?.message ? String(data.message) : '',
        position: 'top',
        onPress: () => navigateByNotification(data as any),
      });
    });

    return unsubscribeForeground;
  }, []);

  /** Memoized linking config (prevents re-renders) */
  const linking = useMemo(
    () => ({
      prefixes: ['myapp://', 'https://hotplotz.com', 'hotplotz://'],
      config: {
        screens: {
          Root: {
            screens: {
              Home: '',
              Details: 'details/:id',
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <ThemeProvider>
      <React.Suspense fallback={null}>
        <GestureHandlerRootView style={{flex: 1}}>
          <NavigationContainer
            ref={navigationRef}
            linking={linking}
            theme={DefaultTheme}
            onReady={onNavigationReady}>
            <RootNavigator />
          </NavigationContainer>
          <Toast config={ToastConfig} />
          {visible && <LoginModal visible onClose={setVisible} />}
          <NetworkStatus />
        </GestureHandlerRootView>
      </React.Suspense>
    </ThemeProvider>
  );
}

export default React.memo(App);
