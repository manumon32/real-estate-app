/* eslint-disable no-catch-shadow */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {Fonts} from '@constants/font';
import {useNavigation} from '@react-navigation/native';
import IconButton from '@components/Buttons/IconButton';
import {useTheme} from '@theme/ThemeProvider';
import Button from '@components/Buttons/Button';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Toast from 'react-native-toast-message';

// import PropertyCard from '@components/PropertyCard';
import Header from './Header';
import useBoundStore from '@stores/index';
import {Detail} from '@stores/detailSlice';
import ReportAdModal from './ReportAdModal';
import {createRoomAPI, postAdAPI} from '@api/services';
import {getSocket} from '@soket/index';
import BankSelectModal from '@components/Modal/BankListModal';
import {navigate} from '@navigation/RootNavigation';
import CustomDummyLoader from '@components/SkeltonLoader/CustomDummyLoader';

const AdStatusEnum: any = {
  pending: 'Pending',
  active: 'Active',
  rejected: 'Rejected',
  expired: 'Expired',
  blocked: 'Blocked',
  deactivated: 'Deactivated',
  sold: 'Sold',
};

const PropertyDetails = React.memo(() => {
  const route = useRoute();
  const {items}: any = route.params;
  const navigation = useNavigation();
  const [error, setError] = useState(false);
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const {
    details,
    fetchDetails,
    detailLoading,
    clearDetails,
    detailsError,
    reportAd,
    token,
    clientId,
    bearerToken,
    setChatRoomId,
    setVisible,
    user,
    verification_loading,
    startVerification,
    startBankVerification,
    fetchBanks,
    banks,
  } = useBoundStore();
  const [property, setProperty] = useState<Detail | null>();
  const [isReportVisible, setIsReportVisible] = useState(false);
  const {theme} = useTheme();
  const isOwner = details?.customerId?._id === user?._id;

  const markasSold = async (id: string) => {
    let payload = {
      id: id,
      adStatus: 'sold',
    };
    try {
      await postAdAPI(
        payload,
        {
          token: token,
          clientId: clientId,
          bearerToken: bearerToken,
        },
        'put',
      );
      items?._id && fetchDetails(items?._id);
    } catch (err) {}
  };

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

  const sendSocket = (payload: any) => {
    const socket = getSocket();

    if (socket?.connected) {
      socket.emit('newRoomCreated', payload);
    } else {
      console.log('Socket is not connected yet');
    }
  };

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const createRoom = async (payload: any) => {
    let newpayload = {...payload, postOwnerId: payload.postOwnerId?._id};
    try {
      const res = await createRoomAPI(newpayload, {
        token,
        clientId,
        bearerToken,
      });
      console.log(res);
      if (res?._id) {
        sendSocket(newpayload);
        setChatRoomId({[newpayload.propertyId]: res?._id});
        console.log('propertyId', {
          ...payload,
          propertyId: res?._id,
        });
        // @ts-ignore
        navigation.navigate('ChatDetails', {
          items: {
            ...payload,
            propertyId: res?._id,
            property: {...items, coverImage: items.imageUrls[0] ?? null},
          },
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        position: 'bottom',
      });
    }
  };

  const Footer = ({details, bearerToken, createRoom, setVisible}: any) => {
    return (
      <View style={styles.footer}>
        {isOwner ? (
          <>
            <Pressable
              // @ts-ignore
              onPress={() => navigation.navigate('PostAd', {items: details})}
              style={styles.chatButton}>
              <Icon name="pencil" size={20} color="#000" />
              <Text style={styles.chatText}>Edit</Text>
            </Pressable>
            <Pressable
              onPress={() => markasSold(details?._id)}
              style={styles.buyButton}>
              <Text style={styles.buyText}>
                {details?.adStatus !== 'sold'
                  ? 'Mark as sold'
                  : AdStatusEnum[details?.adStatus]}
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              onPress={() => {
                if (bearerToken) {
                  let payload = {
                    propertyId: details?._id,
                    postOwnerId: details?.customerId,
                  };
                  createRoom(payload);
                } else {
                  setVisible();
                }
              }}
              style={styles.chatButton}>
              <Icon name="chat-outline" size={20} color="#000" />
              <Text style={styles.chatText}>Chat</Text>
            </Pressable>
            <Pressable style={styles.buyButton}>
              <Text style={styles.buyText}>Buy Now</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  };

  useEffect(() => {
    if (!items?._id) {
      // @ts-ignore
      navigation.navigate('Main');
    } else {
      fetchBanks(items?._id);
    }
  }, [fetchBanks, items, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if (!items?._id) {
        // @ts-ignore
        navigation.navigate('Main');
      } else {
        fetchDetails(items?._id);
      }
      return () => {
        setProperty(null);
        clearDetails();
      };
    }, [clearDetails, fetchDetails, items?._id, navigation]),
  );

  React.useEffect(() => {
    if (detailsError) {
      navigation.goBack();
    }
    setProperty(details);
  }, [details, detailsError, navigation]);

  const verifyListing = () => {
    let payload = {
      propertyId: property?._id,
      propertyLocation: {
        type: 'Point',
        coordinates: [
          property?.location?.coordinates[1],
          property?.location?.coordinates[0],
        ],
      },
    };
    startVerification(payload);
  };

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
      {detailLoading && !items?.title && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingBottom: 120}}>
        <Header details={property ? property : items} />

        {items?.title && (
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
            <View
              style={{flexDirection: 'row', alignContent: 'center', top: 10}}>
              <Text
                style={[
                  styles.price,
                  {color: theme.colors.text, marginRight: 5},
                ]}>
                {/* <IconButton
                iconSize={18}
                iconColor={'#171717'}
                iconName={'currency-inr'}
              /> */}
                {property?.price
                  ? formatINR(property?.price)
                  : formatINR(items?.price)}
              </Text>
              <Text style={styles.squrft}>({property?.areaSize}/ Sq.ft)</Text>
              <View style={styles.nogotiable}>
                <Text style={styles.nogotiableText}>Negotiable</Text>
              </View>
            </View>
          </View>
        )}
        {detailLoading && <CustomDummyLoader />}
        {details?.isVerified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✅ Verified</Text>
          </View>
        )}
        {/* <Tooltip
          isVisible={showTip}
          content={
            <Text>This bank is verified and ready to offer a home loan</Text>
          }
          placement="bottom"
          onClose={() => setShowTip(false)}>
        </Tooltip> */}
        {!detailLoading && (
          <>
            {banks.filter((item: any) => item.status === 'verified').length >
              0 && (
              <>
                <Text style={styles.section}>Loan available</Text>
                <View
                  style={{
                    paddingHorizontal: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: 8,
                    }}>
                    {banks.map(
                      (item: any, index: number) =>
                        item.status === 'verified' && (
                          <View key={index} style={styles.bankBadge}>
                            {item.bankId.name ? (
                              <Image
                                source={{
                                  uri: item.bankId.logoUrl,
                                  priority: Image.priority.normal,
                                  cache: Image.cacheControl.immutable,
                                }}
                                resizeMode="contain"
                                style={{height: 20, width: 20, margin: 2}}
                              />
                            ) : (
                              '🏦'
                            )}
                            <Text style={styles.bankBadgeText}>
                              {item.bankId.name}
                            </Text>
                          </View>
                        ),
                    )}
                  </View>
                </View>
              </>
            )}
            {isOwner && (
              <Pressable
                onPress={() => {
                  verifyListing();
                }}
                style={{
                  // top: 15,
                  margin: 16,
                  padding: 16,
                  backgroundColor: '#2F8D79',
                  borderRadius: 10,
                  height: 56,
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#88E4CF',
                }}>
                <View
                  style={{
                    width: '95%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: Fonts.MEDIUM,
                      fontWeight: '500',
                    }}>
                    {details?.isVerified
                      ? 'Your listing is verified'
                      : 'Verify your listing to get more offers.'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  {!verification_loading && (
                    <IconButton
                      iconSize={24}
                      iconColor={'#fff'}
                      iconName={'arrow-right'}
                    />
                  )}

                  {verification_loading && (
                    <ActivityIndicator size={'small'} color={'#fff'} />
                  )}
                </View>
              </Pressable>
            )}

            <View style={styles.row}>
              {property?.numberOfBedrooms && (
                <View style={styles.iconsContainer}>
                  <IconButton
                    iconSize={20}
                    iconColor={'#2F8D79'}
                    iconName={'bed'}
                  />
                  <Text style={[styles.iconsTextStle, {color: '#2F8D79'}]}>
                    {property?.numberOfBedrooms}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[styles.iconsTextStle, {color: '#171717'}]}>
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
                  <Text
                    numberOfLines={1}
                    style={[styles.iconsTextStle, {color: '#171717'}]}>
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
                <Text
                  numberOfLines={1}
                  style={[styles.iconsTextStle, {color: '#171717'}]}>
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

            <Text style={styles.section}>Details</Text>
            <View style={{paddingHorizontal: 16}}>
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
            {isOwner && (
              <Pressable
                onPress={async () => {
                  (await items?._id) && startBankVerification(items?._id);
                  setBankModalVisible(true);
                }}
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
                  style={{
                    width: '95%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <IconButton
                    iconSize={24}
                    iconColor={'#2F8D79'}
                    iconName={'finance'}
                    style={{marginRight: 10}}
                  />
                  <Text
                    style={{
                      color: '#2F8D79',
                      fontSize: 14,
                      fontFamily: Fonts.MEDIUM,
                      fontWeight: '500',
                    }}>
                    Check your loan offers.
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <IconButton
                    iconSize={24}
                    iconColor={'#2F8D79'}
                    iconName={'arrow-right'}
                  />
                </View>
              </Pressable>
            )}

            {
              <>
                <Text style={styles.section}>Additional Details</Text>
                <View style={styles.additionalDetailsContainer}>
                  {property?.areaSize ? (
                    <View style={styles.adittionalDetailsRow}>
                      <Text style={styles.label}>{'Area Size'}</Text>
                      <Text style={styles.value}>
                        {property?.areaSize} /{'Sq.ft'}
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                  {property?.carpetArea ? (
                    <View style={styles.adittionalDetailsRow}>
                      <Text style={styles.label}>{'Carpet Area'}</Text>
                      <Text style={styles.value}>
                        {property?.carpetArea} /
                        {property?.carpetAreaUnitId?.name
                          ? property?.carpetAreaUnitId?.name
                          : 'Sq.ft'}
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                  {property?.builtUpArea ? (
                    <View style={styles.adittionalDetailsRow}>
                      <Text style={styles.label}>{'BuiltUp Area'}</Text>
                      <Text style={styles.value}>
                        {property?.builtUpArea} /
                        {property?.builtUpAreaUnitId?.name
                          ? property?.builtUpAreaUnitId?.name
                          : 'Sq.ft'}
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                  {property?.superBuiltUpArea ? (
                    <View style={styles.adittionalDetailsRow}>
                      <Text style={styles.label}>{'Super BuiltUp Area'}</Text>
                      <Text style={styles.value}>
                        {property?.superBuiltUpArea} /
                        {property?.superBuiltAreaUnitId?.name
                          ? property?.superBuiltAreaUnitId?.name
                          : 'Sq.ft'}
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              </>
            }

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

            {!isOwner && (
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.section}>Location</Text>
                <Pressable onPress={() => setIsReportVisible(true)}>
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
                </Pressable>
              </View>
            )}

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
          </>
        )}
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

      <Footer
        details={details}
        user={user}
        bearerToken={bearerToken}
        createRoom={createRoom}
        setVisible={setVisible}
      />

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

      <BankSelectModal
        visible={bankModalVisible}
        onDismiss={() => setBankModalVisible(false)}
        onSelect={(data: any) => {
          setSelectedBank(data);
          navigate('VerifyBankList', {items: {...data, id: data?._id}});
        }}
        selectedBank={selectedBank}
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
  section: {fontSize: 16, fontWeight: '600', marginLeft: 12, marginTop: 20},
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
  bankBadge: {
    backgroundColor: '#E6F0FA',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bankBadgeText: {
    color: 'rgba(0, 136, 255, 0.78)', //'#0073E6',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  verifiedBadge: {
    backgroundColor: '#E6F9EC', // light green background
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 16,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    color: '#2E7D32', // dark green text
    fontWeight: '600',
    fontSize: 12,
  },
});

export default React.memo(PropertyDetails);
