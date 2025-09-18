/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useMemo} from 'react';
import {
  StatusBar,
  useColorScheme,
  FlatList,
  RefreshControl,
  BackHandler,
  ToastAndroid,
  AppState,
  Linking,
  Dimensions,
} from 'react-native';
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@theme/ThemeProvider';
import useBoundStore from '@stores/index';
import {connectSocket, disconnectSocket} from './../../soket';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// Lazy loaded components
const Header = React.lazy(() => import('./Header/Header'));
const PropertyCard = React.lazy(() => import('@components/PropertyCard'));
const HomepageSkelton = React.lazy(
  () => import('@components/SkeltonLoader/HomepageSkelton'),
);
const NoChats = React.lazy(() => import('@components/NoChatFound'));

import {
  navigateByNotification,
  requestUserPermission,
} from '../../firebase/notificationService';

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
  const backPressedOnce = useRef(false);
  const screenHeight = Dimensions.get('window').height;


  /** Load more with useCallback to avoid re-creating on each render */
  const loadMore = useCallback(() => {
    console.log('values', 'loadMore', loading, hasMore);
    if (loading || !hasMore) {
      return;
    }
    fetchData();
  }, [loading, hasMore]);

  /** Double back press exit with useCallback */
  const useDoubleBackExit = () => {
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

  /** Render each property using useCallback to memoize the function */
  const renderAdItem = useCallback(
    ({item}: any) => (
      <PropertyCard items={item} navigation={navigation} arg={true} />
    ),
    [navigation],
  );

  /** Memoized header component to prevent unnecessary rerenders */
  const MemoHeader = useMemo(() => {
    return <Header navigation={navigation} />;
  }, [navigation]);

  /** Connect socket on login */
  useEffect(() => {
    if (bearerToken) {
      connectSocket();
    }
  }, [bearerToken]);

  /** Refresh listings when triggered */
  useEffect(() => {
    if (triggerRefresh) {
      fetchData();
    }
  }, [triggerRefresh]);

  /** Fetch data once */
  const fetchData = useCallback(() => {
    console.log('values', 'renderd');
    if (!loading) {
      fetchListings();
    }
  }, [loading]);

  /** Handle location changes */
  useEffect(() => {
    if (
      (!prevFiltersRef.current?.lat && location.lat) ||
      (prevFiltersRef.current?.lat &&
        prevFiltersRef.current?.lat !== location.lat)
    ) {
      setTriggerRelaod();
      setTimeout(() => {
        if (!loading) {
          fetchData();
        }
      }, 100);
    }
    prevFiltersRef.current = location;
    if (!loading) {
      fetchData();
    }
  }, [location]);

  /** Handle app state changes */
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
  const handleDeepLink = useCallback(
    (event: {url: string}) => {
      const url = event.url;
      const match = url.match(/details\/([^/?#]+)/);
      if (match) {
        const propertyId = match[1];
        navigation.navigate('Details', {items: {_id: propertyId}});
      }
    },
    [navigation],
  );

  useEffect(() => {
    const sub = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({url});
      }
    });
    return () => sub.remove();
  }, [handleDeepLink]);

  /** Firebase notification handlers */
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
          onPress: () => navigateByNotification(data as any as INotification),
        });
      }
    });

    const unsubscribeOpenedApp = onNotificationOpenedApp(
      messaging,
      remoteMessage => {
        const data = remoteMessage?.data;
        if (data) {
          navigateByNotification(data as any as INotification);
        }
      },
    );

    getInitialNotification(messaging).then(remoteMessage => {
      if (remoteMessage) {
        const data = remoteMessage?.data;
        if (data) {
          navigateByNotification(data as any as INotification);
        }
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpenedApp();
    };
  }, [bearerToken]);

  /** Memoize the footer component */
  const ListFooter = useMemo(() => {
    if (loading) {
      return <HomepageSkelton />;
    }
    if (listings.length <= 0) {
      return (
        <NoChats
          icon="magnify-close"
          color="#9E9E9E"
          title="Oops.. we cannot find anything for this search."
        />
      );
    }
    return null;
  }, [loading, listings.length]);

  /** Memoize refresh control to avoid rerenders */
  const refreshControl = useMemo(() => {
    return (
      <RefreshControl
        refreshing={false}
        onRefresh={() => setTriggerRefresh()}
        colors={['#40DABE', '#40DABE', '#227465']}
      />
    );
  }, []);
  console.log('values', hasMore, loading);

  return (
    <SafeAreaView style={{backgroundColor: theme.colors.homepageSafeArea}}>
      <StatusBar
        barStyle={isDarkMode ? 'dark-content' : 'dark-content'}
        backgroundColor={theme.colors.homepageSafeArea}
      />
      <FlatList
        data={listings}
        renderItem={renderAdItem}
        keyExtractor={item => item._id}
        numColumns={2}
        ListHeaderComponent={MemoHeader}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: theme.colors.backgroundHome,
          minHeight: 900,
        }}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        refreshControl={refreshControl}
        ListFooterComponent={ListFooter}
        onContentSizeChange={(w, h) => {
          console.log('values', 'ividea')
          // If list shorter than screen and hasMore, load more
          if (h < screenHeight && hasMore && !loading) {
            loadMore();
          }
        }}
      />
    </SafeAreaView>
  );
}

export default HomeScreen;
