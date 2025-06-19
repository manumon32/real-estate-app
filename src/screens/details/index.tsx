/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {Fonts} from '@constants/font';
import {useNavigation} from '@react-navigation/native';
import IconButton from '@components/Buttons/IconButton';
import {useTheme} from '@theme/ThemeProvider';
import Button from '@components/Buttons/Button';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// import PropertyCard from '@components/PropertyCard';
import Header from './Header';
import useBoundStore from '@stores/index';
import {Detail} from '@stores/detailSlice';
import ReportAdModal from './ReportAdModal';

const PropertyDetails = React.memo(() => {
  const route = useRoute();
  const {items}: any = route.params;
  const navigation = useNavigation();
  const [error, setError] = useState(false);
  const {details, fetchDetails, detailLoading, clearDetails, detailsError, reportAd} =
    useBoundStore();
  const [property, setProperty] = useState<Detail | null>();
  const [isReportVisible, setIsReportVisible] = useState(false);
  const {theme} = useTheme();

  const renderAmenity = useCallback((item: any, index: number) => {
    return (
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
          iconName={item.iconName}
          iconSize={18}
          label={item.name}
          iconColor={'#2F8D79'}
          iconStyle={{
            marginRight: 5,
          }}
          onPress={() => {}}
        />
      </View>
    );
  }, []);

  const isValidLatLng = (lat: any, lng: any): boolean => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    return (
      !isNaN(latNum) &&
      !isNaN(lngNum) &&
      latNum >= -90 &&
      latNum <= 90 &&
      lngNum >= -180 &&
      lngNum <= 180
    );
  };

  const renderNearby = useCallback(
    (item: any, index: number) => {
      return (
        <View
          key={index}
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
            {item.name}:
          </Text>
          <Text
            style={{
              color: '#2F8D79',
              fontSize: 14,
              fontFamily: Fonts.MEDIUM,
              fontWeight: '600',
              margin: 5,
            }}>
            {item.value + item.unit}
          </Text>
        </View>
      );
    },
    [theme.colors.text],
  );

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
  useEffect(() => {
    items?._id && fetchDetails(items?._id);
  }, [fetchDetails, items]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setProperty(null);
        clearDetails();
      };
    }, [clearDetails]),
  );

  React.useEffect(() => {
    if (detailsError) {
      navigation.goBack();
    }
    setProperty(details);
  }, [details, detailsError, navigation]);

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
      {detailLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingBottom: 120}}>
        <Header details={property ? property : items} />
        <View style={styles.header}>
          <Text style={styles.title}>
            {property?.title ? property?.title : items?.title}
          </Text>
          <Text style={styles.locationTitle}>
            <IconButton
              iconSize={16}
              iconColor={theme.colors.text}
              iconName={'map-marker'}
            />
            {property?.address ? property?.address : items?.address}
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
              {property?.price ? property?.price : items?.price}
            </Text>
            <Text style={styles.squrft}>({property?.areaSize}/ Sq.ft)</Text>
            <View style={styles.nogotiable}>
              <Text style={styles.nogotiableText}>Negotiable</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          {property?.numberOfBedrooms && (
            <View style={styles.iconsContainer}>
              <IconButton
                iconSize={20}
                iconColor={'#2F8D79'}
                iconName={'car'}
              />
              <Text style={[styles.iconsTextStle, {color: '#2F8D79'}]}>
                {property?.numberOfBedrooms}
              </Text>
              <Text style={[styles.iconsTextStle, {color: '#171717'}]}>
                Bedroom
              </Text>
            </View>
          )}
          {property?.numberOfBathrooms && (
            <View style={styles.iconsContainer}>
              <IconButton
                iconSize={20}
                iconColor={'#2F8D79'}
                iconName={'bathtub'}
              />
              <Text style={[styles.iconsTextStle, {color: '#2F8D79'}]}>
                {property?.numberOfBathrooms}
              </Text>
              <Text style={[styles.iconsTextStle, {color: '#171717'}]}>
                Bathroom
              </Text>
            </View>
          )}
          <View style={styles.iconsContainer}>
            <IconButton
              iconSize={20}
              iconColor={'#2F8D79'}
              iconName={'ruler-square'}
            />
            <Text style={[styles.iconsTextStle, {color: '#2F8D79'}]}>
              {property?.areaSize}
            </Text>
            <Text style={[styles.iconsTextStle, {color: '#171717'}]}>
              {'Sq.ft'}
            </Text>
          </View>
          {property?.loanEligible && (
            <View style={styles.iconsContainer}>
              <IconButton
                iconSize={20}
                iconColor={'#2F8D79'}
                iconName={'bank'}
              />
              <Text style={[styles.iconsTextStle, {color: '#171717'}]}>
                Loan Eligible
              </Text>
            </View>
          )}
        </View>

        <View style={styles.row}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {property?.furnishingStatusId?.name && (
              <Button
                style={{margin: 5}}
                label={property?.furnishingStatusId?.name}
                onPress={() => {}}
              />
            )}
            {property?.availabilityStatusId?.name && (
              <Button
                style={{margin: 5}}
                label={property?.availabilityStatusId?.name}
                onPress={() => {}}
              />
            )}
            {property?.ownershipTypeId?.name && (
              <Button
                style={{margin: 5}}
                label={property?.ownershipTypeId?.name}
                onPress={() => {}}
              />
            )}
            {property?.facingDirectionId?.name && (
              <Button
                style={{margin: 5}}
                label={
                  'Facing Direction - ' + property?.facingDirectionId?.name
                }
                onPress={() => {}}
              />
            )}
          </View>
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
            Details
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: theme.colors.text,
              margin: 0,
              marginTop: 20,
            }}>
            {property?.description}
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

        {property?.amenityIds && property?.amenityIds?.length > 0 && (
          <>
            <Text style={styles.section}>Amenities</Text>
            <View style={styles.amenities}>
              {property?.amenityIds?.map(renderAmenity)}
            </View>
          </>
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
        {/* @ts-ignore */}
        {property?.nearbyLandmarks?.length > 0 && (
          <>
            <Text style={styles.section}>Nearby</Text>
            <View style={styles.nearby}>
              {property?.nearbyLandmarks?.map(renderNearby)}
            </View>
          </>
        )}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.section}>Location</Text>
          <TouchableOpacity onPress={() => setIsReportVisible(true)}>
            <Text
              style={[
                styles.section,
                {
                  right: 10,
                  color: 'blue',
                  textDecorationLine: 'underline',
                  textDecorationStyle: 'solid',
                  margin: 5,
                  fontFamily: Fonts.BOLD,
                },
              ]}>
              Report this Ad
            </Text>
          </TouchableOpacity>
        </View>
        {Platform.OS === 'android' &&
          isValidLatLng(
            property?.location?.coordinates[0],
            property?.location?.coordinates[1],
          ) && (
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: Number(property?.location?.coordinates[1]),
                longitude: Number(property?.location?.coordinates[0]),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}>
              <Marker
                coordinate={{
                  latitude: Number(property?.location?.coordinates[1]),
                  longitude: Number(property?.location?.coordinates[0]),
                }}
              />
            </MapView>
          )}
        {Platform.OS !== 'android' && (
          <MapView
            style={styles.map}
            region={{
              latitude: Number(property?.location?.coordinates[1]),
              longitude: Number(property?.location?.coordinates[0]),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker
              coordinate={{
                latitude: Number(property?.location?.coordinates[1]),
                longitude: Number(property?.location?.coordinates[0]),
              }}
            />
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
              source={
                error || !property?.customerId?.profilePicture
                  ? require('@assets/images/images.jpeg')
                  : {
                      uri: property?.customerId?.profilePicture,
                      cache: Image.cacheControl.immutable,
                    }
              }
              onError={() => setError(true)}
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
                marginTop: 10,
                letterSpacing: 1,
              }}>
              {property?.customerId?.name}
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

        {(property?.carpetArea ||
          property?.builtUpArea ||
          property?.superBuiltUpArea) && (
          <View style={styles.additionalDetailsContainer}>
            <Text style={styles.heading}>Additional Details</Text>
            {property?.carpetArea && (
              <View style={styles.adittionalDetailsRow}>
                <Text style={styles.label}>{'Carpet Area'}</Text>
                <Text style={styles.value}>
                  {property?.carpetArea} /
                  {property?.carpetAreaUnitId?.name
                    ? property?.carpetAreaUnitId?.name
                    : 'Sq.ft'}
                </Text>
              </View>
            )}
            {property?.builtUpArea && (
              <View style={styles.adittionalDetailsRow}>
                <Text style={styles.label}>{'BuiltUp Area'}</Text>
                <Text style={styles.value}>
                  {property?.builtUpArea} /
                  {property?.builtUpAreaUnitId?.name
                    ? property?.builtUpAreaUnitId?.name
                    : 'Sq.ft'}
                </Text>
              </View>
            )}
            {property?.superBuiltUpArea && (
              <View style={styles.adittionalDetailsRow}>
                <Text style={styles.label}>{'Super BuiltUp Area'}</Text>
                <Text style={styles.value}>
                  {property?.superBuiltUpArea} /
                  {property?.superBuiltAreaUnitId?.name
                    ? property?.superBuiltAreaUnitId?.name
                    : 'Sq.ft'}
                </Text>
              </View>
            )}
          </View>
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

      <ReportAdModal
        visible={isReportVisible}
        onClose={() => setIsReportVisible(false)}
        onSubmit={(data: any) => {
          let payload = {
            propertyId: details?._id,
            reason: data.reason,
            comment: data.comment,
          };
          reportAd(payload);
        }}
      />
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
    margin: 5,
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
  row: {flexDirection: 'row', padding: 8},
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
  overlay: {
    ...StyleSheet.absoluteFillObject, // fills the screen
    backgroundColor: 'rgba(0, 0, 0, 0.78)', // transparent dark overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // ensure it's on top
  },
});

export default React.memo(PropertyDetails);
