/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef} from 'react';
import {
  StatusBar,
  useColorScheme,
  FlatList,
  // ActivityIndicator,
  RefreshControl,
  BackHandler,
  ToastAndroid,
  AppState,
  Linking,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

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

function App({navigation}: any): React.JSX.Element {
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
  const prevFiltersRef = useRef<string[] | null>(null);

  const loadMore = () => {
    if (loading || !hasMore) return;
    fetchListings();
  };
  const useDoubleBackExit = () => {
    const backPressedOnce = useRef(false);

    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          if (backPressedOnce.current) {
            BackHandler.exitApp(); // ✅ Exit the app
            return true;
          }

          backPressedOnce.current = true;
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);

          setTimeout(() => {
            backPressedOnce.current = false;
          }, 2000);

          return true; // Prevent default back behavior
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

  const renderAdItem = useCallback(
    (items: any) => {
      return (
        <PropertyCard items={items.item} navigation={navigation} arg={'home'} />
      );
    },
    [navigation],
  );

  useEffect(() => {
    bearerToken && connectSocket();
  }, [bearerToken]);

  useEffect(() => {
    triggerRefresh && fetchListings();
  }, [triggerRefresh]);

  const fetchData = async () => {
    !loading && fetchListings();
  };

  useEffect(() => {
    if (
      // @ts-ignore
      (!prevFiltersRef.current?.lat && location.lat) ||
      // @ts-ignore
      (prevFiltersRef.current?.lat &&
        // @ts-ignore
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
      disconnectSocket(); // Cleanup
    };
  }, [bearerToken]);

  const handleDeepLink = (event: {url: string}) => {
    const url = event.url; // e.g., myapp://property/12345
    const match = url.match(/details\/([^/?#]+)/);
    if (match) {
      // const propertyId = match[1];
      // navigation.navigate('Details', {items: {_id: propertyId}});
    }
  };

  useEffect(() => {
    // Listen when app is already open
    const sub = Linking.addEventListener('url', handleDeepLink);

    // Also handle when app is opened from a killed state
    Linking.getInitialURL().then(url => {
      if (url) {
        // Alert.alert(url)
        // setDeepLink({url});
      }
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    requestUserPermission();

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      const data = remoteMessage?.data;
      console.log('remoteMessage 1', remoteMessage);
      if (data?.type) {
        Toast.show({
          type: 'info',
          text1: data?.title ? String(data.title) : 'You have a notification',
          text2: data?.message ? String(data.message) : 'Tes ',
          position: 'top',
          onPress: () => {
            navigateByNotification(data as any as INotification);
          },
        });
      }
    });

    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log('remoteMessage 2', remoteMessage);
        const data = remoteMessage?.data;
        navigateByNotification(data as any as INotification);
      },
    );

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('remoteMessage 3', remoteMessage);
      const data = remoteMessage?.data;
      navigateByNotification(data as any as INotification);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('remoteMessage 4', remoteMessage);
        const data = remoteMessage?.data;
        navigateByNotification(data as any as INotification);
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
        keyboardShouldPersistTaps="handled"
        refreshing={true}
        keyExtractor={item => item._id}
        numColumns={2}
        ListHeaderComponent={<Header navigation={navigation} />}
        centerContent={true}
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
            onRefresh={() => {
              setTriggerRefresh();
            }}
            colors={['#40DABE', '#40DABE', '#227465']}
          />
        }
        ListFooterComponent={
          hasMore || loading ? (
            <HomepageSkelton />
          ) : listings.length <= 0 ? (
            <>
              <NoChats
                icon="magnify-close"
                color="#9E9E9E"
                title="Oops.. we cannot find anything for this search."
              />
              {/* <Image
                source={require('@assets/images/noads.png')}
                style={{
                  height: 200,
                  width: 200,
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
              /> */}
            </>
          ) : (
            <></>
          )
        }
      />
    </SafeAreaView>
  );
}

export default App;
