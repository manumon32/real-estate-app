import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  height?: number;
  width?: number;
  zoomDelta?: number; // optional zoom control
}

const isValidLatLng = (lat: number, lng: number) => {
  return lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng);
};

const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  height = 150,
  zoomDelta = 0.01,
}) => {
  if (!isValidLatLng(latitude, longitude)) return null;

  const region = {
    latitude,
    longitude,
    latitudeDelta: zoomDelta,
    longitudeDelta: zoomDelta,
  };

  return (
    <View style={{height: height, padding: 10}}>
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        region={region}>
        <Marker coordinate={{latitude, longitude}} />
      </MapView>
    </View>
  );
};

export default PropertyMap;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
