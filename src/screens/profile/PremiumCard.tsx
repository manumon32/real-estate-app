/* eslint-disable react-native/no-inline-styles */
import ViewBenifitsModal from '@screens/ManagePlan/ViewBenifitsModal';
import useBoundStore from '@stores/index';
import React, { useState } from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const getDaysToGoFromTimestamp = (targetTimestamp: number) => {
  const now = new Date();
  const target = new Date(targetTimestamp);

  // Strip time part
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} day(s) ago`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return `${diffDays} days to go`;
};

const PremiumCard = ({navigation}: any) => {
  const [isViewBenefitsVisible, setIsViewBenefitsVisible] = useState(false);
  const {user} = useBoundStore();
  return (
    <View style={styles.card}>
      {user?.subscription && (
        <>
          <View style={styles.header}>
            <Icon name="crown" size={21} color="#f5c518" />
            <Text style={styles.title}>{user?.subscription.name}</Text>
            <Text style={styles.expiry}>
              {getDaysToGoFromTimestamp(user?.subscription.endDate)}
            </Text>
          </View>
          <View
            style={{
              padding: 16,
              backgroundColor: '#F3F4F6',
              marginBottom: 10,
              borderRadius: 10,
            }}>
            <View style={styles.listingContainer}>
              <Text style={styles.listingText}>Active Listing</Text>
              <Text style={styles.listingCount}>
                {user?.subscription?.subscriptionPlanId?.maxFeaturedListings -
                  user?.subscription?.remainingFeatured +
                  '/' +
                  user?.subscription?.subscriptionPlanId?.maxFeaturedListings}
              </Text>
            </View>

            <ProgressBar
              progress={
                parseInt(
                  // @ts-ignore
                  user?.subscription?.subscriptionPlanId?.maxFeaturedListings -
                    user?.subscription?.remainingFeatured,
                 10,) / user?.subscription?.subscriptionPlanId?.maxFeaturedListings
              }
              color="#2F8D79"
              style={styles.progressBar}
            />
          </View>
        </>
      )}
      <View style={styles.buttonContainer}>
        <Pressable
          style={user?.subscription ? styles.outlineButton : styles.filledButton}
          onPress={() => navigation.navigate('ManagePlans')}>
          <Text
            style={user?.subscription ? styles.outlineText : styles.filledText}>
            {!user?.subscription ? 'Explore Packages' : 'Manage Plan'}
          </Text>
        </Pressable>
        {user?.subscription && (
          <Pressable onPress={()=>setIsViewBenefitsVisible(true)} style={styles.filledButton}>
            <Text style={styles.filledText}>View Benefits</Text>
          </Pressable>
        )}
      </View>



      <ViewBenifitsModal
        visible={isViewBenefitsVisible}
        onClose={() => setIsViewBenefitsVisible(false)}
        selectedItem={user?.subscription?.subscriptionPlanId.benifits}
        onSubmit={() => {
          // let payload = {
          //   propertyId: details?._id,
          //   reason: data.reason,
          //   comment: data.comment,
          // };
          // reportAd(payload);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 10,
    margin: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 2,
    color: '#171717',
    flex: 1,
  },
  expiry: {
    fontSize: 12,
    color: '#666',
  },
  listingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    height: 20,
  },
  listingText: {
    fontSize: 14,
    color: '#333',
  },
  listingCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 4,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  outlineButton: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  filledButton: {
    flex: 1,
    backgroundColor: '#2F8D79',
    borderRadius: 8,
    padding: 10,
    marginLeft: 8,
    alignItems: 'center',
  },
  outlineText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  filledText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default PremiumCard;
