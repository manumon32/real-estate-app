/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Fonts} from '@constants/font';
import {getCurrentRouteName} from '@navigation/RootNavigation';

import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import useBoundStore from '@stores/index';
import {useTheme} from '@theme/ThemeProvider';
import {GOOGLE_API_KEY} from '@constants/google';

interface Props {
  visible: boolean;
  onClose: () => void;
  locationHistory: any;
  onSelectLocation: (location: {
    name: string;
    lat: number;
    lng: number;
    city: string;
    district: string;
    state: string;
    country: string;
  }) => void;
}

const GlobalSearchModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelectLocation,
  locationHistory,
}) => {
  const {
    location,
    filters,
    setFilters,
    resetFilters,
    clearFilterList,
    filter_suggestions,
  } = useBoundStore();
  const currentScreen = getCurrentRouteName();
  const [query, setQuery] = useState(location?.name ?? '');
  const navigation = useNavigation();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [filterBy, setFilterBy] = useState<any>('');
  const [searchHistory, setSearchHistory] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    setQuery(location?.name ?? '');
  }, [location]);

  const {theme} = useTheme();
  const fetchPredictions = useCallback(async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setPredictions([]);
      return;
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_API_KEY}&language=en&components=country:in&types=geocode`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      const unwantedTypes = ['establishment', 'natural_feature'];

      const filteredPredictions = json.predictions.filter(
        (place: {types: any[]}) => {
          // Check if none of the types are in the unwanted list
          return !place.types.some(t => unwantedTypes.includes(t));
        },
      );

      const filtered = filteredPredictions.filter((prediction: any) => {
        const types = prediction.types;

        // Include if it's a desired location type
        const include =
          types.includes('locality') ||
          types.includes('administrative_area_level_3') ||
          types.includes('administrative_area_level_1') ||
          types.includes('country');

        // Exclude unwanted types
        const exclude =
          types.includes('establishment') || types.includes('natural_feature');

        return include && !exclude;
      });

      setPredictions(filtered || []);
    } catch (err) {
      console.error('Prediction fetch failed', err);
    }
  }, []);

  function formatPlaceName(components: any[]): string {
    let locality: any = null;
    let city: any = null;
    let district: any = null;
    let state: any = null;
    let country: any = null;

    components.forEach(comp => {
      if (comp.types.includes('locality') && !locality) {
        locality = comp.long_name;
      }
      if (comp.types.includes('neighborhood') && !locality) {
        locality = comp.long_name;
      }
      if (comp.types.includes('sublocality_level_1') && !locality) {
        locality = comp.long_name;
      }
      if (comp.types.includes('sublocality_level_2') && !locality) {
        locality = comp.long_name;
      }
      if (comp.types.includes('administrative_area_level_2') && !city) {
        city = comp.long_name;
      }
      if (comp.types.includes('administrative_area_level_3') && !district) {
        district = comp.long_name;
      }
      if (comp.types.includes('administrative_area_level_1') && !state) {
        state = comp.long_name;
      }
      if (comp.types.includes('country') && !state) {
        country = comp.long_name;
      }
    });

    // Determine final parts according to OLX priority
    const parts: string[] = [];

    if (locality) {
      parts.push(locality);
    }
    if (!locality && city) {
      parts.push(city);
    } // fallback if locality missing
    if (!city && district) {
      parts.push(district);
    } // fallback
    if (!district && state) {
      parts.push(state);
    }
    if (!district && !state) {
      parts.push(country);
    }

    // Remove duplicates
    const uniqueParts = parts.filter(
      (item, index) => parts.indexOf(item) === index,
    );

    return uniqueParts.join(', ');
  }

  const checkAndRequestPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    let status = await check(permission);

    if (status === RESULTS.GRANTED) {
      getCurrentLocation();
    }

    if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
      status = await request(permission);
      if (status === RESULTS.GRANTED) {
        getCurrentLocation();
      }
    }

    if (status === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Required',
        'Please enable location permission in settings to continue.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => openSettings()},
        ],
      );
    }
  };

  const fetchPlaceDetails = async (placeId: string) => {
    setLoading(true);
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      const locations = json.result.geometry.location;
      let name = json.result.formatted_address || '';

      let city_name = null;
      let district_name = null;
      let state_name = null;
      let country_name = null;
      if (json.result.address_components) {
        const components = json.result.address_components;
        const city = components.find((c: any) => c.types.includes('locality'));
        let district = components.find((c: any) =>
          c.types.includes('administrative_area_level_3'),
        );
        if (!district) {
          district = components.find((c: any) =>
            c.types.includes('administrative_area_level_2'),
          );
        }
        const state = components.find((c: any) =>
          c.types.includes('administrative_area_level_1'),
        );
        const country = components.find((c: any) =>
          c.types.includes('country'),
        );

        if (city) {
          city_name = city.long_name;
        }
        if (district) {
          district_name = district.long_name;
        }
        if (state) {
          state_name = state.long_name;
        }
        if (country) {
          country_name = country.long_name;
        }
        name = components ? formatPlaceName(components) : name;
      }
      onSelectLocation({
        name: name,
        lat: locations.lat,
        lng: locations.lng,
        city: city_name,
        district: district_name,
        state: state_name,
        country: country_name,
      });
      setQuery('');
      setPredictions([]);
      // onClose();
    } catch (err) {
      console.error('Details fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('currentScreen', currentScreen);
    setFilterBy(currentScreen === 'Home' ? '' : filters?.searchText ?? '');
  }, [filters]);

  React.useEffect(() => {
    checkAndRequestPermission();
  }, []);

  const useCurrentLocation = () => {
    if (currentLocation?.name) {
      setQuery(currentLocation?.name ?? '');
      onSelectLocation(currentLocation);
    } else {
      checkAndRequestPermission();
    }
  };

  const setLocation = (updatelocation: any) => {
    if ((!visible && location?.default) || visible) {
      onSelectLocation(updatelocation);
    }
    setCurrentLocation(updatelocation);
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

        const res = await fetch(url);
        const json = await res.json();
        const locations = json.results[0]?.geometry.location;
        let name = json.results[0]?.formatted_address || 'Kerala';
        let city_name = null;
        let district_name = null;
        let state_name = null;
        let country_name = null;
        if (json.results[0].address_components) {
          const components = json.results[0].address_components;
          const city = components.find((c: any) =>
            c.types.includes('locality'),
          );
          const district = components.find((c: any) =>
            c.types.includes('administrative_area_level_2'),
          );
          const state = components.find((c: any) =>
            c.types.includes('administrative_area_level_1'),
          );
          const country = components.find((c: any) =>
            c.types.includes('country'),
          );

          if (city) {
            city_name = city.long_name;
          }
          if (district) {
            district_name = district.long_name;
          }
          if (state) {
            state_name = state.long_name;
          }
          if (country) {
            country_name = country.long_name;
          }
          name = components ? formatPlaceName(components) : name;
        }
        console.log('locationslocationslocationslocationslocations', locations);
        setLocation({
          name: name,
          lat: locations.lat,
          lng: locations.lng,
          city: city_name,
          district: district_name,
          state: state_name,
          country: country_name,
          // address_components: json.result.address_components,
        });
        setLoading(false);
      },
      () => {
        // Alert.alert('Lat Long fetch failed');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000,
        // @ts-ignore
        showLocationDialog: true,
      },
      // {enableHighAccuracy: true, timeout: 15_000, maximumAge: 0},
    );
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => fetchPlaceDetails(item.place_id)}>
      <MaterialCommunityIcons
        name="map-marker"
        size={20}
        color="#696969"
        style={{marginRight: 10}}
      />
      <Text style={styles.itemText}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderItemSearch = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        handleSearch(item, true);
      }}>
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );
  const handleSearch = (arg: any, menu = false) => {
    if (!arg && !menu && filterBy.trim().length === 0) {
      return;
    }
    resetFilters();
    clearFilterList();
    onClose();
    !menu && setSearchHistory([...searchHistory, arg ? arg : filterBy]);
    let payload = {
      search: filterBy,
      searchText: filterBy,
    };
    if (arg) {
      payload = arg?.payload
        ? {...arg.payload, searchText: arg?.label}
        : {search: menu ? arg.label : arg, searchText: menu ? arg.label : arg};
    }
    setFilters(payload);
    // setFilterBy('');
    // @ts-ignore
    navigation.navigate('filter');
  };

  const suggestionSearch = useMemo(() => {
    if (!filterBy) {
      return filter_suggestions.slice(0, 6);
    } // show first 6 if empty

    const normalizedFilter = filterBy?.toLowerCase().replace(/\s+/g, '');

    return filter_suggestions
      .filter(item =>
        item.label.toLowerCase().replace(/\s+/g, '').includes(normalizedFilter),
      )
      .slice(0, 6); // limit to 6 suggestions
  }, [filter_suggestions, filterBy]);

  return (
    <Modal
      visible={visible}
      // animationType="slide"
      animationType="slide"
      statusBarTranslucent
      transparent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.backgroundHome,
            },
          ]}>
          <View style={styles.header}>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              Search
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color="#696969" />
            <TextInput
              value={filterBy}
              onChangeText={text => {
                setFilterBy(text);
              }}
              // keyboardType="web-search"
              returnKeyType="search"
              placeholder="Search"
              placeholderTextColor={'#434343ff'}
              style={[styles.input]}
              onFocus={() => setFocusedIndex(0)} // 👈 "Search" box focused
              onBlur={() => setFocusedIndex(null)}
              autoFocus
              autoComplete="off" // disables autocomplete
              autoCorrect={false} // disables autocorrect
              onSubmitEditing={() => {
                handleSearch(false, false);
              }}
            />
            {filterBy.length > 0 && (
              <MaterialCommunityIcons
                name="close"
                size={20}
                color="#696969"
                onPress={() => {
                  setFilterBy('');
                }}
              />
            )}
          </View>

          {focusedIndex === 0 &&
            filterBy.length > 2 &&
            suggestionSearch.length > 0 && (
              <View style={{top: -10}}>
                <FlatList
                  data={filterBy.length > 2 ? suggestionSearch : []}
                  keyExtractor={item => item.id.toString()}
                  renderItem={renderItemSearch}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    borderColor: '#EBEBEB',
                    borderWidth: 1,
                    marginTop: 10,
                    padding: 8,
                  }}
                />
              </View>
            )}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color="#696969"
            />
            <TextInput
              value={query}
              onChangeText={fetchPredictions}
              placeholder="Enter location"
              placeholderTextColor={theme.colors.background}
              style={[styles.input]}
              onFocus={() => setFocusedIndex(1)} // 👈 "Search" box focused
              onBlur={() => setFocusedIndex(null)}
              autoComplete="off" // disables autocomplete
              autoCorrect={false} // disables autocorrect
            />

            {query.length > 0 && (
              <MaterialCommunityIcons
                name="close"
                size={20}
                color="#696969"
                onPress={() => {
                  setQuery('');
                  setPredictions([]);
                }}
              />
            )}
          </View>

          {focusedIndex === 0 && searchHistory.length > 0 && (
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                borderColor: '#EBEBEB',
                borderWidth: 1,
                marginTop: 10,
                padding: 8,
              }}>
              {
                <Text
                  style={{
                    fontSize: 14,
                    marginTop: 15,
                    color: '#696969',
                    margin: 5,
                  }}>
                  Recent Searches
                </Text>
              }
              {searchHistory?.map(
                (item: string, index: number) =>
                  index <= 4 && (
                    <TouchableOpacity
                      key={index}
                      style={styles.item}
                      onPress={() => {
                        handleSearch(item, true);
                      }}>
                      <MaterialCommunityIcons
                        name="clock"
                        size={20}
                        color="#696969"
                        style={{marginRight: 10}}
                      />
                      <Text style={styles.itemText}>{item}</Text>
                    </TouchableOpacity>
                  ),
              )}
            </View>
          )}

          {focusedIndex == 1 && (
            <View>
              <TouchableOpacity
                style={styles.currentLocationBtn}
                onPress={useCurrentLocation}>
                <View
                  style={{
                    width: '10%',
                  }}>
                  <MaterialCommunityIcons
                    name="crosshairs-gps"
                    size={20}
                    color="#2F8D79"
                  />
                </View>
                <View>
                  <Text style={styles.currentLocationText}>
                    Use Current Location
                  </Text>
                  {!loading && currentLocation?.name && (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: 'rgba(0, 0, 0, 0.55)',
                        textAlign: 'left',
                        maxWidth: 250,
                      }}>
                      {currentLocation?.name}
                    </Text>
                  )}
                  {loading && (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: 'rgba(0, 0, 0, 0.55)',
                        textAlign: 'left',
                        maxWidth: 250,
                      }}>
                      {'Fetching'}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              {loading ? (
                <ActivityIndicator style={{marginTop: 20}} />
              ) : (
                (predictions.length > 0 ||
                  locationHistory.filter(
                    (item: {lat: any}) => currentLocation?.lat !== item.lat,
                  ).length > 0) && (
                  <FlatList
                    data={predictions}
                    keyExtractor={item => item.place_id}
                    renderItem={renderItem}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                      backgroundColor: '#fff',
                      borderRadius: 12,
                      borderColor: '#EBEBEB',
                      borderWidth: 1,
                      marginTop: 10,
                      padding: 8,
                    }}
                    ListFooterComponent={
                      locationHistory.filter(
                        (item: {lat: any}) => currentLocation?.lat !== item.lat,
                      ).length > 0 ? (
                        <View>
                          {
                            <Text
                              style={{
                                fontSize: 14,
                                marginTop: 15,
                                color: '#696969',
                                margin: 5,
                              }}>
                              Recent Searches
                            </Text>
                          }
                          {locationHistory?.map(
                            (item: any, index: number) =>
                              index <= 4 &&
                              currentLocation?.lat !== item.lat && (
                                <TouchableOpacity
                                  key={index}
                                  style={styles.item}
                                  onPress={() => {
                                    onSelectLocation(item);
                                  }}>
                                  <MaterialCommunityIcons
                                    name="clock"
                                    size={20}
                                    color="#696969"
                                    style={{marginRight: 10}}
                                  />
                                  <Text style={styles.itemText}>
                                    {item.name}
                                  </Text>
                                </TouchableOpacity>
                              ),
                          )}
                        </View>
                      ) : (
                        <></>
                      )
                    }
                  />
                )
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    height: '95%',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Fonts.MEDIUM,
    textAlign: 'center',
    color: '#171717',
  },
  inputContainer: {
    height: 48,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 12,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  input: {
    height: 48,
    width: '80%',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 14,
    flex: 1,
    color: 'rgba(0, 0, 0, 0.82)',
  },
  currentLocationBtn: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    height: 56,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLocationText: {
    color: '#2F8D79',
    fontSize: 14,
    marginBottom: 2,
  },
});

export default GlobalSearchModal;
