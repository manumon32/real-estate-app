/* eslint-disable react-native/no-inline-styles */
// PropertyDetailsScreen.tsx

import React, {useMemo, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Fonts} from '@constants/font';
import IconButton from '@components/Buttons/IconButton';
import {useTheme} from '@theme/ThemeProvider';
import Button from '@components/Buttons/Button';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// import PropertyCard from '@components/PropertyCard';
import Header from './Header';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.chatButton}>
        <Icon name="chat-outline" size={20} color="#000" />
        <Text style={styles.chatText}>Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const PropertyDetails = React.memo(({}: any) => {
  const {theme} = useTheme();
  const property = useMemo(
    () => ({
      title: 'Ocean Park Apartment 3',
      location: 'Hanoi, Vietnam',
      price: '450,000',
      sqft: '150/sq.ft',
      negotiable: true,
      bedrooms: 2,
      bathrooms: 3,
      area: 1000,
      safetyRank: 4457,
      amenities: ['Gym', 'Pool', 'Parking', 'Security'],
      nearby: {
        school: '0.5km',
        hospital: '1km',
        metro: '0.8km',
      },
      coordinates: {
        latitude: -37.82,
        longitude: 144.965,
      },
    }),
    [],
  );

  const details = [
    {label: 'Carpet Area', value: '1000 sq.ft'},
    {label: 'Built-up Area', value: '1200 sq.ft'},
    {label: 'Property Age', value: '2 years'},
    {label: 'Maintenance', value: '$200/month'},
    {label: 'RERA ID', value: 'REG123456789'},
  ];

  const renderAmenity = useCallback(
    (item: string, index: number) => (
      <View key={index} style={styles.amenity}>
        <Button
          style={{
            marginRight: 5,
            backgroundColor: '#E3FFF8',
            borderRadius: 20,
            height: 36,
          }}
          textStyle={{
            color: '#2F8D79',
            fontSize: 14,
          }}
          icon
          iconName="weight-lifter"
          iconSize={18}
          label={item}
          iconColor={'#2F8D79'}
          iconStyle={{
            marginRight: 5,
          }}
          onPress={() => {}}
        />
      </View>
    ),
    [],
  );

  // const renderAdItem = useCallback(
  //   (items: any) => {
  //     return <PropertyCard items={items.item} navigation={navigation} />;
  //   },
  //   [navigation],
  // );

  // const products = useMemo(() => {
  //   return Array.from({length: 2}, (_, i) => ({
  //     id: i.toString(),
  //     title: `Property available in ${i + 1}`,
  //     price: `$${(i + 1) * 100}`,
  //     image: 'https://via.placeholder.com/150',
  //     featured: i === 0 || i === 1, // Only first two are featured
  //   }));
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingBottom: 120}}>
        <Header />
        <View style={styles.header}>
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.locationTitle}>
            <IconButton
              iconSize={16}
              iconColor={theme.colors.text}
              iconName={'map-marker'}
            />
            {property.location}
          </Text>
          <View style={{flexDirection: 'row', alignContent: 'center', top: 10}}>
            <Text
              style={[
                styles.price,
                {color: theme.colors.text, marginRight: 5},
              ]}>
              <IconButton
                iconSize={18}
                iconColor={'#171717'}
                iconName={'currency-inr'}
              />
              {property.price}
            </Text>
            <Text style={styles.squrft}>({property.sqft})</Text>
            <View style={styles.nogotiable}>
              <Text style={styles.nogotiableText}>Negotiable</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.iconsContainer}>
            <IconButton iconSize={20} iconColor={'#2F8D79'} iconName={'car'} />
            <Text style={[styles.iconsTextStle, {color: '#2F8D79'}]}>1225</Text>
            <Text style={[styles.iconsTextStle, {color: '#171717'}]}>
              Bedroom
            </Text>
          </View>
          <View style={styles.iconsContainer}>
            <IconButton
              iconSize={20}
              iconColor={'#2F8D79'}
              iconName={'bathtub'}
            />
            <Text style={[styles.iconsTextStle, {color: '#2F8D79'}]}>1225</Text>
            <Text style={[styles.iconsTextStle, {color: '#171717'}]}>
              Bathroom
            </Text>
          </View>
          <View style={styles.iconsContainer}>
            <IconButton
              iconSize={20}
              iconColor={'#2F8D79'}
              iconName={'ruler-square'}
            />
            <Text style={[styles.iconsTextStle, {color: '#2F8D79'}]}>1225</Text>
            <Text style={[styles.iconsTextStle, {color: '#171717'}]}>
              Square feet
            </Text>
          </View>
          <View style={styles.iconsContainer}>
            <IconButton iconSize={20} iconColor={'#2F8D79'} iconName={'bank'} />
            <Text style={[styles.iconsTextStle, {color: '#2F8D79'}]}>1225</Text>
            <Text style={[styles.iconsTextStle, {color: '#171717'}]}>
              Bank Safety
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <ScrollView
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <Button
              style={{marginRight: 5}}
              label={'Full Furnished'}
              onPress={() => {}}
            />
            <Button
              style={{marginRight: 5}}
              label={'Ready to Move'}
              onPress={() => {}}
            />
            <Button
              style={{marginRight: 5}}
              label={'East facing'}
              onPress={() => {}}
            />
            <Button
              style={{marginRight: 5}}
              label={'East facing'}
              onPress={() => {}}
            />
            <Button
              style={{marginRight: 5}}
              label={'East facing'}
              onPress={() => {}}
            />
          </ScrollView>
        </View>

        <View
          style={{
            backgroundColor: '#EBEBEB',
            borderWidth: 1,
            borderColor: '#EBEBEB',
            width: '100%',
            top: 15,
          }}
        />

        <View style={{padding: 16}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: theme.colors.text,
              top: 10,
            }}>
            Description
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: theme.colors.text,
              margin: 0,
              marginTop: 20,
            }}>
            Luxurious 2 BHK apartment with modern amenities, spacious rooms, and
            premium finishes. Located in prime location with easy access to
            public transport
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#EBEBEB',
            borderWidth: 1,
            borderColor: '#EBEBEB',
            width: '100%',
            top: 15,
          }}
        />

        <View
          style={{
            top: 15,
            margin: 16,
            padding: 16,
            backgroundColor: '#E3FFF8',
            borderRadius: 10,
            height: 56,
            alignItems: 'center',
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: '#88E4CF',
          }}>
          <View
            style={{width: '95%', flexDirection: 'row', alignItems: 'center'}}>
            <IconButton
              iconSize={24}
              iconColor={'#2F8D79'}
              iconName={'calculator'}
              style={{marginRight: 10}}
            />
            <Text
              style={{
                color: '#2F8D79',
                fontSize: 14,
                fontFamily: Fonts.MEDIUM,
                fontWeight: '500',
              }}>
              Calculate your EMI
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <IconButton
              iconSize={24}
              iconColor={'#2F8D79'}
              iconName={'arrow-right'}
            />
          </View>
        </View>

        <Text style={styles.section}>Amenities</Text>
        <View style={styles.amenities}>
          {property.amenities.map(renderAmenity)}
        </View>

        <View
          style={{
            backgroundColor: '#EBEBEB',
            borderWidth: 1,
            borderColor: '#EBEBEB',
            width: '100%',
            top: 15,
          }}
        />

        <Text style={styles.section}>Nearby</Text>
        <View style={styles.nearby}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F3F4F6',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 5,
            }}>
            <Text style={{color: theme.colors.text, fontSize: 14, margin: 2}}>
              School:{' '}
            </Text>
            <Text
              style={{
                color: '#2F8D79',
                fontSize: 14,
                fontFamily: Fonts.MEDIUM,
                fontWeight: '600',
                margin: 5,
              }}>
              {property.nearby.school}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F3F4F6',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 5,
            }}>
            <Text style={{color: theme.colors.text, fontSize: 14, margin: 2}}>
              Hospital:{' '}
            </Text>
            <Text
              style={{
                color: '#2F8D79',
                fontSize: 14,
                fontFamily: Fonts.MEDIUM,
                fontWeight: '600',
                margin: 5,
              }}>
              {property.nearby.school}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F3F4F6',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 5,
            }}>
            <Text style={{color: theme.colors.text, fontSize: 14, margin: 2}}>
              Metro station:{' '}
            </Text>
            <Text
              style={{
                color: '#2F8D79',
                fontSize: 14,
                fontFamily: 'DMSans-Medium',
                fontWeight: '600',
                margin: 5,
              }}>
              {property.nearby.school}
            </Text>
          </View>
        </View>

        <Text style={styles.section}>Location</Text>
        {Platform.OS === 'android' && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              ...property.coordinates,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker coordinate={property.coordinates} />
          </MapView>
        )}
        {Platform.OS !== 'android' && (
          <MapView
            style={styles.map}
            region={{
              ...property.coordinates,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker coordinate={property.coordinates} />
          </MapView>
        )}

        <View
          style={{
            backgroundColor: '#EBEBEB',
            borderWidth: 1,
            borderColor: '#EBEBEB',
            width: '100%',
            top: 15,
          }}
        />
        <View
          style={{
            top: 10,
            flexDirection: 'row',
            padding: 16,
            paddingLeft: 22,
            height: 100,
            justifyContent: 'flex-start',
          }}>
          <View style={{width: '20%'}}>
            <Image
              source={{
                uri: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTB0H8rrBiCbzEYrATIyFrdD6CpYRxjiZGkfdWU8hP9dHAlDU9k_2zAaBQFzr9utfhLYCGzPs_G8LoekI9opFA9sQ',
              }}
              resizeMode="cover"
              style={{height: 52, width: 52, borderRadius: 50}}
            />
          </View>
          <View>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 18,
                fontWeight: 500,
                // marginTop: 2,
                letterSpacing: 1,
              }}>
              Albert Einstine
            </Text>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 14,
                fontWeight: 400,
                // marginTop: 2,
              }}>
              Real estate agent
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#EBEBEB',
            borderWidth: 1,
            borderColor: '#EBEBEB',
            width: '100%',
            // top: 15,
          }}
        />

        <View style={styles.additionalDetailsContainer}>
          <Text style={styles.heading}>Additional Details</Text>
          {details.map(item => (
            <View key={item.value} style={styles.adittionalDetailsRow}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View
          style={{
            backgroundColor: '#EBEBEB',
            borderWidth: 1,
            borderColor: '#EBEBEB',
            width: '100%',
            top: 15,
          }}
        />

        {/* <View style={styles.additionalDetailsContainer}>
          <Text style={styles.heading}>Similar Products</Text>
          <FlatList
            data={products}
            renderItem={renderAdItem}
            keyExtractor={item => item.id}
            numColumns={2}
            centerContent={true}
            // eslint-disable-next-line react-native/no-inline-styles
            contentContainerStyle={{
              top: 20,
              backgroundColor: theme.colors.backgroundHome,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View> */}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', borderRadius: 20},
  header: {padding: 16, borderRadius: 20, backgroundColor: '#fff', bottom: 10},
  title: {fontSize: 20, fontFamily: 'DMSans-Medium', marginBottom: 5},
  locationTitle: {fontSize: 14, fontFamily: Fonts.MEDIUM},
  price: {fontSize: 18, fontFamily: 'DMSans-Medium'},
  squrft: {fontSize: 14, top: 3, marginRight: 5, fontFamily: Fonts.MEDIUM},
  iconsTextStle: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'DMSans-Medium',
  },
  iconsContainer: {
    backgroundColor: '#EBEBEB',
    height: 76,
    width: 80,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
  },
  nogotiable: {
    width: 80,
    borderRadius: 10,
    backgroundColor: '#E3FFF8',
    justifyContent: 'center',
    alignContent: 'center',
  },
  nogotiableText: {
    color: '#2F8D79',
    fontSize: 12,
    textAlign: 'center',
  },
  row: {flexDirection: 'row', justifyContent: 'space-around', padding: 8},
  amenities: {flexDirection: 'row', flexWrap: 'wrap', padding: 8},
  amenity: {flexDirection: 'row', alignItems: 'center', margin: 2},
  amenityText: {marginLeft: 6},
  section: {fontSize: 16, fontWeight: '600', marginLeft: 16, marginTop: 20},
  nearby: {padding: 16, flexDirection: 'row', flexWrap: 'wrap'},
  map: {height: 150, margin: 16, borderRadius: 10},
  button: {
    backgroundColor: '#005f73',
    padding: 16,
    margin: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '40%',
    justifyContent: 'center',
  },
  chatText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  buyButton: {
    backgroundColor: '#2f8f72',
    alignItems: 'center',
    borderRadius: 10,
    width: '40%',
    justifyContent: 'center',
  },
  buyText: {
    color: '#fff',
    fontSize: 16,
  },

  additionalDetailsContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
  heading: {
    fontSize: 16,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
  adittionalDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 5,
  },
  label: {
    color: '#171717',
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#696969',
  },
});
export default React.memo(PropertyDetails);
// , (prevProps, nextProps) => {
//   return prevProps.user.id === nextProps.user.id;
// }
