/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  // SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  View,
  RefreshControl,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useTheme} from '@theme/ThemeProvider';
import debounce from 'lodash.debounce';
// import Header from './Header/Header';
import PropertyCard from '@components/PropertyCard';
import useBoundStore from '@stores/index';
import CommonSearchHeader from '@components/Header/CommonSearchHeader';
import IconButton from '@components/Buttons/IconButton';
import {Fonts} from '@constants/font';
import {useNavigation} from '@react-navigation/native';
import FilterModal from '@components/Filter';
import HomepageSkelton from '@components/SkeltonLoader/HomepageSkelton';
import NoChats from '@components/NoChatFound';

const SortChips: React.FC<any> = ({setFilters, fetchFilterListings, theme}) => {
  const {filters, filter_loading, clearFilterList} = useBoundStore();
  const handleSort = useCallback(
    (orderBy: string, orderByDir: 'asc' | 'desc') => {
      if (!filter_loading) {
        clearFilterList();

        let newFilters = {...filters};
        if (
          newFilters['orderBy'] &&
          newFilters['orderBy'] == orderBy &&
          newFilters['orderByDir'] == orderByDir
        ) {
          console.log(orderBy);
          console.log(newFilters['orderBy']);
          newFilters['orderBy'] = '';
          newFilters['orderByDir'] = '';
          console.log(newFilters);
          setFilters(newFilters);
        } else {
          setFilters({orderBy, orderByDir});
        }
        fetchFilterListings();
      }
    },
    [setFilters, fetchFilterListings, filters, filter_loading],
  );

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        paddingRight: 8,
        padding: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      <TouchableOpacity
        style={[
          styles.chipSort,
          filters.orderBy == 'distance' && styles.chipSelected,
        ]}
        onPress={() => handleSort('distance', 'asc')}>
        <Text
          style={[
            styles.chipText,
            filters.orderBy == 'distance' && styles.chipTextSelected,
          ]}>
          {'Disance'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.chipSort,
          filters.orderBy == 'createdAt' && styles.chipSelected,
        ]}
        onPress={() => handleSort('createdAt', 'asc')}>
        <Text
          style={[
            styles.chipText,
            {color: theme.colors.text},
            filters.orderBy == 'createdAt' && styles.chipTextSelected,
          ]}>
          {'Date published'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.chipSort,
          filters.orderBy === 'price' &&
            filters.orderByDir === 'asc' &&
            styles.chipSelected,
        ]}
        onPress={() => handleSort('price', 'asc')}>
        <Text
          style={[
            styles.chipText,
            {color: theme.colors.text},
            filters.orderBy == 'price' &&
              filters.orderByDir == 'asc' &&
              styles.chipTextSelected,
          ]}>
          {'Price low to high'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.chipSort,
          filters.orderBy === 'price' &&
            filters.orderByDir === 'desc' &&
            styles.chipSelected,
        ]}
        //  styles.chipSelected
        onPress={() => handleSort('price', 'desc')}>
        <Text
          style={[
            styles.chipText,
            {color: theme.colors.text},
            filters.orderBy == 'price' &&
              filters.orderByDir == 'desc' &&
              styles.chipTextSelected,
          ]}>
          {'Price high to low'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

function App(): React.JSX.Element {
  const {
    filter_totalpages,
    filter_listings,
    fetchFilterListings,
    filter_hasMore,
    filter_loading,
    filter_triggerRefresh,
    clearFilterList,
    filterSetTriggerRefresh,
    setFilters,
    updateFilter,
    resetFilters,
    filters,
    setlocationModalVisible,
    location,
    setGlobalModalVisible,
  } = useBoundStore();
  const {theme} = useTheme();
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState(filters?.['searchText'] ?? '');
  const [sort, setSort] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const prevFiltersRef = useRef<string[] | null>(location);
  const controllerRef = useRef<AbortController | null>(null);
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

  useEffect(() => {
    setSearchText(filters?.searchText ?? '');
  }, [filters]);

  const FilterView = useCallback(() => {
    return (
      <>
        <View
          style={{
            backgroundColor: theme.colors.background,
            paddingRight: 17,
            padding: 12,
            paddingBottom: 2,
            flexDirection: 'row',
          }}>
          <View style={{flexDirection: 'row', width: '90%'}}>
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
                style={[styles.chip]}>
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
            theme={theme}
          />
        )}
        <>
          <Text style={[styles.resusltText, {color: theme.colors.text}]}>
            {'Showing ' + filter_listings.length + ' of ' + filter_totalpages}
          </Text>
        </>
      </>
    );
  }, [navigation, sort, filter_listings]);

  useEffect(() => {
    filter_triggerRefresh && fetchFilterListings();
  }, [filter_triggerRefresh]);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (
      // @ts-ignore
      prevFiltersRef.current?.lat &&
      // @ts-ignore
      prevFiltersRef.current?.lat !== location.lat
    ) {
      clearFilterList();
      prevFiltersRef.current = location;
    }

    if (!visible) {
      controllerRef.current?.abort();

      // ▶️ 2. Create a fresh controller for this request
      const controller = new AbortController();
      controllerRef.current = controller;
      !filter_loading && fetchData();
    }

    // cleanup when component unmounts
    return () => controller.abort();
  }, [filters, location]);

  const fetchData = async () => {
    fetchFilterListings();
  };

  const updateData = () => {
    console.log(searchText);
    if (searchText.length > 2) {
      clearFilterList();
      setFilters({
        search: searchText,
      });
    } else {
      let newFilter = {...filters};
      delete newFilter.search;
      updateFilter(newFilter);
    }
  };

  const debouncedFetch: () => void = useMemo(
    () => debounce(updateData, 500), // wait 500ms after typing stops
    [updateData],
  );
  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
      // @ts-ignore
      debouncedFetch?.cancel();
    };
  }, [debouncedFetch]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <FlatList
        data={filter_listings}
        renderItem={renderAdItem}
        keyboardShouldPersistTaps="handled"
        refreshing={true}
        keyExtractor={item => item._id}
        numColumns={2}
        ListHeaderComponent={
          <View
            style={{
              backgroundColor: theme.colors.backgroundHome,
              paddingTop: Platform.OS === 'android' ? 5 : 5,
            }}>
            <Pressable
              onPress={() => {
                setlocationModalVisible();
              }}
              style={styles.locationContainer}>
              <IconButton
                iconSize={16}
                style={styles.iconStyle}
                iconColor={theme.colors.text}
                iconName={'map-marker'}
              />
              <Text
                numberOfLines={1}
                style={[styles.textStyle, {color: theme.colors.text}]}>
                {location?.name || 'Kerala'}
              </Text>
              <IconButton
                iconSize={18}
                iconColor={theme.colors.text}
                iconName={'chevron-down'}
              />
            </Pressable>
            <CommonSearchHeader
              searchValue={searchText}
              onChangeSearch={() => {}}
              touchable
              onTouchablePress={() => {
                setGlobalModalVisible();
              }}
              onBackPress={function (): void {
                clearFilterList();
                navigation.goBack();
              }}
            />
            <FilterView />
          </View>
        }
        centerContent={true}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: theme.colors.backgroundHome,
          minHeight: 800,
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
            colors={['#40DABE', '#40DABE', '#227465']}
          />
        }
        ListFooterComponent={
          filter_hasMore || filter_loading ? (
            <HomepageSkelton />
          ) : filter_listings.length <= 0 ? (
            <>
              <NoChats
                icon="message-text-outline"
                // title="No Chat Found"
                body="we cannot find anything on this search try again with diffrent options."
                // buttonText={'Explore now'}
              />
            </>
          ) : (
            <></>
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
    top: -40,
    fontFamily: Fonts.MEDIUM_ITALIC,
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
    top: 5,
  },

  chipTextSelected: {
    color: '#fff',
  },

  chipSelected: {
    backgroundColor: '#2A9D8F',
    borderColor: '#2A9D8F',
  },

  locationContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 5,
    // // top: 30,
    // zIndex: 10,
    // backgroundColor: '#fff',
  },

  textStyle: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    marginRight: 5,
    maxWidth: 250,
  },
  iconStyle: {},
});

export default App;
