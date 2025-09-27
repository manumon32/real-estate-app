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
  useColorScheme,
  Alert,
  Linking,
  TouchableOpacity,
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
import {createRoomAPI, postAdAPI, saveAppointMent} from '@api/services';
import {getSocket} from '@soket/index';
import BankSelectModal from '@components/Modal/BankListModal';
import {navigate} from '@navigation/RootNavigation';
import CustomDummyLoader from '@components/SkeltonLoader/CustomDummyLoader';
import DateTimeModal from '@components/Modal/DateTimeModal';
import SimilarAds from './SimilarAds';

const AdStatusEnum: any = {
  pending: 'Pending',
  active: 'Active',
  rejected: 'Rejected',
  expired: 'Expired',
  blocked: 'Blocked',
  deactivated: 'Deactivated',
  sold: 'Closed',
};

const PropertyDetails = React.memo(() => {
  const route = useRoute();
  const {items, id}: any = route.params;
  const navigation = useNavigation();
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [showModal, setShowModal] = useState(false);
  const {
    details,
    fetchDetails,
    detailLoading,
    clearDetails,
    detailsError,
    reportAd,
    token,
    clientId,
    location,
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
  const isDarkMode = useColorScheme() === 'dark';
  const sectionColor = {color: theme.colors.text};

  const markasSold = async (adId: string) => {
    let payload = {
      id: adId,
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

      Toast.show({
        type: 'success',
        text1: 'Your lising is successfully marked as sold .',
        position: 'bottom',
      });
      items?._id && fetchDetails(items?._id);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong, please try again later.',
        position: 'bottom',
      });
    }
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

  const renderNearby = useCallback((item: any, index: number) => {
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
        <Text style={{fontSize: 14, margin: 2}}>{item.name}:</Text>
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
  }, []);

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
            property: {...property, coverImage: property?.imageUrls[0] ?? null},
          },
        });
      }
    } catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        position: 'bottom',
      });
    }
  };

  const openMap = (latitude: any, longitude: any) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${latitude},${longitude}`;
    const label = 'Custom Location';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url!).catch(() => {
      Alert.alert('Error', 'Unable to open the map app.');
    });
  };

  useEffect(() => {
    console.log('DEtails Pages', items);
    if (items?._id && !id) {
      bearerToken && fetchBanks(items?._id ?? id);
    }
  }, [bearerToken, fetchBanks, id, items, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if (!items?._id && !id) {
        // @ts-ignore
        navigation.navigate('Main');
      } else {
        fetchDetails(items?._id ?? id);
      }
      return () => {
        setProperty(null);
        clearDetails();
      };
    }, [clearDetails, fetchDetails, id, items?._id, navigation]),
  );

  useEffect(() => {
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
          property?.location?.coordinates[0],
          property?.location?.coordinates[1],
        ],
      },
    };
    startVerification(payload);
  };

  const submitReportAd = (data: any) => {
    let payload = {
      propertyId: details?._id,
      reason: data.reason,
      comment: data.comment,
    };
    reportAd(payload);
  };

  const onBankSelectDismis = () => {
    setBankModalVisible(false);
    setSelectedBank('');
  };
  const onBankSelect = (data: any) => {
    setSelectedBank(data);
    setBankModalVisible(false);
    navigate('VerifyBankList', {items: {...data, _id: data?._id}});
  };

  const saveAppointMents = async (date: Date) => {
    let payload = {
      propertyId: details?._id,
      scheduledAt: date,
    };
    try {
      await saveAppointMent(
        payload,
        {
          token,
          clientId,
          bearerToken,
        },
        'post',
      );
      Toast.show({
        type: 'success',
        text1: 'Appointment Request Sent',
        position: 'bottom',
      });
      property?._id && fetchDetails(property?._id);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong.',
        position: 'bottom',
      });
    }
  };

  const Footer = ({details, bearerToken, createRoom, setVisible}: any) => {
    return (
      !detailLoading && (
        <View
          style={[styles.footer, {backgroundColor: theme.colors.background}]}>
          {isOwner ? (
            <>
              {details?.adStatus !== 'sold' && (
                <Pressable
                  onPress={() =>
                    // @ts-ignore
                    navigation.navigate('PostAd', {items: details})
                  }
                  style={styles.chatButton}>
                  <Icon name="pencil" size={20} color="#000" />
                  <Text style={styles.chatText}>Edit</Text>
                </Pressable>
              )}
              {(details?.adStatus === 'active' ||
                details?.adStatus === 'sold') && (
                <Pressable
                  onPress={() =>
                    details?.adStatus !== 'sold' &&
                    Alert.alert(
                      'Mark as Sold?',
                      'Are you sure you want to mark this listing as sold? This action cannot be undone.',
                      [
                        {text: 'Cancel', style: 'cancel'},
                        {
                          text: 'Mark as sold',
                          onPress: () => markasSold(details?._id),
                        },
                      ],
                    )
                  }
                  style={
                    details?.adStatus === 'sold'
                      ? styles.chatButtonFullSold
                      : styles.buyButton
                  }>
                  <Text
                    style={[
                      styles.buyText,
                      details?.adStatus === 'sold' && {color: '#4B4B9B'},
                    ]}>
                    {details?.adStatus !== 'sold'
                      ? 'Mark as sold'
                      : AdStatusEnum[details?.adStatus]}
                  </Text>
                </Pressable>
              )}
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
                style={styles.chatButtonFull}>
                <Icon name="chat-outline" size={20} color="#fff" />
                <Text
                  style={[
                    styles.chatText,
                    {textAlign: 'center', color: '#fff'},
                  ]}>
                  Chat
                </Text>
              </Pressable>
              {/* <Pressable style={styles.buyButton}>
              <Text style={styles.buyText}>Buy Now</Text>
            </Pressable> */}
            </>
          )}
        </View>
      )
    );
  };

  const SimilarAdContainer = () => {
    return property?.listingTypeId?._id || property?.propertyTypeId?._id ? (
      <>
        <Text style={[styles.section, sectionColor, {marginBottom: 10}]}>
          Similar Ads
        </Text>
        <View
          style={[
            {
              backgroundColor: theme.colors.backgroundHome,
              paddingBottom: 10,
            },
          ]}>
          <SimilarAds
            token={token}
            clientId={clientId}
            listingTypeId={property?.listingTypeId?._id}
            propertyTypeId={property?.propertyTypeId?._id}
            location={location}
            propertyId={details?._id}
          />
        </View>
      </>
    ) : (
      <></>
    );
  };

  const TitleContainer = () => {
    return (
      (items?.title || property?.title) && (
        <View
          style={[
            styles.header,
            isDarkMode && {
              ...styles.darkHeader,
              backgroundColor: theme.colors.background,
            },
          ]}>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            {property?.title ? property?.title : items?.title}
          </Text>

          <View style={styles.priceContainer}>
            <Text
              style={[
                styles.price,
                {color: theme.colors.text, marginRight: 5},
              ]}>
              {property?.price
                ? formatINR(property?.price)
                : formatINR(items?.price)}
            </Text>
            <Text style={[styles.squrft, {color: theme.colors.text}]}>
              ({property?.areaSize}/ sq.ft)
            </Text>
            <View style={styles.nogotiable}>
              <Text style={styles.nogotiableText}>Negotiable</Text>
            </View>
          </View>
          <Text
            style={[
              styles.locationTitle,
              {color: theme.colors.text, ...styles.locationContainer},
            ]}>
            <IconButton
              iconSize={16}
              iconColor={theme.colors.text}
              iconName={'map-marker'}
            />
            {property?.address ? property?.address : items?.address}
          </Text>

          <View style={styles.locationContainerFooter}>
            <Text
              style={[
                styles.locationTitle,
                {color: theme.colors.text, marginRight: 5},
              ]}>
              {!detailLoading &&
                (property?.adStatus === 'sold'
                  ? 'Sold on ' +
                    new Date(property?.soldDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Posted on ' +
                    // @ts-ignore
                    new Date(property?.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }))}
            </Text>
          </View>
        </View>
      )
    );
  };

  const LoaderContainer = () => {
    return (
      <View style={styles.flexRow}>
        {detailLoading && <CustomDummyLoader />}
        {details?.isVerified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✅ Verified</Text>
          </View>
        )}
        {details?.reraApproved && (
          <View style={[styles.verifiedBadge, {right: 15}]}>
            <Text style={styles.verifiedText}>
              ✅ Rera Approved {details?.reraId ? ': ' + details?.reraId : ''}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const DetailPageContainer = () => {
    return !detailLoading ? (
      <>
        {banks.filter((item: any) => item.status === 'verified').length > 0 && (
          <>
            <Text style={[styles.section, sectionColor]}>Loan available</Text>
            <View style={styles.bankContainer}>
              <View style={styles.bankcontentStyle}>
                {banks.map(
                  (item: any, index: number) =>
                    item.status === 'verified' && (
                      <View key={index} style={styles.bankBadge}>
                        {item?.bankId?.name ? (
                          <Image
                            source={{
                              uri: item.bankId.logoUrl,
                              priority: Image.priority.normal,
                              cache: Image.cacheControl.immutable,
                            }}
                            resizeMode="contain"
                            style={styles.bankLogoStyle}
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
        {isOwner &&
          (details?.adStatus === 'blocked' ||
            details?.adStatus === 'rejected') && (
            <Pressable
              onPress={() => {
                verifyListing();
              }}
              style={styles.adStatusContainerStyle}>
              <View style={styles.adStatusContainer}>
                <Text style={styles.adStatusTextSyle}>
                  {details?.adStatus === 'blocked'
                    ? 'This Listing is Blocked'
                    : 'This Listing Rejected'}
                </Text>
              </View>
            </Pressable>
          )}
        {isOwner && details?.adStatus === 'active' && (
          <Pressable
            onPress={() => {
              verifyListing();
            }}
            style={styles.adStatusContainerStylePending}>
            <View style={styles.adStatusContainer}>
              <Text style={styles.statusVerifiedStyle}>
                {details?.isVerified
                  ? 'Your listing is verified'
                  : details?.isVerificationStarted
                  ? 'Check your verification status'
                  : 'Verify your listing to get more offers.'}
              </Text>
            </View>
            <View style={styles.flexRow}>
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
        {!isOwner && details?.adStatus === 'active' && bearerToken && (
          <Pressable
            onPress={() => {
              if (
                details?.appointmentStatus === 'active' ||
                details?.appointmentStatus === 'rejected'
              ) {
                setShowModal(true);
              } else {
                // @ts-ignore
                navigation.navigate('Appointments', {
                  items: {type: 'requestedAppointments'},
                });
              }
            }}
            style={{
              ...styles.visitContainer,
              backgroundColor:
                property?.appointmentStatus === 'pending'
                  ? '#ea860bff'
                  : '#2F8D79',
              borderColor:
                property?.appointmentStatus === 'pending'
                  ? '#ea860bff'
                  : '#2F8D79',
            }}>
            <IconButton
              iconSize={24}
              iconColor={'#ffffffff'}
              iconName={'calendar'}
              style={{marginRight: 10}}
            />
            <View style={styles.planvisitTextContainer}>
              <Text style={styles.planVisitTextStyle}>
                {property?.appointmentStatus === 'active'
                  ? 'Plan a Site Visit'
                  : property?.appointmentStatus === 'pending'
                  ? 'Your Visit request is pending'
                  : property?.appointmentStatus === 'scheduled'
                  ? 'Your Visit is Scheduled'
                  : 'Plan a Site Visit'}
              </Text>
            </View>
            <View style={styles.flexRow}>
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
          {property?.numberOfBedrooms ? (
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
          ) : (
            <></>
          )}
          {property?.numberOfBathrooms ? (
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
          ) : (
            <></>
          )}
          {property?.areaSize && (
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
                {'sq.ft'}
              </Text>
            </View>
          )}
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
                style={styles.furnishedButtonStyle}
                label={property?.furnishingStatusId?.name}
                onPress={() => {}}
              />
            )}
            {property?.availabilityStatusId?.name && (
              <Button
                style={styles.furnishedButtonStyle}
                label={property?.availabilityStatusId?.name}
                onPress={() => {}}
              />
            )}

            {property?.bachelorsAllowed && (
              <Button
                style={styles.furnishedButtonStyle}
                label={'Bachelors allowed'}
                onPress={() => {}}
              />
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={[styles.section, sectionColor]}>Details</Text>
        <View style={styles.bankContainer}>
          <Text
            style={[
              styles.detailsTextStyle,
              {
                color: theme.colors.text,
              },
            ]}>
            {property?.description}
          </Text>
        </View>

        <View style={styles.divider} />
        {isOwner &&
          details?.adStatus === 'active' &&
          details?.showLoanOffers && (
            <Pressable
              onPress={async () => {
                (await items?._id) && startBankVerification(items?._id);
                setBankModalVisible(true);
              }}
              style={styles.loanOfferContainer}>
              <View style={styles.adStatusContainer}>
                <IconButton
                  iconSize={24}
                  iconColor={'#2F8D79'}
                  iconName={'finance'}
                  style={{marginRight: 10}}
                />
                <Text style={styles.emiCalculatorText}>
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
        {!isOwner &&
          details?.adStatus === 'active' &&
          details?.showEmiCalculator && (
            <Pressable
              onPress={async () => {
                // @ts-ignore
                navigation.navigate('LoanCalculator', {
                  price: property?.price ? property?.price : items?.price,
                });
              }}
              style={styles.loanOfferContainer}>
              <View style={styles.adStatusContainer}>
                <IconButton
                  iconSize={24}
                  iconColor={'#2F8D79'}
                  iconName={'calculator'}
                  style={{marginRight: 10}}
                />
                <Text style={styles.emiCalculatorText}>Emi Calculator</Text>
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
            <Text style={[styles.section, sectionColor]}>
              Additional Details
            </Text>
            <View
              style={[
                styles.additionalDetailsContainer,
                {backgroundColor: theme.colors.background},
              ]}>
              {property?.propertyTypeId?.name && (
                <View style={styles.adittionalDetailsRow}>
                  <Text style={[styles.label, sectionColor]}>{'Type'}</Text>
                  <Text style={[styles.value, sectionColor]}>
                    {property?.propertyTypeId?.name}
                  </Text>
                </View>
              )}
              {property?.ownershipTypeId?.name && (
                <View style={styles.adittionalDetailsRow}>
                  <Text style={[styles.label, sectionColor]}>
                    {'Ownership'}
                  </Text>
                  <Text style={[styles.value, sectionColor]}>
                    {property?.ownershipTypeId?.name}
                  </Text>
                </View>
              )}
              {property?.areaSize ? (
                <View style={styles.adittionalDetailsRow}>
                  <Text style={[styles.label, sectionColor]}>
                    {'Area Size'}
                  </Text>
                  <Text style={[styles.value, sectionColor]}>
                    {property?.areaSize} /{'sq.ft'}
                  </Text>
                </View>
              ) : (
                <></>
              )}
              {property?.carpetArea ? (
                <View style={styles.adittionalDetailsRow}>
                  <Text style={[styles.label, sectionColor]}>
                    {'Carpet Area'}
                  </Text>
                  <Text style={[styles.value, sectionColor]}>
                    {property?.carpetArea} /
                    {property?.carpetAreaUnitId?.name
                      ? property?.carpetAreaUnitId?.name
                      : 'sq.ft'}
                  </Text>
                </View>
              ) : (
                <></>
              )}
              {property?.builtUpArea ? (
                <View style={styles.adittionalDetailsRow}>
                  <Text style={[styles.label, sectionColor]}>
                    {'BuiltUp Area'}
                  </Text>
                  <Text style={[styles.value, sectionColor]}>
                    {property?.builtUpArea} /
                    {property?.builtUpAreaUnitId?.name
                      ? property?.builtUpAreaUnitId?.name
                      : 'sq.ft'}
                  </Text>
                </View>
              ) : (
                <></>
              )}
              {property?.superBuiltUpArea ? (
                <View style={styles.adittionalDetailsRow}>
                  <Text style={[styles.label, sectionColor]}>
                    {'Super BuiltUp Area'}
                  </Text>
                  <Text style={[styles.value, sectionColor]}>
                    {property?.superBuiltUpArea} /
                    {property?.superBuiltAreaUnitId?.name
                      ? property?.superBuiltAreaUnitId?.name
                      : 'sq.ft'}
                  </Text>
                </View>
              ) : (
                <></>
              )}

              {property?.facingDirectionId?.name && (
                <View style={styles.adittionalDetailsRow}>
                  <Text style={[styles.label, sectionColor]}>{'Facing'}</Text>
                  <Text style={[styles.value, sectionColor]}>
                    {property?.facingDirectionId?.name}
                  </Text>
                </View>
              )}
              {property?.listedById?.name && (
                <View style={styles.adittionalDetailsRow}>
                  <Text style={[styles.label, sectionColor]}>
                    {'Listed By'}
                  </Text>
                  <Text style={[styles.value, sectionColor]}>
                    {property?.listedById?.name}
                  </Text>
                </View>
              )}
            </View>
          </>
        }

        <View style={styles.divider} />
        {property?.amenityIds && property?.amenityIds?.length > 0 && (
          <>
            <Text style={[styles.section, sectionColor]}>Amenities</Text>
            <View style={styles.amenities}>
              {property?.amenityIds?.map(renderAmenity)}
            </View>
          </>
        )}

        <View style={styles.divider} />
        {/* @ts-ignore */}
        {property?.nearbyLandmarks?.length > 0 && (
          <>
            <Text style={[styles.section, sectionColor]}>Nearby</Text>
            <View style={styles.nearby}>
              {property?.nearbyLandmarks?.map(renderNearby)}
            </View>
          </>
        )}

        {!isOwner && (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[styles.section, sectionColor]}>Location</Text>
            <Pressable
              onPress={() => {
                bearerToken ? setIsReportVisible(true) : setVisible();
              }}>
              <Text
                style={[
                  [styles.section, sectionColor],
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
        <TouchableOpacity
          onPress={() => {
            openMap(
              property?.location?.coordinates[1],
              property?.location?.coordinates[0],
            );
          }}>
          {Platform.OS === 'android' &&
            isValidLatLng(
              property?.location?.coordinates[1],
              property?.location?.coordinates[0],
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
        </TouchableOpacity>

        <View style={styles.divider} />
        <View style={styles.userContainer}>
          <View style={styles.unserContainerWidth}>
            <Image
              source={
                !property?.customerId?.profilePicture
                  ? require('@assets/images/images.jpeg')
                  : {
                      uri: property?.customerId?.profilePicture,
                    }
              }
              resizeMode="cover"
              style={styles.userImageStyle}
            />
          </View>
          <View>
            <Text
              style={{
                color: theme.colors.text,
                fontFamily: Fonts.REGULAR,
              }}>
              {'Posted by'}
            </Text>
            <Text style={[styles.userNameStyle, {color: theme.colors.text}]}>
              {property?.customerId?.name}
            </Text>
          </View>
        </View>

        <View
          style={{
            ...styles.divider,
            top: 0,
          }}
        />
      </>
    ) : (
      <></>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {detailLoading && !items?.title && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{paddingBottom: 120}}>
        <Header details={property ? property : items} />

        <TitleContainer />

        <LoaderContainer />

        <DetailPageContainer />

        <SimilarAdContainer />

        <ReportAdModal
          visible={isReportVisible}
          onClose={() => setIsReportVisible(false)}
          onSubmit={submitReportAd}
        />

        <DateTimeModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={saveAppointMents}
        />
      </ScrollView>

      <Footer
        details={property}
        user={user}
        bearerToken={bearerToken}
        createRoom={createRoom}
        setVisible={setVisible}
      />

      <BankSelectModal
        visible={bankModalVisible}
        onDismiss={onBankSelectDismis}
        onSelect={onBankSelect}
        selectedBank={selectedBank}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', borderRadius: 20},
  header: {padding: 16, borderRadius: 20, backgroundColor: '#fff', bottom: 10},
  title: {fontSize: 20, fontFamily: 'DMSans-Medium', marginBottom: 5},
  locationContainer: {left: -2, top: 8},
  locationContainerFooter: {
    flexDirection: 'row',
    alignContent: 'center',
    top: 15,
  },
  locationTitle: {fontSize: 14, fontFamily: Fonts.MEDIUM},
  priceContainer: {flexDirection: 'row', alignContent: 'center'},
  price: {fontSize: 20, fontFamily: 'DMSans-Medium'},
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
  darkHeader: {
    borderTopWidth: 1,
    borderColor: '#fff',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
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
  flexRow: {flexDirection: 'row'},
  bankContainer: {
    paddingHorizontal: 16,
  },
  detailsTextStyle: {
    fontSize: 12,
    fontWeight: 400,
    margin: 0,
    marginTop: 20,
  },
  bankcontentStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  bankLogoStyle: {height: 20, width: 20, margin: 2},
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
  furnishedButtonStyle: {margin: 5},
  divider: {
    backgroundColor: '#EBEBEB',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    width: '100%',
    top: 15,
  },
  userContainer: {
    top: 10,
    flexDirection: 'row',
    padding: 16,
    paddingLeft: 22,
    height: 100,
    justifyContent: 'flex-start',
  },
  unserContainerWidth: {width: '20%'},
  userImageStyle: {height: 52, width: 52, borderRadius: 50},
  userNameStyle: {
    fontSize: 18,
    fontWeight: 500,
    marginTop: 10,
    letterSpacing: 1,
  },
  loanOfferContainer: {
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
  chatButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#2f8f72',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '90%',
  },
  chatButtonFullSold: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#E8E8FF',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '90%',
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
    paddingHorizontal: 16,
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
  adStatusContainerStylePending: {
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
  },
  adStatusContainerStyle: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f44a4aff',
    borderRadius: 10,
    height: 56,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ea860bff',
  },
  adStatusContainer: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  emiCalculatorText: {
    color: '#2F8D79',
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    fontWeight: '500',
  },
  visitContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    height: 56,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
  },
  planvisitTextContainer: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  planVisitTextStyle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    fontWeight: '500',
  },
  statusVerifiedStyle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    fontWeight: '500',
  },
  adStatusTextSyle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    fontWeight: '500',
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
