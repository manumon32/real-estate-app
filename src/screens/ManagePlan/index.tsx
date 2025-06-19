/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeader';
import {useNavigation} from '@react-navigation/native';
import useBoundStore from '@stores/index';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts } from '@constants/font';
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

type PlanCardProps = {
  title: string;
  price: string;
  features: string[];
  badge?: string;
  onPress?: () => void;
};

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  price,
  features,
  badge,
  onPress,
}) => {
  return (
    <View style={styles.card}>
      {/* Title & Badge */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>

      <Text style={styles.price}>{price}/month</Text>

      {/* Features */}
      {features.map((feature, index) => (
        <View style={styles.featureRow} key={index}>
          <MaterialCommunityIcons
            name="check-circle"
            color="#22C55E"
            size={18}
          />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>View Benefits</Text>
      </TouchableOpacity>
    </View>
  );
};

const ManagePlans = () => {
  const {myAds, fetchMyAds} = useBoundStore();
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [filterBy, setFilterBy] = useState<any>(null);

  useEffect(() => {
    fetchMyAds();
  }, []);

  const renderAdItem = useCallback(
    (items: any) => {
      return (
        <PlanCard
          title="Free Plan"
          price="$0"
          features={[
            '20 Active Listings',
            '5 Featured Listings',
            'Priority Support',
          ]}
          badge="Basic"
          onPress={() => console.log('Viewing benefits')}
        />
      );
    },
    [navigation],
  );

  return (
    <SafeAreaView style={{backgroundColor: '#fff', height: '100%'}}>
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
          backgroundColor: theme.colors.backgroundHome,
          minHeight: 900,
          //  padding: 14,
        }}
        ListHeaderComponent={
          <>
            <CommonHeader
              title="Manage Plans"
              backgroundColor='#F6FCFF'
              textColor="#171717"
              // onBackPress={onBackPress}
            />
            <Text style={{fontSize:16,marginHorizontal:16, color:'#171717', fontFamily:Fonts.BOLD, margin:10}}>Avaialable Plans</Text>
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
              fetchMyAds();
            }}
            colors={['#40DABE', '#40DABE', '#227465']}
          />
        }
        ListFooterComponent={
          filterBy ? (
            myAds.filter((items: any) => items.adStatus == filterBy).length <=
            0 ? (
              <Text style={styles.endText}>You dont have anything listed.</Text>
            ) : (
              <></>
            )
          ) : myAds.length <= 0 ? (
            <Text style={styles.endText}>You havent listed anything yet.</Text>
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
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 10,
    marginHorizontal:30
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 8,
    color: '#111827',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#374151',
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  buttonText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 14,
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

  location: {
    fontSize: 13,
    color: '#888',
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

export default ManagePlans;
