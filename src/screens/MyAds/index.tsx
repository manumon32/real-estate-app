/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import useBoundStore from '@stores/index';
import React, {useCallback, useMemo, useState} from 'react';
import {useTheme} from '@theme/ThemeProvider';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {postAdAPI} from '@api/services';
import AdsListSkelton from '@components/SkeltonLoader/AdsListSkelton';
import {startCheckoutPromise} from '@screens/ManagePlan/checkout';
import Toast from 'react-native-toast-message';
import NoChats from '@components/NoChatFound';

interface ListingCardProps {
  title: string;
  location: string;
  price: string;
  status: string;
  date: string;
  views: number;
  imageUrl: string;
  navigation: any;
  items: any;
  markasSold?: any;
  makePayment: any;
  theme: any;
  openBoostPopup: (ad: any) => void;
}

const FormattedDate = (arg: string | number | Date) => {
  const date = new Date(arg);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const FormattedDate = `${date
    .toLocaleString('en-US', options)
    .replace(':', '.')}`;
  return FormattedDate;
};

const AdStatusEnum: any = {
  Pending: 'pending',
  Active: 'active',
  Rejected: 'rejected',
  Blocked: 'blocked',
  Sold: 'sold',
};

const formatINR = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const ListingCard: React.FC<ListingCardProps> = ({
  items,
  title = '',
  location = '',
  price = 0,
  status = 'Pending',
  date = '',
  views = 0,
  imageUrl = '',
  navigation,
  markasSold,
  theme,
  openBoostPopup,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {label, backgroundColor, textColor} = useMemo(() => {
    switch (status) {
      case AdStatusEnum.Pending:
        return {
          label: 'In Review',
          backgroundColor: '#FFEAD5',
          textColor: '#AA5A00',
        };
      case AdStatusEnum.Active:
        return {
          label: 'Active',
          backgroundColor: '#D4F4DD',
          textColor: '#147A31',
        };
      case AdStatusEnum.Rejected:
        return {
          label: 'Rejected',
          backgroundColor: '#C14B43',
          textColor: '#FCE3E0',
        };
      case AdStatusEnum.Sold:
        return {
          label: 'Closed',
          backgroundColor: '#E8E8FF',
          textColor: '#4B4B9B',
        };
      case AdStatusEnum.Blocked:
        return {
          label: 'Blocked',
          backgroundColor: '#FCE3E0',
          textColor: '#C14B43',
        };
      default:
        return {
          label: 'Draft',
          backgroundColor: '#EEEEEE',
          textColor: '#666666',
        };
    }
  }, [status]);
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.background,
          borderColor: isDarkMode ? theme.colors.text : '',
          borderWidth: isDarkMode ? 0.5 : 0,
        },
      ]}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Details', {items});
        }}>
        <View style={styles.row}>
          <Image source={{uri: imageUrl}} style={styles.image} />
          <View style={styles.info}>
            <View style={styles.headerRow}>
              <Text style={[styles.title, {color: theme.colors.text}]}>
                {title}
              </Text>
              <View style={[styles.badge, {backgroundColor}]}>
                <Text
                  numberOfLines={2}
                  style={[styles.badgeText, {color: textColor}]}>
                  {label}
                </Text>
              </View>
            </View>
            {items.isFeatured && (
              <View style={[styles.badge]}>
                <Text numberOfLines={2} style={[styles.badgeText]}>
                  {'Featured'}
                </Text>
              </View>
            )}
            <Text
              style={[styles.location, {color: theme.colors.text}]}
              numberOfLines={1}>
              {location}
            </Text>
            <Text style={[styles.price, {color: theme.colors.text}]}>
              {formatINR(Number(price))}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="eye-outline" size={16} color="#888" />
            <Text style={[styles.metaText, {color: theme.colors.text}]}>
              {views}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="clock-outline" size={16} color="#888" />
            <Text style={[styles.metaText, {color: theme.colors.text}]}>
              {status === 'sold'
                ? 'Sold on ' + FormattedDate(items.soldDate)
                : 'Posted on ' + FormattedDate(date)}
            </Text>
          </View>
        </View>
        {items.adStatusNote &&
          (status === 'blocked' || status === 'rejected') && (
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Icon name="information" size={16} color="#C14B43" />
                <Text style={[styles.metaText, {color: '#C14B43'}]}>
                  {items.adStatusNote}
                </Text>
              </View>
            </View>
          )}
      </TouchableOpacity>
      <View style={styles.buttonRow}>
        {label !== 'Sold' && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PostAd', {items});
            }}
            style={styles.outlinedButton}>
            <Text style={[styles.buttonText, {color: theme.colors.text}]}>
              Edit
            </Text>
          </TouchableOpacity>
        )}
        {label === 'Active' && (
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Mark as Sold?',
                'Are you sure you want to mark this listing as sold? This action cannot be undone.',
                [
                  {text: 'Cancel', style: 'cancel'},
                  {
                    text: 'Mark as sold',
                    onPress: () => markasSold(items?._id),
                  },
                ],
              )
            }
            style={styles.outlinedButton}>
            <Text style={[styles.buttonText, {color: theme.colors.text}]}>
              Mark as Closed
            </Text>
          </TouchableOpacity>
        )}
        {label === 'Active' && !items.isFeatured && (
          <TouchableOpacity
            onPress={() => openBoostPopup(items)}
            style={styles.boostButton}>
            <Text style={styles.boostButtonText}>Boost your Ad</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const MyAds = () => {
  const {
    myAds,
    fetchMyAds,
    token,
    clientId,
    bearerToken,
    myAdsLoading,
    managePlansList,
    user,
    fetchPlans,
  } = useBoundStore();

  const uploadParams = {token, clientId, bearerToken};
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [filterBy, setFilterBy] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState<any>(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [showBoostPopup, setShowBoostPopup] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchPlans();
      fetchMyAds();
    }, []),
  );

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
      Toast.show({
        type: 'success',
        text1: 'Your lising is successfully marked as sold .',
        position: 'bottom',
      });
      fetchMyAds();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong, please try again later.',
        position: 'bottom',
      });
    }
  };

  const makePayment = useCallback(
    async (id: any) => {
      setPaymentLoading(true);
      try {
        //@ts-ignore
        const featuredPlan: any = managePlansList?.[0] ?? null;
        if (featuredPlan) {
          const paymentPayload = {
            amountInRupees: featuredPlan.price,
            description: featuredPlan.description || '',
            purchasePlanId: featuredPlan._id,
            purchaseType: 'ads',
            purchaseTypeId: id,
            ...uploadParams,
            phone: user.phone ?? '',
            email: user.email ?? '',
          };
          console.log(paymentPayload);
          // await payWithApplePay();
          await startCheckoutPromise(paymentPayload);
          fetchMyAds();
          fetchPlans();
          setPaymentLoading(false);
        }
      } catch (err: any) {
        if (err?.code === 0) {
          Toast.show({
            type: 'error',
            text1: 'Payment Cancelled',
            position: 'bottom',
          });
        } else {
          console.log('Payment failed', err);
          Toast.show({
            type: 'error',
            text1: 'Payment failed',
            text2: err?.description || 'Something went wrong',
            position: 'bottom',
          });
        }
      }
      setPaymentLoading(false);
    },
    [managePlansList, uploadParams, user, fetchMyAds, fetchPlans],
  );

  const renderAdItem = useCallback(
    (items: any) => {
      return (
        <ListingCard
          title={items.item?.title || ''}
          location={items.item?.address || ''}
          price={items.item?.price}
          status={items.item?.adStatus}
          date={items.item?.createdAt}
          views={items.item?.viewsCount}
          navigation={navigation}
          items={items.item}
          makePayment={makePayment}
          theme={theme}
          imageUrl={
            items.item?.imageUrls[0]
              ? items.item?.imageUrls[0]
              : 'https://media.istockphoto.com/id/1396856251/photo/colonial-house.jpg?s=612x612&w=0&k=20&c=_tGiix_HTQkJj2piTsilMuVef9v2nUwEkSC9Alo89BM='
          }
          markasSold={markasSold}
          openBoostPopup={(ad: any) => {
            setSelectedAd(ad);
            setShowBoostPopup(true);
          }}
        />
      );
    },
    [navigation],
  );

  return (
    <SafeAreaView
      style={{backgroundColor: theme.colors.background, height: '100%'}}>
      {paymentLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <FlatList
        data={
          filterBy
            ? myAds.filter((items: any) => items.adStatus == filterBy)
            : myAds
        }
        renderItem={renderAdItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 120,
          backgroundColor: theme.colors.background,
          minHeight: myAds.length > 0 ? 900 : 0,
        }}
        ListHeaderComponent={
          <>
            <CommonHeader title="My Ads" textColor="#171717" />
            {myAds.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{padding: 10}}
                style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={[styles.chip, !filterBy && styles.chipSelected]}
                  onPress={() => {
                    setFilterBy(null);
                  }}>
                  <Text
                    style={[
                      styles.chipText,
                      {color: theme.colors.text},
                      !filterBy && styles.chipTextSelected,
                    ]}>
                    {'All'}
                  </Text>
                </TouchableOpacity>
                {Object.keys(AdStatusEnum).map((items: any, index: number) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.chip,
                        filterBy === AdStatusEnum[items] && styles.chipSelected,
                      ]}
                      onPress={() => {
                        setFilterBy(AdStatusEnum[items]);
                      }}>
                      <Text
                        style={[
                          styles.chipText,
                          {color: theme.colors.text},
                          filterBy === AdStatusEnum[items] &&
                            styles.chipTextSelected,
                        ]}>
                        {items}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </>
        }
        ListHeaderComponentStyle={{padding: 0}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              fetchMyAds();
              fetchPlans();
            }}
            colors={['#2A9D8F', '#2A9D8F', '#227465']}
          />
        }
        ListFooterComponent={
          <>
            {myAdsLoading && myAds.length <= 0 && <AdsListSkelton />}
            {!myAdsLoading &&
              (filterBy ? (
                myAds.filter((items: any) => items.adStatus == filterBy)
                  .length <= 0 ? (
                  <NoChats
                    onExplore={() => {
                      // @ts-ignore
                      navigation.navigate('PostAd');
                    }}
                    icon="alert-circle-outline"
                    title="No Ads Found"
                    body="Looks like you haven’t listed any ads yet."
                    buttonText={'Post your Ad now'}
                  />
                ) : (
                  <></>
                )
              ) : myAds.length <= 0 ? (
                <NoChats
                  onExplore={() => {
                    // @ts-ignore
                    navigation.navigate('PostAd');
                  }}
                  icon="alert-circle-outline"
                  title="Its quite here..."
                  body="Get out there to start finding great deals."
                  buttonText={'Post your Ad now'}
                  iconName="MyAds"
                />
              ) : (
                <></>
              ))}
          </>
        }
      />

      {/* Boost Popup */}
      {showBoostPopup && selectedAd && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Boost Your Ad</Text>
            <Text style={styles.popupAmount}>
              {/* @ts-ignore */}
              Amount: ₹{managePlansList?.[0]?.price ?? 'N/A'}
            </Text>
            <Text
              style={[
                styles.popupAmount,
                {color: theme.colors.text, fontSize: 12},
              ]}>
              {/* @ts-ignore */}
              Package Avaliability: {managePlansList?.[0].duration} Days
            </Text>
            <Text style={styles.popupBenefits}>
              Benefits:
              {'\n'}• Get more visibility
              {'\n'}• Reach more buyers
              {'\n'}• Highlight your ad at the top
            </Text>
            <View style={styles.popupActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowBoostPopup(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  setShowBoostPopup(false);
                  makePayment(selectedAd._id);
                }}>
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    flex: 1,
  },
  badge: {
    backgroundColor: '#e0f5ec',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    color: '#15937c',
    fontWeight: '600',
  },
  location: {
    fontSize: 13,
    color: '#888',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e1e1e',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  outlinedButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  boostButton: {
    flex: 1,
    backgroundColor: '#2A9D8F',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  boostButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  chipSelected: {
    backgroundColor: '#2A9D8F',
    borderColor: '#2A9D8F',
  },
  chipText: {
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  popupContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  popupAmount: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  popupBenefits: {
    fontSize: 13,
    color: '#555',
    marginBottom: 16,
  },
  popupActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#333',
  },
  continueButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2A9D8F',
    borderRadius: 8,
  },
  continueButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

export default MyAds;
