/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import SlideInView from '@components/AnimatedView';
import FilterModal from '@components/Filter';

const SortChips: React.FC<any> = ({setFilters, fetchFilterListings}) => {
  const {filters, filter_loading, clearFilterList} = useBoundStore();
  const handleSort = useCallback(
    (orderBy: string, orderByorderByDir: 'asc' | 'desc') => {
      if (!filter_loading) {
        clearFilterList();
        setFilters({orderBy, orderByorderByDir});
        fetchFilterListings();
      }
    },
    [setFilters, fetchFilterListings, filters, filter_loading],
  );

  return (
    <View
      style={{
        backgroundColor: '#fff',
        paddingRight: 8,
        padding: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      <TouchableOpacity
        style={[
          styles.chipSort,
          filters.orderBy == 'createdAt' && styles.chipSelected,
        ]}
        onPress={() => handleSort('createdAt', 'asc')}>
        <Text
          style={[
            styles.chipText,
            filters.orderBy == 'createdAt' && styles.chipTextSelected,
          ]}>
          {'Date published'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.chipSort,
          filters.orderBy === 'price' &&
            filters.orderByorderByDir === 'asc' &&
            styles.chipSelected,
        ]}
        onPress={() => handleSort('price', 'asc')}>
        <Text
          style={[
            styles.chipText,
            filters.orderBy == 'price' &&
              filters.orderByorderByDir == 'asc' &&
              styles.chipTextSelected,
          ]}>
          {'Price low to high'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.chipSort,
          filters.orderBy === 'price' &&
            filters.orderByorderByDir === 'desc' &&
            styles.chipSelected,
        ]}
        //  styles.chipSelected
        onPress={() => handleSort('price', 'desc')}>
        <Text
          style={[
            styles.chipText,
            filters.orderBy == 'price' &&
              filters.orderByorderByDir == 'desc' &&
              styles.chipTextSelected,
          ]}>
          {'high to low'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

function App(): React.JSX.Element {
  const {
    filter_listings,
    fetchFilterListings,
    filter_hasMore,
    filter_loading,
    filter_triggerRefresh,
    clearFilterList,
    filterSetTriggerRefresh,
    setFilters,
    resetFilters,
    filters,
  } = useBoundStore();
  const {theme} = useTheme();
  const [visible, setVisible] = useState(false);
  const [sort, setSort] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';

  const navigation = useNavigation();
  const loadMore = () => {
    if (filter_loading || !filter_hasMore) return;
    fetchFilterListings();
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
      <>
        <View
          style={{
            backgroundColor: '#fff',
            paddingRight: 17,
            padding: 12,
            paddingBottom: 2,
            flexDirection: 'row',
          }}>
          <View style={{flexDirection: 'row', width: '80%'}}>
            <View style={styles.chipContainer}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(true);
                }}
                style={[styles.chip]}>
                <IconButton
                  iconName={'filter'}
                  iconSize={20}
                  iconColor={'#2F8D79'}
                  style={{marginRight: 5}}
                />
                <Text style={styles.chipText}>{'Filter'}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.chipContainer]}>
              <TouchableOpacity
                onPress={() => setSort(!sort)}
                style={[styles.chip, sort && styles.chipSelected]}>
                <IconButton
                  iconName={'sort'}
                  iconSize={20}
                  iconColor={sort ? '#fff' : '#2F8D79'}
                  style={{marginRight: 5}}
                />
                <Text style={[styles.chipText, sort && {color: '#fff'}]}>
                  {'Sort'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.chipContainer]}>
              <TouchableOpacity
                onPress={() => {
                  setSort(false);
                  clearFilterList();
                  resetFilters();
                  fetchFilterListings();
                }}
                style={[styles.chip, {width: 120}]}>
                <IconButton
                  iconName={'delete'}
                  iconSize={20}
                  iconColor={'#2F8D79'}
                  style={{marginRight: 5}}
                />
                <Text style={[styles.chipText]}>{'Clear Filters'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {sort && (
          <SortChips
            filters={filters}
            setFilters={setFilters}
            fetchFilterListings={fetchFilterListings}
          />
        )}

        <Text style={styles.resusltText}>
          {filter_listings.length + ' Results'}
        </Text>
      </>
    );
  }, [navigation, sort, filter_listings]);

  useEffect(() => {
    filter_triggerRefresh && fetchFilterListings();
  }, [filter_triggerRefresh]);

  const fetchData = async () => {
    fetchFilterListings();
  };

  useFocusEffect(
    useCallback(() => {
      !filter_loading && fetchData();

      return () => {};
    }, []),
  );

  return (
    <SlideInView direction={'right'}>
      <SafeAreaView>
        <StatusBar
          barStyle={isDarkMode ? 'dark-content' : 'light-content'}
          backgroundColor={theme.colors.backgroundPalette[0]}
        />
        <FlatList
          data={filter_listings}
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
                filterSetTriggerRefresh();
              }}
            />
          }
          ListFooterComponent={
            filter_hasMore || filter_loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={theme.colors.activityIndicatorColor}
                />
                {filter_loading && filter_listings?.length > 0 && (
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

        <FilterModal
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          onApply={() => {
            setVisible(false);
            clearFilterList();
            !filter_loading && fetchFilterListings();
          }}
        />
      </SafeAreaView>
    </SlideInView>
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
    // flexWrap: 'wrap',
    // gap: 10,
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
    width: 110,
    justifyContent: 'center',
  },

  chipSort: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 5,
  },

  chipText: {
    color: '#171717',
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
  },

  resusltText: {
    color: '#696969',
    fontSize: 12,
    fontFamily: Fonts.BOLD_ITALIC,
    margin: 5,
    marginBottom: -5,
  },

  chipTextSelected: {
    color: '#fff',
  },

  chipSelected: {
    backgroundColor: '#2A9D8F',
    borderColor: '#2A9D8F',
  },
});

export default App;
