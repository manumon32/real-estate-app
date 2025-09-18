/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback} from 'react';
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

const CommonLocationModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelectLocation,
  locationHistory,
}) => {
  const {location, resetLocationHistory} = useBoundStore();
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);

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
        console.log('address_components', components);
        const city = components.find((c: any) => c.types.includes('locality'));
        let district = components.find((c: any) =>
          c.types.includes('administrative_area_level_3'),
        );
        if (!district) {
         district=  components.find((c: any) =>
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
      }
      console.log({
        name: name,
        lat: locations.lat,
        lng: locations.lng,
        city: city_name,
        district: district_name,
        state: state_name,
        country: country_name,
      });
      onSelectLocation({
        name: name,
        lat: locations.lat,
        lng: locations.lng,
        city: city_name,
        district: district_name,
        state: state_name,
        country: country_name,
        // address_components: json.result.address_components,
      });
      setQuery('');
      setPredictions([]);
      onClose();
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
      onSelectLocation(currentLocation);
      onClose();
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
        const name = json.results[0]?.formatted_address || 'Kerala';
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
        }
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
        visible && onClose();
        setLoading(false);
      },
      () => {
        Alert.alert('Lat Long fetch failed');
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
      transparent>
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
              Location
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
              value={query}
              onChangeText={fetchPredictions}
              placeholder="Enter location"
              style={styles.input}
            />
          </View>
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
                (item: {lat: any}, index: number) =>
                  index <= 4 && currentLocation?.lat !== item.lat,
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
                    (item: {lat: any}, index: number) =>
                      index <= 4 && currentLocation?.lat !== item.lat,
                  ).length > 0 ? (
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            marginTop: 15,
                            color: '#696969',
                            margin: 5,
                          }}>
                          Recent Searches
                        </Text>
                        <TouchableOpacity onPress={resetLocationHistory}>
                          <Text
                            style={{
                              fontSize: 14,
                              marginTop: 15,
                              color: '#696969',
                              margin: 5,
                            }}>
                            Clear All
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {locationHistory
                        .filter(
                          (item: {lat: any}, index: number) =>
                            index <= 4 && currentLocation?.lat !== item.lat,
                        )
                        .map((item: any) => (
                          <TouchableOpacity
                            key={`${item.lat}-${item.lng}`} // unique key
                            style={styles.item}
                            onPress={() => {
                              onSelectLocation(item);
                              onClose();
                            }}>
                            <MaterialCommunityIcons
                              name="clock"
                              size={20}
                              color="#696969"
                              style={{marginRight: 10}}
                            />
                            <Text style={styles.itemText}>{item.name}</Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                  ) : null
                }
              />
            )
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
    height: '90%',
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

export default CommonLocationModal;
