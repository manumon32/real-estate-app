/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeader';
import {useNavigation} from '@react-navigation/native';
import useBoundStore from '@stores/index';
import React, {useCallback, useEffect, useState} from 'react';
import {useTheme} from '@theme/ThemeProvider';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Fonts} from '@constants/font';
import IconButton from '@components/Buttons/IconButton';
import ViewBenifitsModal from './ViewBenifitsModal';
import {startCheckoutPromise} from './checkout';

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
  loading: boolean;
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

      <Text style={styles.price}>
        <IconButton
          iconSize={18}
          iconColor={'#171717'}
          iconName={'currency-inr'}
        />
        {price}/month
      </Text>

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
        <Text style={styles.buttonText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const ManagePlans = () => {
  const {managePlansList, fetchPlans, bearerToken, token, clientId, user} =
    useBoundStore();
  const navigation = useNavigation();
  const {theme} = useTheme();

  const [isViewBenefitsVisible, setIsViewBenefitsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSend = async (item: any) => {
    try {
      setLoading(true);
      let payload = {
        amountInRupees: item.price,
        description: item.description ?? '',
        purchasePlanId: item._id,
        bearerToken,
        token,
        clientId,
        phone: user.phone ?? null,
        email: user.phone ?? null,
      };
      await startCheckoutPromise(payload);
      setLoading(false);
      // @ts-ignore
      navigation.goBack();
      // update local state, navigate, etc.
    } catch (_) {
      setLoading(false);
      /* already alerted; you might show a toast or log analytics here */
    }
  };

  const renderAdItem = useCallback(
    (items: any) => {
      return (
        <PlanCard
          title={items?.item?.name}
          price={items?.item?.price}
          features={items?.item?.description ?? []}
          loading={loading}
          onPress={() => {
            // setIsViewBenefitsVisible(true);
            // setSeletedItem(items.item ?? []);
            handleSend(items?.item);
          }}
        />
      );
    },
    [navigation],
  );

  return (
    <SafeAreaView style={{backgroundColor: '#fff', height: '100%'}}>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <FlatList
        data={managePlansList}
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
              backgroundColor="#F6FCFF"
              textColor="#171717"
              // onBackPress={onBackPress}
            />
            <Text
              style={{
                fontSize: 16,
                marginHorizontal: 16,
                color: '#171717',
                fontFamily: Fonts.BOLD,
                margin: 10,
              }}>
              Avaialable Plans
            </Text>
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
              fetchPlans();
            }}
            colors={['#40DABE', '#40DABE', '#227465']}
          />
        }
        ListFooterComponent={
          managePlansList.length <= 0 ? (
            <Text style={styles.endText}>No Active Plans.</Text>
          ) : (
            <></>
          )
        }
      />

      <ViewBenifitsModal
        visible={isViewBenefitsVisible}
        onClose={() => setIsViewBenefitsVisible(false)}
        selectedItem={[]}
        onSubmit={() => {
          // let payload = {
          //   propertyId: details?._id,
          //   reason: data.reason,
          //   comment: data.comment,
          // };
          // reportAd(payload);
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
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 10,
    marginHorizontal: 30,
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
    marginVertical: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#374151',
  },
  button: {
    flex: 1,
    backgroundColor: '#2F8D79',
    borderRadius: 8,
    padding: 10,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
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
