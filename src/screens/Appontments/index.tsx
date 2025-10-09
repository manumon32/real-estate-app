/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeader';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import useBoundStore from '@stores/index';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTheme} from '@theme/ThemeProvider';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {
  View,
  Text,
  StyleSheet,
  // Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  useColorScheme,
  ScrollView,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Fonts} from '@constants/font';
import AdsListSkelton from '@components/SkeltonLoader/AdsListSkelton';
import NoChats from '@components/NoChatFound';
import Toast from 'react-native-toast-message';
import RejectReasonModal from './RejectReasonModal';
import {createRoomAPI} from '@api/services';
import {getSocket} from '@soket/index';

// import PropertyCard from '@components/PropertyCard';

interface ListingCardProps {
  title: string;
  location: string;
  status: string;
  date: string;
  views: number;
  navigation: any;
  items: any;
  name: any;
  theme: any;
  filterBy: any;

  updateStatus: any;
  setIsReportVisible: any;
  setSelectedItem: any;
  sendSocket: any;
  setChatRoomId: any;
  token: any;
  clientId: any;
  bearerToken: any;
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

const ListingCard: React.FC<ListingCardProps> = ({
  items,
  title = '',
  status = 'Pending',
  date = '',
  name,
  navigation,
  theme,
  filterBy,
  updateStatus,
  setIsReportVisible,
  setSelectedItem,
  sendSocket,
  setChatRoomId,
  token,
  clientId,
  bearerToken,
}) => {
  const [loading, setLoading] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const createRoom = async (payload: any, property: any, user: any) => {
    setLoading(true);
    let newpayload = {...payload, postOwnerId: payload.postOwnerId};
    console.log('newpayload', newpayload);
    try {
      const res = await createRoomAPI(newpayload, {
        token,
        clientId,
        bearerToken,
      });
      console.log(res);

      setLoading(false);
      if (res?._id) {
        sendSocket(newpayload);
        setChatRoomId({[newpayload.propertyId]: res?._id});
        console.log('propertyId', {
          ...payload,
          propertyId: res?._id,
        });
        console.log(user);
        // @ts-ignore
        navigation.navigate('ChatDetails', {
          items: {
            ...payload,
            propertyId: res?._id,
            property: {
              ...property,
              coverImage: property?.imageUrls[0] ?? null,
            },
            user: user,
          },
        });
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        position: 'bottom',
      });
    }
  };
  const {label, backgroundColor, textColor} = useMemo(() => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          backgroundColor: '#FFEAD5',
          textColor: '#AA5A00',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          backgroundColor: '#C14B43',
          textColor: '#FCE3E0',
        };
      case 'scheduled':
        return {
          label: 'Scheduled',
          backgroundColor: '#2A9D8F',
          textColor: '#fff',
        };
      default:
        return {
          label: '',
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
          borderWidth: isDarkMode ? 1 : 0,
        },
      ]}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Details', {items: {_id: items.propertyId._id}});
        }}>
        <View style={styles.row}>
          {/* Property Image */}
          <Image
            source={{
              uri:
                items?.thumbnailUrls?.length > 0
                  ? items?.thumbnailUrls[0]
                  : items.propertyId?.imageUrls?.[0],
            }}
            style={styles.image}
          />
          <View style={styles.info}>
            <View style={styles.headerRow}>
              <Text
                numberOfLines={2}
                style={[styles.title, {color: theme.colors.text}]}>
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

            {items?.propertyId?.address && (
              <Text
                style={[styles.location, {color: theme.colors.text}]}
                numberOfLines={1}>
                {items.propertyId.address}
              </Text>
            )}
            <Text style={[styles.location, {color: theme.colors.text}]}>
              {name}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            {status === 'rejected' ? (
              items.notes && (
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.MEDIUM,
                      fontSize: 14,
                      fontWeight: 500,
                      color: theme.colors.text,
                    }}>
                    Rejected Reason :{' '}
                    <Text
                      style={[
                        styles.metaText,
                        {color: theme.colors.text, padding: 5, width: '100%'},
                      ]}>
                      {items.notes}
                    </Text>
                  </Text>
                  {/* <View style={{flexDirection: 'row'}}>
                    <Text
                      style={[
                        styles.metaText,
                        {color: theme.colors.text, padding: 5, width: '100%'},
                      ]}>
                      {items.notes}
                    </Text>
                  </View> */}
                </View>
              )
            ) : (
              <>
                <Icon name="clock-outline" size={16} color="#888" />
                <Text style={[styles.metaText, {color: theme.colors.text}]}>
                  {status === 'pending'
                    ? 'Appointment requested for '
                    : 'Scheduled on '}
                  {FormattedDate(date)}
                </Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => {
            let payload = {
              propertyId: items.propertyId?._id,
              postOwnerId: items?.ownerId?._id
                ? items?.ownerId?._id
                : items?.userId?._id,
            };
            createRoom(
              payload,
              items.propertyId,
              items?.ownerId?._id ? items?.ownerId : items?.userId,
            );
          }}
          style={styles.chatButton}>
          {loading && (
            <ActivityIndicator size={'small'} color={theme.colors.background} />
          )}
          {!loading && <Text style={[styles.boostButtonText]}>Chat</Text>}
        </TouchableOpacity>
        {filterBy === 'myAppointments' && status === 'pending' && (
          <>
            <TouchableOpacity
              onPress={() => {
                setSelectedItem(items);
                setIsReportVisible(true);
              }}
              style={styles.outlinedButton}>
              <Text style={[styles.buttonText, {color: theme.colors.text}]}>
                Reject
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                updateStatus({
                  status: 'scheduled',
                  propertyId: items.propertyId._id,
                  appointmentId: items._id,
                  note: '',
                });
              }}
              style={styles.boostButton}>
              {loading && (
                <ActivityIndicator
                  size={'small'}
                  color={theme.colors.background}
                />
              )}
              {!loading && <Text style={[styles.boostButtonText]}>Accept</Text>}
            </TouchableOpacity>
          </>
        )}
      </View>
      {/* {status === 'scheduled' && ( */}
      <View style={styles.buttonRow}></View>
      {/* )} */}
    </View>
  );
};

const FirstRoute = () => <View style={[styles.scene]}></View>;

const SecondRoute = () => <View style={[styles.scene]}></View>;

const Appointments = () => {
  const {
    appointments,
    fetchAppointments,
    appointmentsLoading,
    updateAppointments,
    setChatRoomId,
    token,
    clientId,
    bearerToken,
  } = useBoundStore();
  const route: any = useRoute();
  const items: any = route?.params?.items;

  const [filterBy, setFilterBy] = useState<string>('myAppointments');

  const [filterByStatus, setFilterByStatus] = useState<any>(null);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});

  const navigation = useNavigation();
  const {theme} = useTheme();

  const sendSocket = (payload: any) => {
    const socket = getSocket();

    if (socket?.connected) {
      socket.emit('newRoomCreated', payload);
    } else {
      console.log('Socket is not connected yet');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, []),
  );

  useEffect(() => {
    items?.type && setFilterBy(items?.type);
  }, [items]);

  const updateStatus = async (payload: any) => {
    try {
      await updateAppointments(payload);
      Toast.show({
        type: 'success',
        text1: 'Success',
        position: 'bottom',
      });
      fetchAppointments();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        position: 'bottom',
      });
    }
  };

  const renderAdItem = useCallback(
    (items: any) => {
      return (
        <ListingCard
          title={items.item?.propertyId.title || ''}
          location={items.item?.address || ''}
          status={items.item?.status}
          date={items.item?.scheduledAt}
          views={items.item?.viewsCount}
          navigation={navigation}
          items={items.item}
          theme={theme}
          name={
            items.item?.ownerId.name ||
            items.item?.userId.name ||
            'Hotplotz User'
          }
          filterBy={filterBy}
          updateStatus={updateStatus}
          setIsReportVisible={setIsReportVisible}
          setSelectedItem={setSelectedItem}
          sendSocket={sendSocket}
          setChatRoomId={setChatRoomId}
          token={token}
          clientId={clientId}
          bearerToken={bearerToken}
        />
      );
    },
    [navigation, filterBy],
  );

  const listFooter = () => {
    const isEmpty = filterByStatus
      ? // @ts-ignore
        appointments[filterBy].filter(
          (item: {status: any}) => item.status === filterByStatus,
        ).length === 0
      : // @ts-ignore
        appointments[filterBy].length === 0;
    return (
      <>
        {/* @ts-ignore */}
        {appointmentsLoading && isEmpty && <AdsListSkelton />}
        {!appointmentsLoading &&
          // @ts-ignore
          isEmpty && (
            <NoChats
              onExplore={() => {
                // @ts-ignore
                navigation.navigate('Main');
              }}
              icon="alert-circle-outline"
              title="No Appointments yet."
              body="Book appointments to see them here"
              buttonText={'Book Appointment'}
              iconName="Appointment"
            />
          )}
      </>
    );
  };

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Requests'},
    {key: 'second', title: 'My Appointments'},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  useEffect(() => {
    setIndex(filterBy === 'myAppointments' ? 0 : 1);
  }, [filterBy]);

  useEffect(() => {
    setFilterBy(index === 0 ? 'myAppointments' : 'requestedAppointments');
    setFilterByStatus(null);
  }, [index]);

  return (
    <SafeAreaView
      style={{backgroundColor: theme.colors.background, height: '100%'}}>
      <FlatList
        data={
          filterByStatus
            ? // @ts-ignore
              appointments[filterBy].filter(
                (item: {status: any}) => item.status === filterByStatus,
              )
            : // @ts-ignore
              appointments[filterBy]
        }
        renderItem={renderAdItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 120,
          backgroundColor: theme.colors.background,
          // @ts-ignore
          minHeight: appointments?.[filterBy].length > 0 ? 900 : 0,
          //  padding: 14,
        }}
        ListHeaderComponent={
          <>
            <CommonHeader
              title="Appointments"
              textColor="#171717"
              // onBackPress={onBackPress}
            />

            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{width: layout.width}}
              renderTabBar={props => (
                <TabBar
                  {...props}
                  indicatorStyle={{backgroundColor: '#007bff'}}
                  style={{backgroundColor: 'white'}}
                  activeColor="#007bff"
                  inactiveColor="black"
                />
              )}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{padding: 10}}
              style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={[styles.chip, !filterByStatus && styles.chipSelected]}
                onPress={() => {
                  setFilterByStatus(null);
                }}>
                <Text
                  style={[
                    // newselected?.includes(item._id)
                    styles.chipText,
                    {color: theme.colors.text},
                    !filterByStatus && styles.chipTextSelected,
                  ]}>
                  {'All'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  filterByStatus === 'pending' && styles.chipSelected,
                ]}
                onPress={() => {
                  setFilterByStatus('pending');
                }}>
                <Text
                  style={[
                    // newselected?.includes(item._id)
                    styles.chipText,
                    {color: theme.colors.text},
                    filterByStatus === 'pending' && styles.chipTextSelected,
                  ]}>
                  {'Pending'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  filterByStatus === 'scheduled' && styles.chipSelected,
                ]}
                onPress={() => {
                  setFilterByStatus('scheduled');
                }}>
                <Text
                  style={[
                    // newselected?.includes(item._id)
                    styles.chipText,
                    {color: theme.colors.text},
                    filterByStatus === 'scheduled' && styles.chipTextSelected,
                  ]}>
                  {'Scheduled'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  filterByStatus === 'rejected' && styles.chipSelected,
                ]}
                onPress={() => {
                  setFilterByStatus('rejected');
                }}>
                <Text
                  style={[
                    // newselected?.includes(item._id)
                    styles.chipText,
                    {color: theme.colors.text},
                    filterByStatus === 'rejected' && styles.chipTextSelected,
                  ]}>
                  {'Rejected'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        }
        ListHeaderComponentStyle={{
          padding: 0,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              fetchAppointments();
            }}
            colors={['#40DABE', '#40DABE', '#227465']}
          />
        }
        ListFooterComponent={listFooter}
      />

      <RejectReasonModal
        visible={isReportVisible}
        onClose={() => setIsReportVisible(false)}
        onSubmit={(note: any) => {
          selectedItem?.propertyId &&
            updateStatus({
              status: 'rejected',
              propertyId: selectedItem?.propertyId?._id,
              appointmentId: selectedItem?._id,
              notes: note,
            });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // fills the screen
    backgroundColor: 'rgba(0, 0, 0, 0.78)', // transparent dark overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // ensure it's on top
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
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'space-evenly',
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
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: Fonts.REGULAR,
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
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },

  chatButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'teal',
    backgroundColor: 'teal',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  boostButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'green',
    backgroundColor: 'green',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  boostButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  endText: {
    textAlign: 'center',
    color: '#000',
    padding: 12,
    fontWeight: 500,
    fontFamily: Fonts.BOLD,
    top: -30,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 5,
    // marginBottom: 5,
  },
  chipSelected: {
    backgroundColor: '#2A9D8F',
    borderColor: '#2A9D8F',
  },
  chipText: {
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
  },

  chipSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 5,
    // marginBottom: 5,
  },
  chipTextSecondary: {
    color: '#333',
    fontSize: 14,
  },
  chipTextSelectedSecondary: {
    color: '#fff',
  },
});

export default Appointments;
