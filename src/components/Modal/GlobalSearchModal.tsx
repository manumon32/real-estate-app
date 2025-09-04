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
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import useBoundStore from '@stores/index';
import {useTheme} from '@theme/ThemeProvider';
import {SafeAreaView} from 'react-native-safe-area-context';

const GOOGLE_API_KEY = 'AIzaSyA83qLdbImZmSqqXEV7xeiYegOGcZhUq_o'; // Replace this

interface Props {
  visible: boolean;
  onClose: () => void;
  locationHistory: any;
  onSelectLocation: (location: {
    name: string;
    lat: number;
    lng: number;
  }) => void;
}

const GlobalSearchModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelectLocation,
  locationHistory,
}) => {
  const {location, setFilters, filters, resetFilters, clearFilterList} =
    useBoundStore();
  const [query, setQuery] = useState(location?.name ?? '');
  const navigation = useNavigation();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [filterBy, setFilterBy] = useState<any>('');
  const [searchHistory, setSearchHistory] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const BEDROOMS = [
    {name: '1 BHK', _id: '1', filterName: 'numberOfBedrooms'},
    {name: '2 BHK', _id: '2', filterName: 'numberOfBedrooms'},
    {name: '3 BHK', _id: '3', filterName: 'numberOfBedrooms'},
    {name: '4 BHK', _id: '4', filterName: 'numberOfBedrooms'},
    {name: '4+ BHK', _id: '4%2B', filterName: 'numberOfBedrooms'},
  ];

  const PROPERTY_TYPES = [
    'House',
    'Apartment',
    'Villa',
    // you can extend this list if needed
  ];

  const TRANSACTION_TYPES = [
    {key: 'Sale', label: 'for Sale'},
    {key: 'Rent', label: 'for Rent'},
    {key: 'Lease', label: 'for Lease'},
  ];

  // 🔥 Generate dynamic search suggestions
  const bedroomPropertySuggestions = BEDROOMS.flatMap(bedroom =>
    PROPERTY_TYPES.flatMap(property =>
      TRANSACTION_TYPES.map(trans => ({
        id: `${bedroom._id}-${property}-${trans.key}`,
        label: `${bedroom.name} ${property} ${trans.label}`,
        type: trans.key,
        filter: {
          [bedroom.filterName]: bedroom._id,
          propertyType: property.toLowerCase(),
        },
      })),
    ),
  );

  // const LISTING_TYPES = appConfigs?.listingTypes || [];
  // console.log('LISTING_TYPES', appConfigs);
  const searchSuggestions = [
    // Sell
    {
      id: 1,
      label: 'House for Sale',
      type: 'Sale',
      payload: {
        listingTypeId: '684176d84eb67a1a216b94fd',
        propertyTypeId: '684171ae1f127510367ef56d',
      },
    },
    {
      id: 2,
      label: 'Apartment for Sale',
      type: 'Sale',
      payload: {
        listingTypeId: '684176d84eb67a1a216b94fd',
        propertyTypeId: '684171ae1f127510367ef56d',
      },
    },
    {
      id: 3,
      label: 'Villa for Sale',
      type: 'Sale',
      payload: {
        listingTypeId: '684176d84eb67a1a216b94fd',
        propertyTypeId: '684171ae1f127510367ef56d',
      },
    },
    {
      id: 4,
      label: 'Plot / Land for Sale',
      type: 'Sale',

      payload: {
        listingTypeId: '684176d84eb67a1a216b94fd',
        propertyTypeId: '6841753e4a95cf182c60a307',
      },
    },
    {
      id: 5,
      label: 'Farmhouse for Sale',
      type: 'Sale',
      payload: {
        listingTypeId: '684176d84eb67a1a216b94fd',
        propertyTypeId: '684171ae1f127510367ef56d',
      },
    },
    {
      id: 6,
      label: 'Agricultural Land for Sale',
      type: 'Sale',
      payload: {
        listingTypeId: '684176d84eb67a1a216b94fd',
        propertyTypeId: '6841753e4a95cf182c60a307',
      },
    },
    {
      id: 7,
      label: 'Commercial Space for Sale',
      type: 'Sale',
      payload: {
        listingTypeId: '684176d84eb67a1a216b94fd',
        propertyTypeId: '684175aa4eb67a1a216b94ed',
      },
    },
    {
      id: 8,
      label: 'Office Space for Sale',
      type: 'Sale',
      payload: {
        listingTypeId: '684176d84eb67a1a216b94fd',
        propertyTypeId: '684175aa4eb67a1a216b94ed',
      },
    },
    {
      id: 9,
      label: 'Shop / Showroom for Sale',
      type: 'Sale',
      payload: {
        listingTypeId: '684176d84eb67a1a216b94fd',
        propertyTypeId: '684175aa4eb67a1a216b94ed',
      },
    },
    {
      id: 11,
      label: 'House for Sale near me',
      type: 'Sale',
      payload: {
        listingTypeId: '684176d84eb67a1a216b94fd',
        propertyTypeId: '684171ae1f127510367ef56d',
      },
    },
    {
      id: 30,
      label: 'House and Apartments Sale',
      type: 'Sale',
      payload: {
        listingTypeId: '684176d84eb67a1a216b94fd',
        propertyTypeId: '684171ae1f127510367ef56d',
      },
    },

    // Rent
    {id: 31, label: 'House for Rent', type: 'Rent'},
    {id: 32, label: 'House for Rent near me', type: 'Rent'},
    {id: 11, label: 'Apartment near me', type: 'Rent'},
    {id: 12, label: 'PG for Rent', type: 'Rent'},
    {id: 13, label: 'Guest House for Rent', type: 'Rent'},
    {id: 14, label: 'Studio Apartment for Rent', type: 'Rent'},
    {id: 15, label: 'Villa for Rent', type: 'Rent'},
    {id: 17, label: 'Agricultural Land for Rent', type: 'Rent'},
    {id: 18, label: 'Office Space for Rent', type: 'Rent'},
    {id: 19, label: 'Shop / Showroom for Rent', type: 'Rent'},
    {id: 20, label: 'Warehouse for Rent', type: 'Rent'},

    // Lease
    {id: 21, label: 'House for Lease', type: 'Lease'},
    {id: 4, label: 'Plot / Land for Lease', type: 'Lease'},
    {id: 22, label: 'Apartment for Lease', type: 'Lease'},
    {id: 23, label: 'Villa for Lease', type: 'Lease'},
    {id: 24, label: 'Farmhouse for Lease', type: 'Lease'},
    {id: 25, label: 'Agricultural Land for Lease', type: 'Lease'},
    {id: 26, label: 'Commercial Space for Lease', type: 'Lease'},
    {id: 27, label: 'Office Space for Lease', type: 'Lease'},
    {id: 28, label: 'Shop for Lease', type: 'Lease'},
    {id: 29, label: 'Industrial Shed for Lease', type: 'Lease'},

    // Bedrooms
    ...bedroomPropertySuggestions,
  ];

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

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_API_KEY}&language=en`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      setPredictions(json?.predictions || []);
    } catch (err) {
      console.error('Prediction fetch failed', err);
    }
  }, []);

  useEffect(() => {
    setFilterBy(filters?.searchText ?? '');
  }, [filters]);

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
      console.log('res', json.result);
      const locations = json.result.geometry.location;
      onSelectLocation({
        name: json.result.formatted_address,
        lat: locations.lat,
        lng: locations.lng,
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
    if ((!visible && !location?.lat) || visible) {
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
        const address = json.results[0]?.formatted_address || 'Kerala';
        setLocation({
          name: address,
          lat: latitude,
          lng: longitude,
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
    // @ts-ignore
    navigation.navigate('filter');
  };

  const suggestionSearch = useMemo(() => {
    if (!filterBy) return searchSuggestions.slice(0, 6); // show first 6 if empty

    const normalizedFilter = filterBy?.toLowerCase().replace(/\s+/g, '');

    return searchSuggestions
      .filter(item =>
        item.label.toLowerCase().replace(/\s+/g, '').includes(normalizedFilter),
      )
      .slice(0, 6); // limit to 6 suggestions
  }, [searchSuggestions, filterBy]);

  return (
    <SafeAreaView style={{backgroundColor: theme.colors.background}}>
      <Modal
        visible={visible}
        // animationType="slide"
        transparent
        statusBarTranslucent
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
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#696969"
              />
              <TextInput
                value={filterBy}
                onChangeText={text => {
                  setFilterBy(text);
                }}
                // keyboardType="web-search"
                returnKeyType="search"
                placeholder="Search"
                placeholderTextColor={theme.colors.text}
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
                          (item: {lat: any}) =>
                            currentLocation?.lat !== item.lat,
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
                              (
                                item: {lat: any; name: string; lng: any},
                                index: number,
                              ) =>
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
    </SafeAreaView>
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
