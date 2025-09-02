/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeader';
import {useNavigation} from '@react-navigation/native';
import useBoundStore from '@stores/index';
import React, {useCallback, useEffect} from 'react';
import {useTheme} from '@theme/ThemeProvider';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AdsListSkelton from '@components/SkeltonLoader/AdsListSkelton';
import {SafeAreaView} from 'react-native-safe-area-context';
import NoChats from '@components/NoChatFound';
// import PropertyCard from '@components/PropertyCard';

interface ListingCardProps {
  title: string;
  price: string;
  status: string;
  date: string;
  navigation: any;
  items: any;
  markasSold?: any;
  theme?: any;
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
  price = 0,
  date = '',
  navigation,
}) => {
  return (
    <View
      style={[
        styles.card,
      ]}>
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('Details', {items});
        }}>
        <View style={styles.row}>
          <View style={styles.info}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={styles.price}>₹{price}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="clock-outline" size={16} color="#888" />
            <Text style={styles.metaText}>
              {'Purchased on - ' + FormattedDate(date)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Transactions = () => {
  const {transactions, fetchTransactions, transLoading} = useBoundStore();
  const navigation = useNavigation();
  const {theme} = useTheme();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderAdItem = useCallback(
    (items: any) => {
      return (
        <ListingCard
          title={items.item?.subscriptionPlanId?.name || ''}
          price={items.item?.subscriptionPlanId?.price}
          status={items.item?.status}
          date={items.item?.createdAt}
          navigation={navigation}
          items={items.item}
          theme={theme}
        />
      );
    },
    [navigation],
  );

  return (
    <SafeAreaView style={{backgroundColor: theme.colors.background, height: '100%'}}>
      <CommonHeader
        title="Orders"
        textColor="#171717"
        // onBackPress={onBackPress}
      />
      <FlatList
        data={transactions}
        renderItem={renderAdItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 120,
          backgroundColor: theme.colors.backgroundHome,
          minHeight: 900,
          //  padding: 14,
        }}
        ListHeaderComponent={
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{flexDirection: 'row', padding: 10}}>
              {/* <TouchableOpacity
                style={[styles.chip, !filterBy && styles.chipSelected]}
                onPress={() => {
                  setFilterBy(null);
                }}>
                <Text
                  style={[
                    // newselected?.includes(item._id)
                    styles.chipText,
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
                        // newselected?.includes(item._id)
                        styles.chipText,
                        filterBy === AdStatusEnum[items] &&
                          styles.chipTextSelected,
                      ]}>
                      {items}
                    </Text>
                  </TouchableOpacity>
                );
              })} */}
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
              fetchTransactions();
            }}
            colors={['#40DABE', '#40DABE', '#227465']}
          />
        }
        ListFooterComponent={
          <>
            {transLoading && transactions.length <= 0 && <AdsListSkelton />}
            {!transLoading &&
              (transactions.length <= 0 ? (
                <NoChats
                onExplore={() => {
                  // @ts-ignore
                  navigation.navigate('Main');
                }}
                icon="message-text-outline"
                title="No Transactions Found"
                buttonText={'Explore now'}
              />
              ) : (
                <></>
              ))}
          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  endText: {
    textAlign: 'center',
    color: '#888',
    padding: 12,
    fontStyle: 'italic',
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

export default Transactions;
