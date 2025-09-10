/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef} from 'react';
import {
  StatusBar,
  useColorScheme,
  FlatList,
  RefreshControl,
  BackHandler,
  ToastAndroid,
  AppState,
  Linking,
} from 'react-native';
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';

import {SafeAreaView} from 'react-native-safe-area-context';
import {
  navigateByNotification,
  requestUserPermission,
} from '../../firebase/notificationService';
import {useTheme} from '@theme/ThemeProvider';
import Header from './Header/Header';
import PropertyCard from '@components/PropertyCard';
import useBoundStore from '@stores/index';
import {connectSocket, disconnectSocket} from './../../soket';
import HomepageSkelton from '@components/SkeltonLoader/HomepageSkelton';
import {useFocusEffect} from '@react-navigation/native';
import NoChats from '@components/NoChatFound';
import Toast from 'react-native-toast-message';

export interface INotification {
  userId: string;
  type: 'message' | 'system' | 'property' | 'alert' | 'reminder';
  title: string;
  message: string;
  entityId?: string;
  entityType?: 'chatRoom' | 'property' | 'user' | 'transaction';
  read: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
  notificationId: string;
}

function HomeScreen({navigation}: any): React.JSX.Element {
  const {
    listings,
    fetchListings,
    hasMore,
    loading,
    triggerRefresh,
    setTriggerRefresh,
    location,
    setTriggerRelaod,
    bearerToken,
    fetchChatListings,
  } = useBoundStore();

  const {theme} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const prevFiltersRef = useRef<any>(null);

  /** Load more on scroll */
  const loadMore = () => {
    if (loading || !hasMore) return;
    fetchListings();
  };

  /** Double back press exit */
  const useDoubleBackExit = () => {
    const backPressedOnce = useRef(false);

    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          if (backPressedOnce.current) {
            BackHandler.exitApp();
            return true;
          }

          backPressedOnce.current = true;
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);

          setTimeout(() => {
            backPressedOnce.current = false;
          }, 2000);

          return true;
        };

        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          onBackPress,
        );

        return () => backHandler.remove();
      }, []),
    );
  };
  useDoubleBackExit();

  /** Render each property */
  const renderAdItem = useCallback(
    (items: any) => (
      <PropertyCard items={items.item} navigation={navigation} arg={'home'} />
    ),
    [navigation],
  );

  /** Connect socket if logged in */
  useEffect(() => {
    bearerToken && connectSocket();
  }, [bearerToken]);

  /** Refresh listings */
  useEffect(() => {
    triggerRefresh && fetchListings();
  }, [triggerRefresh]);

  const fetchData = async () => {
    !loading && fetchListings();
  };

  /** Reload when location changes */
  useEffect(() => {
    if (
      (!prevFiltersRef.current?.lat && location.lat) ||
      (prevFiltersRef.current?.lat &&
        prevFiltersRef.current?.lat !== location.lat)
    ) {
      setTriggerRelaod();
      setTimeout(() => {
        !loading && fetchListings();
      }, 100);
    }
    prevFiltersRef.current = location;
    !loading && fetchData();
  }, [location]);

  /** Socket cleanup on app state change */
  useEffect(() => {
    const handleAppStateChange = (nextState: string) => {
      if (nextState === 'background' || nextState === 'inactive') {
        disconnectSocket();
      }

      if (nextState === 'active' && bearerToken) {
        connectSocket();
        fetchChatListings();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
      disconnectSocket();
    };
  }, [bearerToken]);

  /** Handle deep links */
  const handleDeepLink = (event: {url: string}) => {
    const url = event.url; // e.g., myapp://details/12345
    const match = url.match(/details\/([^/?#]+)/);
    if (match) {
      const propertyId = match[1];
      navigation.navigate('Details', {items: {_id: propertyId}});
    }
  };

  useEffect(() => {
    const sub = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({url});
      }
    });

    return () => sub.remove();
  }, []);

  /** Firebase Notification Setup */
  useEffect(() => {
    requestUserPermission();
    const messaging = getMessaging();

    // Foreground notifications
    const unsubscribeForeground = onMessage(messaging, async remoteMessage => {
      const data = remoteMessage?.data;
      console.log('remoteMessage (foreground):', remoteMessage);
      if (data?.type) {
        Toast.show({
          type: 'info',
          text1: data?.title ? String(data.title) : 'Notification',
          text2: data?.message ? String(data.message) : '',
          position: 'top',
          onPress: () => {
            navigateByNotification(data as any as INotification);
          },
        });
      }
    });

    // When app opened from background
    const unsubscribeOpenedApp = onNotificationOpenedApp(
      messaging,
      remoteMessage => {
        console.log('remoteMessage (openedApp):', remoteMessage);
        const data = remoteMessage?.data;
        if (data) navigateByNotification(data as any as INotification);
      },
    );

    // When app opened from killed state
    getInitialNotification(messaging).then(remoteMessage => {
      if (remoteMessage) {
        console.log('remoteMessage (initialNotification):', remoteMessage);
        const data = remoteMessage?.data;
        if (data) navigateByNotification(data as any as INotification);
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpenedApp();
    };
  }, [bearerToken]);

  return (
    <SafeAreaView style={{backgroundColor: theme.colors.homepageSafeArea}}>
      <StatusBar
        barStyle={isDarkMode ? 'dark-content' : 'dark-content'}
        backgroundColor={theme.colors.backgroundPalette[0]}
      />
      <FlatList
        data={listings}
        renderItem={renderAdItem}
        keyExtractor={item => item._id}
        numColumns={2}
        ListHeaderComponent={<Header navigation={navigation} />}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: theme.colors.backgroundHome,
          minHeight: 900,
        }}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => setTriggerRefresh()}
            colors={['#40DABE', '#40DABE', '#227465']}
          />
        }
        ListFooterComponent={
          hasMore || loading ? (
            <HomepageSkelton />
          ) : listings.length <= 0 ? (
            <NoChats
              icon="magnify-close"
              color="#9E9E9E"
              title="Oops.. we cannot find anything for this search."
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

export default HomeScreen;
