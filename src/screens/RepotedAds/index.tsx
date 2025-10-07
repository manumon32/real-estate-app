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
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import NoChats from '@components/NoChatFound';
import AdsListSkelton from '@components/SkeltonLoader/AdsListSkelton';
// import PropertyCard from '@components/PropertyCard';

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
  reason: string;
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

  const FormattedDate = `Reported on ${date
    .toLocaleString('en-US', options)
    .replace(':', '.')}`;
  return FormattedDate;
};

export enum AdStatusEnum {
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  BLOCKED = 'blocked',
  DEACTIVATED = 'deactivated',
  SOLD = 'sold',
}

const ListingCard: React.FC<ListingCardProps> = ({
  items,
  title = '',
  date = '',
  imageUrl = '',
  navigation,
  reason,
}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Details', {items: items.propertyId});
        }}>
        <View style={styles.row}>
          <Image source={{uri: imageUrl}} style={styles.image} />
          <View style={styles.info}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={styles.location} numberOfLines={1}>
              {items.propertyId.address}
            </Text>
            <Text style={styles.location} numberOfLines={1}>
              {reason}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="clock-outline" size={16} color="#888" />
            <Text style={styles.metaText}>{FormattedDate(date)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ReportAd = () => {
  const {reportAdList, fetchReportedAd, reportAdListLoading} = useBoundStore();
  const navigation = useNavigation();
  const {theme} = useTheme();

  useEffect(() => {
    fetchReportedAd();
  }, []);

  const renderAdItem = useCallback(
    (items: any) => {
      const imageUrls = items.item?.thumbnailUrls
        ? items.item?.thumbnailUrls[0]
        : items.item?.imageUrls?.[0];
      return (
        <ListingCard
          title={items?.item?.propertyId?.title || ''}
          location={items?.item?.reason || ''}
          reason={items?.item?.reason || ''}
          price={items?.item?.price}
          status={items?.item?.adStatus}
          date={items?.item?.createdAt}
          views={200}
          navigation={navigation}
          items={items?.item}
          imageUrl={imageUrls}
        />
      );
    },
    [navigation],
  );

  return (
    <SafeAreaView
      style={{backgroundColor: theme.colors.background, height: '100%'}}>
      <FlatList
        data={reportAdList}
        renderItem={renderAdItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: reportAdList.length > 0 ? 120 : 0,
          backgroundColor: theme.colors.background,
          minHeight: reportAdList.length > 0 ? 800 : 0,
          //  padding: 14,
        }}
        ListHeaderComponent={
          <>
            <CommonHeader
              title="Reported Ads"
              textColor="#171717"
              // onBackPress={onBackPress}
            />
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
              fetchReportedAd();
            }}
            colors={['#40DABE', '#40DABE', '#227465']}
          />
        }
        ListFooterComponent={
          <>
            {reportAdListLoading && reportAdList.length <= 0 && (
              <AdsListSkelton />
            )}
            {!reportAdListLoading && reportAdList.length <= 0 ? (
              <NoChats
                onExplore={() => {
                  // @ts-ignore
                  navigation.navigate('Main');
                }}
                icon="message-text-outline"
                title="Its quite here..."
                body="Get out there to start finding great deals."
                buttonText={'Explore'}
                iconName="ReportAd"
              />
            ) : (
              <></>
            )}
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

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
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

export default ReportAd;
