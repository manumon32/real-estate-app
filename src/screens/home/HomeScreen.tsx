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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@theme/ThemeProvider';
import useBoundStore from '@stores/index';
import {connectSocket, disconnectSocket} from './../../soket';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import {
  navigateByNotification,
  requestUserPermission,
} from '../../firebase/notificationService';

// Lazy loaded components
const Header = React.lazy(() => import('./Header/Header'));
const PropertyCard = React.lazy(() => import('@components/PropertyCard'));
const HomepageSkelton = React.lazy(
  () => import('@components/SkeltonLoader/HomepageSkelton'),
);
const NoChats = React.lazy(() => import('@components/NoChatFound'));

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
  const prevLocationRef = useRef<any>(null);
  const backPressedOnce = useRef(false);
  const flatListRef = useRef<FlatList>(null);
  const onEndReachedCalled = useRef(false); // prevent multiple calls

  /** Double back press exit */
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

  /** Connect socket when logged in */
  useEffect(() => {
    if (bearerToken) {
      connectSocket();
    }
  }, [bearerToken]);

  /** Fetch data when triggered refresh */
  useEffect(() => {
    if (triggerRefresh) {
      flatListRef.current?.scrollToOffset({offset: 0, animated: false});
      fetchListings({pageNum: 1});
    }
  }, [triggerRefresh]);

  /** Load more data for pagination */
  const loadMore = useCallback(() => {
    if (loading || !hasMore || onEndReachedCalled.current) {
      return;
    }
    onEndReachedCalled.current = true;
    fetchListings();
    setTimeout(() => (onEndReachedCalled.current = false), 500); // small debounce
  }, [loading, hasMore]);

  /** Handle location changes */
  useEffect(() => {
    const prevLat = prevLocationRef.current?.lat;
    const newLat = location?.lat;
    if (prevLat && newLat && prevLat !== newLat) {
      setTriggerRelaod();
      flatListRef.current?.scrollToOffset({offset: 0, animated: false});
      fetchListings({pageNum: 1});
    }
    prevLocationRef.current = location;
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
    return () => subscription.remove();
  }, [bearerToken]);

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
          onPress: () => navigateByNotification(data as any),
        });
      }
    });

    const unsubscribeOpenedApp = onNotificationOpenedApp(
      messaging,
      remoteMessage => {
        const data = remoteMessage?.data;
        if (data) {
          navigateByNotification(data as any);
        }
      },
    );

    getInitialNotification(messaging).then(remoteMessage => {
      if (remoteMessage?.data) {
        navigateByNotification(remoteMessage.data as any);
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpenedApp();
    };
  }, [bearerToken]);

  /** Memoized render item */
  const renderAdItem = useCallback(
    ({item}: any) => (
      <PropertyCard items={item} navigation={navigation} arg={true} />
    ),
    [navigation],
  );

  /** Memoized header */
  const MemoHeader = useMemo(
    () => <Header navigation={navigation} />,
    [navigation],
  );

  /** Footer component */
  const ListFooter = useMemo(() => {
    if (loading) {
      return <HomepageSkelton />;
    }
    if (!loading && listings.length <= 0) {
      return (
        <NoChats
          icon="magnify-close"
          color="#9E9E9E"
          title="Its quite here..."
          body="Get out there to start finding great deals."
        />
      );
    }
    return null;
  }, [loading, listings.length]);

  /** Refresh control */
  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={false}
        onRefresh={setTriggerRefresh}
        colors={['#40DABE', '#40DABE', '#227465']}
      />
    ),
    [],
  );

  return (
    <SafeAreaView
      style={{backgroundColor: theme.colors.homepageSafeArea, flex: 1}}>
      <StatusBar
        barStyle={isDarkMode ? 'dark-content' : 'dark-content'}
        backgroundColor={theme.colors.homepageSafeArea}
      />
      <FlatList
        ref={flatListRef}
        data={listings}
        renderItem={renderAdItem}
        keyExtractor={item => item._id}
        numColumns={2}
        ListHeaderComponent={MemoHeader}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: listings.length > 0 ? theme.colors.backgroundHome: theme.colors.background,
          minHeight: 900,
        }}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        refreshControl={refreshControl}
        ListFooterComponent={ListFooter}
      />
    </SafeAreaView>
  );
}

export default HomeScreen;
