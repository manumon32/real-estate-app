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
  // Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  useColorScheme,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Fonts} from '@constants/font';
import AdsListSkelton from '@components/SkeltonLoader/AdsListSkelton';
import NoChats from '@components/NoChatFound';
import Toast from 'react-native-toast-message';
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

  const FormattedDate = `Scheduled on ${date
    .toLocaleString('en-US', options)
    .replace(':', '.')}`;
  return FormattedDate;
};

const ListingCard: React.FC<ListingCardProps> = ({
  items,
  title = '',
  location = '',
  status = 'Pending',
  date = '',
  name,
  navigation,
  theme,
  filterBy,
  updateStatus,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
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
          backgroundColor: '#FCE3E0',
          textColor: '#C14B43',
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
          borderWidth: isDarkMode ? 0.4 : 0,
        },
      ]}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Details', {items: {_id: items.propertyId._id}});
        }}>
        <View style={styles.row}>
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

            <Text style={[styles.location, {color: theme.colors.text}]}>
              {name}
            </Text>
            <Text
              style={[styles.location, {color: theme.colors.text}]}
              numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="clock-outline" size={16} color="#888" />
            <Text style={[styles.metaText, {color: theme.colors.text}]}>
              {FormattedDate(date)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {filterBy === 'myAppointments' && status === 'pending' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() =>
              updateStatus({
                status: 'rejected',
                propertyId: items.propertyId._id,
                appointmentId: items._id,
                note: '',
              })
            }
            style={styles.outlinedButton}>
            <Text style={[styles.buttonText, {color: theme.colors.text}]}>
              Reject
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              updateStatus({
                status: 'scheduled',
                  propertyId: items.propertyId._id,
                appointmentId: items._id,
                note: '',
              })
            }
            style={styles.boostButton}>
            <Text style={[styles.boostButtonText]}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const Appointments = () => {
  const {
    appointments,
    fetchAppointments,
    appointmentsLoading,
    updateAppointments,
  } = useBoundStore();

  const [filterBy, setFilterBy] = useState<string>('myAppointments');

  const navigation = useNavigation();
  const {theme} = useTheme();

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, []),
  );

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
          name={items.item?.ownerId.name || ''}
          filterBy={filterBy}
          updateStatus={updateStatus}
        />
      );
    },
    [navigation, filterBy, ],
  );

  return (
    <SafeAreaView
      style={{backgroundColor: theme.colors.background, height: '100%'}}>
      <FlatList
        // @ts-ignore
        data={appointments[filterBy]}
        renderItem={renderAdItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 120,
          backgroundColor: theme.colors.background,
          minHeight: 900,
          //  padding: 14,
        }}
        ListHeaderComponent={
          <>
            <CommonHeader
              title="Appointments"
              textColor="#171717"
              // onBackPress={onBackPress}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{padding: 10}}
              style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  filterBy === 'myAppointments' && styles.chipSelected,
                ]}
                onPress={() => {
                  setFilterBy('myAppointments');
                }}>
                <Text
                  style={[
                    // newselected?.includes(item._id)
                    styles.chipText,
                    {color: theme.colors.text},
                    filterBy === 'myAppointments' && styles.chipTextSelected,
                  ]}>
                  {'Requests'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  filterBy === 'requestedAppointments' && styles.chipSelected,
                ]}
                onPress={() => {
                  setFilterBy('requestedAppointments');
                }}>
                <Text
                  style={[
                    // newselected?.includes(item._id)
                    styles.chipText,
                    {color: theme.colors.text},
                    filterBy === 'requestedAppointments' &&
                      styles.chipTextSelected,
                  ]}>
                  {'My Appointments'}
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
        ListFooterComponent={
          <>
            {appointmentsLoading && <AdsListSkelton />}
            {!appointmentsLoading &&
              // @ts-ignore
              appointments?.[filterBy].length === 0 && (
                <NoChats
                  onExplore={() => {
                    // @ts-ignore
                    navigation.navigate('Main');
                  }}
                  icon="alert-circle-outline"
                  title="You don’t have any appointments yet."
                  // body="Looks like you haven’t listed any ads yet."
                  buttonText={'Explore'}
                />
              )}
          </>
        }
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
});

export default Appointments;
