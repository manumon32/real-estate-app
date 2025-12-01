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
  // Linking,
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

// ⛔️ Lazy-loading PropertyCard causes jank inside FlatList → use memo instead
import PropertyCard from '@components/PropertyCard';

// Lazy load only heavy non-list UI
const Header = React.lazy(() => import('./Header/Header'));
const HomepageSkelton = React.lazy(
  () => import('@components/SkeltonLoader/HomepageSkelton'),
);
const NoChats = React.lazy(() => import('@components/NoChatFound'));

function HomeScreen({navigation}: any) {
  const listings = useBoundStore(s => s.listings);
  const fetchListings = useBoundStore(s => s.fetchListings);
  const hasMore = useBoundStore(s => s.hasMore);
  const loading = useBoundStore(s => s.loading);
  const triggerRefresh = useBoundStore(s => s.triggerRefresh);
  const setTriggerRefresh = useBoundStore(s => s.setTriggerRefresh);
  const location = useBoundStore(s => s.location);
  const setTriggerRelaod = useBoundStore(s => s.setTriggerRelaod);
  const bearerToken = useBoundStore(s => s.bearerToken);
  const fetchChatListings = useBoundStore(s => s.fetchChatListings);
  const {theme} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  const flatListRef = useRef<FlatList>(null);
  const prevLocationRef = useRef<any>(null);
  const onEndReachedCalledDuringMomentum = useRef(false);

  /* --------------------- BACK PRESS EXIT --------------------- */
  useFocusEffect(
    useCallback(() => {
      let backPressedOnce = false;

      const onBackPress = () => {
        if (backPressedOnce) {
          BackHandler.exitApp();
          return true;
        }
        backPressedOnce = true;
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        setTimeout(() => (backPressedOnce = false), 2000);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  /* --------------------- SOCKET MANAGEMENT --------------------- */
  useEffect(() => {
    if (bearerToken) {
      connectSocket();
    }
    return () => disconnectSocket();
  }, [bearerToken]);

  /* --------------------- PULL TO REFRESH --------------------- */
  useEffect(() => {
    if (triggerRefresh) {
      flatListRef.current?.scrollToOffset({offset: 0, animated: false});
      fetchListings({pageNum: 1});
    }
  }, [triggerRefresh]);

  /* --------------------- LOCATION CHANGE TRIGGER --------------------- */
  useEffect(() => {
    const oldLat = prevLocationRef.current?.lat;
    const newLat = location?.lat;

    if (oldLat && newLat && oldLat !== newLat) {
      setTriggerRelaod();
      flatListRef.current?.scrollToOffset({offset: 0, animated: false});
      fetchListings({pageNum: 1});
    }
    prevLocationRef.current = location;
  }, [location]);

  /* --------------------- APP STATE --------------------- */
  useEffect(() => {
    const sub = AppState.addEventListener('change', next => {
      if (next !== 'active') {
        disconnectSocket();
      } else if (bearerToken) {
        connectSocket();
        fetchChatListings();
      }
    });
    return () => sub.remove();
  }, [bearerToken]);

  /* --------------------- NOTIFICATIONS --------------------- */
  useEffect(() => {
    requestUserPermission();
    const messaging = getMessaging();

    const unsub1 = onMessage(messaging, msg => {
      const d = msg?.data;
      if (d?.type) {
        Toast.show({
          type: 'info',
          text1: d?.title ? String(d.title) : 'Notification',
          text2: d?.message ? String(d.message) : '',
          position: 'top',
          onPress: () => navigateByNotification(d as any),
        });
      }
    });

    const unsub2 = onNotificationOpenedApp(messaging, msg => {
      msg?.data && navigateByNotification(msg.data as any);
    });

    getInitialNotification(messaging).then(msg => {
      msg?.data && navigateByNotification(msg.data as any);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  /* --------------------- MEMOIZED RENDER ITEM --------------------- */
  const renderItem = useCallback(
    ({item}: any) => (
      <PropertyCard items={item} navigation={navigation} arg showLocation />
    ),
    [navigation],
  );

  /* --------------------- HEADER --------------------- */
  const ListHeader = useCallback(() => {
    return <Header navigation={navigation} />;
  }, [navigation]);

  /* --------------------- FOOTER --------------------- */
  const ListFooter = useMemo(() => {
    if (loading) return <HomepageSkelton />;
    if (!loading && listings.length === 0) {
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

  /* --------------------- PAGINATION --------------------- */
  const loadMore = useCallback(() => {
    if (loading || !hasMore || onEndReachedCalledDuringMomentum.current) return;
    onEndReachedCalledDuringMomentum.current = true;
    fetchListings();
  }, [loading, hasMore]);

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: theme.colors.homepageSafeArea}}>
      <StatusBar
        barStyle={isDarkMode ? 'dark-content' : 'dark-content'}
        backgroundColor={theme.colors.homepageSafeArea}
      />

      <FlatList
        ref={flatListRef}
        data={listings}
        renderItem={renderItem}
        keyExtractor={item => item._id?.toString()}
        numColumns={2}
        removeClippedSubviews={true}
        initialNumToRender={12}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={80}
        windowSize={7}
        onMomentumScrollBegin={() =>
          (onEndReachedCalledDuringMomentum.current = false)
        }
        onEndReachedThreshold={0.2}
        onEndReached={loadMore}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={setTriggerRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor:
            listings.length > 0
              ? theme.colors.backgroundHome
              : theme.colors.background,
        }}
      />
    </SafeAreaView>
  );
}

export default React.memo(HomeScreen);
