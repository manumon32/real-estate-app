/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect} from 'react';
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
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '@theme/ThemeProvider';
// import Header from './Header/Header';
import PropertyCard from '@components/PropertyCard';
import useBoundStore from '@stores/index';
import CommonSearchHeader from '@components/Header/CommonSearchHeader';
import IconButton from '@components/Buttons/IconButton';
import {Fonts} from '@constants/font';
import { useNavigation } from '@react-navigation/native';

function App(): React.JSX.Element {
  const {
    listings,
    fetchListings,
    hasMore,
    loading,
    triggerRefresh,
    setTriggerRefresh,
  } = useBoundStore();
  const {theme} = useTheme();

  const isDarkMode = useColorScheme() === 'dark';

  const navigation = useNavigation();
  const loadMore = () => {
    if (loading || !hasMore) return;
    fetchListings();
  };

  const renderAdItem = useCallback(
    (items: any) => {
      return <PropertyCard items={items.item} navigation={navigation} />;
    },
    [navigation],
  );
  // console.warn(renderAdItem);

  const FilterView = useCallback(() => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          paddingRight: 17,
          padding: 12,
          flexDirection: 'row',
        }}>
        <View style={{flexDirection: 'row', width: '80%'}}>
          <View style={styles.chipContainer}>
            <TouchableOpacity style={[styles.chip]}>
              <IconButton
                iconName={'filter'}
                iconSize={20}
                iconColor={'#2F8D79'}
                style={{marginRight: 5}}
              />
              <Text style={styles.chipText}>{'Filter'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chipContainer}>
            <TouchableOpacity style={[styles.chip]}>
              <IconButton
                iconName={'sort'}
                iconSize={20}
                iconColor={'#2F8D79'}
                style={{marginRight: 5}}
              />
              <Text style={styles.chipText}>{'Sort'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.resusltText}>{'205 Results'}</Text>
      </View>
    );
  }, [navigation]);

  useEffect(() => {
    triggerRefresh && fetchListings();
  }, [triggerRefresh]);

  const fetchData = async () => {
    fetchListings();
  };

  React.useEffect(() => {
    !loading && fetchData();
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
        ListHeaderComponent={
          <>
            <CommonSearchHeader
              searchValue=""
              onChangeSearch={() => {}}
              onBackPress={function (): void {
                navigation.goBack();
              }}
            />
            <FilterView />
          </>
        }
        centerContent={true}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: theme.colors.backgroundHome,
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
          />
        }
        ListFooterComponent={
          hasMore || loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={theme.colors.activityIndicatorColor}
              />
              {loading && listings?.length > 0 && (
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

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
    height: 36,
    width: 104,
    justifyContent: 'center',
  },

  chipText: {
    color: '#171717',
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
  },

  resusltText: {
    color: '#696969',
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
    top: 10,
  },
});

export default App;
