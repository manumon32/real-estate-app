/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {
  StatusBar,
  useColorScheme,
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useTheme} from '@theme/ThemeProvider';
import Header from './Header/Header';
import PropertyCard from '@components/PropertyCard';
import useBoundStore from '@stores/index';

function App({navigation}: any): React.JSX.Element {
  const {listings, fetchListings, hasMore, loading} = useBoundStore();
  const {theme} = useTheme();

  const isDarkMode = useColorScheme() === 'dark';
  const [loadingMore, setLoading] = useState(false);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const renderAdItem = useCallback(
    (items: any) => {
      return <PropertyCard items={items.item} navigation={navigation} />;
    },
    [navigation],
  );

  const fetchData = async () => {
    fetchListings();
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? 'dark-content' : 'light-content'}
        backgroundColor={theme.colors.backgroundPalette[0]}
      />
      <FlatList
        data={listings}
        renderItem={renderAdItem}
        keyboardShouldPersistTaps="handled"
        refreshing={true}
        keyExtractor={item => item._id}
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
        refreshControl={<RefreshControl refreshing={false} />}
        ListFooterComponent={
          hasMore || loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={theme.colors.activityIndicatorColor}
              />
              {!loading && (
                <Text style={styles.loadingText}>
                  Loading more properties...
                </Text>
              )}
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
