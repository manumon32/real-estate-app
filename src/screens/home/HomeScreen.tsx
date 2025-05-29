/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useMemo, useState} from 'react';
import {
  StatusBar,
  useColorScheme,
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '@theme/ThemeProvider';
import Header from './Header/Header';
import PropertyCard from '@components/PropertyCard';
import useBoundStore from '@stores/index';

function App({navigation}: any): React.JSX.Element {
  const {listings, clientId, token} = useBoundStore();
  const {theme} = useTheme();

  const isDarkMode = useColorScheme() === 'dark';
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const TOTAL_PRODUCTS = 1000;
  const BATCH_SIZE = 20;

  const products = useMemo(() => {
    return Array.from({length: visibleCount}, (_, i) => ({
      id: i.toString(),
      title: `Property available in ${i + 1}`,
      price: `$${(i + 1) * 100}`,
      image: 'https://via.placeholder.com/150',
      featured: i === 0 || i === 1, // Only first two are featured
    }));
  }, [visibleCount]);
  const loadMore = () => {
    if (loading || visibleCount >= TOTAL_PRODUCTS) return;

    setLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + BATCH_SIZE, TOTAL_PRODUCTS));
      setLoading(false);
    }, 500); // Simulate network delay
  };

  const renderAdItem = useCallback(
    (items: any) => {
      return <PropertyCard items={items.item} navigation={navigation} />;
    },
    [navigation],
  );

  const fetchData = async () => {
    // const data = {
    //   deviceId: '154789',
    //   appVersion: '1.3.0',
    //   signatureHash: 'aabbccddeeff',
    //   deviceModel: 'Pixel 6',
    //   osVersion: 'Android 13',
    //   fingerprintHash: 'hsde123231',
    //   rooted: false,
    //   emulator: false,
    //   debug: false,
    //   installer: 'com.android.vending',
    // };
    // gethandShakeToken(data);
  };

  React.useEffect(() => {
    console.log('listings', listings);

    fetchData();
  },[]);

  React.useEffect(()=>{
    console.log(clientId, token);
  },[clientId, token])

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? 'dark-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <FlatList
        data={products}
        renderItem={renderAdItem}
        keyboardShouldPersistTaps="handled"
        keyExtractor={item => item.id}
        numColumns={2}
        ListHeaderComponent={<Header />}
        centerContent={true}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: theme.colors.backgroundHome,
        }}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        ListFooterComponent={
          visibleCount < TOTAL_PRODUCTS ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={theme.colors.activityIndicatorColor}
              />
              <Text style={styles.loadingText}>Loading more properties...</Text>
            </View>
          ) : (
            <Text style={styles.endText}>No more products</Text>
          )
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
  featured: {
    marginTop: 6,
    color: '#e91e63',
    fontWeight: 'bold',
  },
  loadMoreBtn: {
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  endText: {
    textAlign: 'center',
    color: '#888',
    padding: 12,
    fontStyle: 'italic',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#555',
    fontSize: 14,
  },
});

export default App;
