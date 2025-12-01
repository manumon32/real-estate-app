import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
  Platform,
} from 'react-native';
import MapView, {Marker, MapPressEvent} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {useRoute} from '@react-navigation/native';

interface MapPickerScreenProps {
  navigation: any;
  route: any;
}

const MapPickerScreen: React.FC<MapPickerScreenProps> = ({navigation}) => {
  const [region, setRegion] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  const route = useRoute();
  const {items}: any = route.params;
  console.log('items', items);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const permission =
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

        const result = await check(permission);
        if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
          const requestResult = await request(permission);
          if (requestResult !== RESULTS.GRANTED) {
            Alert.alert(
              'Permission denied',
              'Location access is required to pick a location.',
              [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Open Settings', onPress: () => openSettings()},
              ],
            );
            return;
          }
        }

        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
            setMarker({latitude, longitude});
          },
          error => {
            console.log(error);
            Alert.alert('Error', 'Unable to fetch current location.');
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } catch (err) {
        console.log(err);
      }
    };

    requestLocationPermission();
  }, []);

  const handleMapPress = (event: MapPressEvent) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setMarker({latitude, longitude});
  };

  const handleConfirm = () => {
    if (!marker) {
      Alert.alert('Please select a location first.');
      return;
    }
    //  const mapLink = `https://www.google.com/maps?q=${marker.latitude},${marker.longitude}`;
    const mapLink = [marker.latitude, marker.longitude];
    navigation.goBack();
    // @ts-ignore
    route.params?.onLocationSelected({...marker, mapLink});
  };

  if (!region) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#007AFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pick Location</Text>
        <View style={{width: 50}} />
      </View>

      <MapView
        style={styles.map}
        initialRegion={region}
        onPress={handleMapPress}>
        {marker && <Marker coordinate={marker} />}
      </MapView>

      <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
        <Text style={styles.btnText}>Share This Location</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MapPickerScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {flex: 1},
  confirmBtn: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  topBar: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 999,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
