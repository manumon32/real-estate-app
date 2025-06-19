/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeader';
import {useNavigation} from '@react-navigation/native';
import useBoundStore from '@stores/index';
import React, {useCallback, useEffect, useMemo} from 'react';
import {useTheme} from '@theme/ThemeProvider';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

  const FormattedDate = `Post on ${date
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
  location = '',
  price = 0,
  status = 'Pending',
  date = '',
  views = 0,
  imageUrl = '',
  navigation,
}) => {
  const {label, backgroundColor, textColor} = useMemo(() => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending Review',
          backgroundColor: '#FFEAD5',
          textColor: '#AA5A00',
        };
      case 'active':
        return {
          label: 'Active',
          backgroundColor: '#D4F4DD',
          textColor: '#147A31',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          backgroundColor: '#C14B43',
          textColor: '#FCE3E0',
        };
      case 'SOLD':
        return {
          label: 'Sold',
          backgroundColor: '#E8E8FF',
          textColor: '#4B4B9B',
        };
      case 'expired':
        return {
          label: 'Expired',
          backgroundColor: '#FCE3E0',
          textColor: '#C14B43',
        };
      case 'blocked':
        return {
          label: 'Blocked',
          backgroundColor: '#FCE3E0',
          textColor: '#C14B43',
        };
      case 'deactivated':
        return {
          label: 'Deactivated',
          backgroundColor: '#E0E0E0',
          textColor: '#555555',
        };
      case 'DRAFT':
      default:
        return {
          label: 'Draft',
          backgroundColor: '#EEEEEE',
          textColor: '#666666',
        };
    }
  }, [status]);
  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Details', {items});
        }}>
        <View style={styles.row}>
          <Image source={{uri: imageUrl}} style={styles.image} />
          <View style={styles.info}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{title}</Text>
              <View style={[styles.badge, {backgroundColor}]}>
                <Text style={[styles.badgeText, {color: textColor}]}>{label}</Text>
              </View>
            </View>
            <Text style={styles.location}>{location}</Text>
            <Text style={styles.price}>₹{price}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="eye-outline" size={16} color="#888" />
            <Text style={[styles.metaText, ]}>{views}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="clock-outline" size={16} color="#888" />
            <Text style={styles.metaText}>{FormattedDate(date)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate('PostAd',{items})}
          style={styles.outlinedButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlinedButton}>
          <Text style={styles.buttonText}>Mark as Sold</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MyAds = () => {
  const {myAds, fetchMyAds} = useBoundStore();
  const navigation = useNavigation();
  const {theme} = useTheme();

  useEffect(() => {
    fetchMyAds();
  }, []);
  const renderAdItem = useCallback(
    (items: any) => {
      return (
        <ListingCard
          title={items.item?.title || ''}
          location={items.item?.address || ''}
          price={items.item?.price}
          status={items.item?.adStatus}
          date={items.item?.createdAt}
          views={200}
          navigation={navigation}
          items={items.item}
          imageUrl={
            items.item?.imageUrls[0]
              ? items.item?.imageUrls[0]
              : 'https://media.istockphoto.com/id/1396856251/photo/colonial-house.jpg?s=612x612&w=0&k=20&c=_tGiix_HTQkJj2piTsilMuVef9v2nUwEkSC9Alo89BM='
          }
        />
      );
    },
    [navigation],
  );

  return (
    <SafeAreaView
      style={{backgroundColor: '#fff', padding: 10, height: '100%'}}>
      <CommonHeader
        title="My Ads"
        textColor="#171717"
        // onBackPress={onBackPress}
      />
      <FlatList
        data={myAds}
        renderItem={renderAdItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: theme.colors.backgroundHome,
          minHeight: 900,
          padding: 14,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              fetchMyAds();
            }}
          />
        }
        ListFooterComponent={
          myAds.length <= 0 ? (
            <Text style={styles.endText}>You havent listed anything yet</Text>
          ) : (
            <></>
          )
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
});

export default MyAds;
