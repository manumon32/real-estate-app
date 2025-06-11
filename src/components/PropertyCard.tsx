/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import Image from 'react-native-fast-image';
import IconButton from '@components/Buttons/IconButton';
import FeaturedIcon from '@assets/svg/featured.svg';
import {Fonts} from '@constants/font';
import FavoriteButton from './FavoriteButton';

const PropertyCard = React.memo(({items, navigation, arg}: any) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          bottom: arg ? 30 : 0,
          top: arg ? -30 : 10,
        },
      ]}
      onPress={() => {
        navigation.navigate('Details', {items});
      }}>
      {/* Featured badge */}
      {items.isFeatured && (
        <View style={styles.badge}>
          <FeaturedIcon />
        </View>
      )}

      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: items.imageUrls?.[0]
              ? items.imageUrls[0]
              : 'https://media.istockphoto.com/id/1396856251/photo/colonial-house.jpg?s=612x612&w=0&k=20&c=_tGiix_HTQkJj2piTsilMuVef9v2nUwEkSC9Alo89BM=',
            priority: Image.priority.normal,
          }}
          resizeMode="contain"
          style={styles.image}
        />
        <FavoriteButton
          item={items}
          tuchableStyle={{
            position: 'absolute',
            top: 4,
            right: 4,
          }}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {items.title}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <IconButton
            iconSize={16}
            iconColor={'#171717'}
            iconName={'map-marker'}
          />
          <Text style={styles.subtitle}>{items.city}</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <IconButton
              iconSize={16}
              iconColor={'#171717'}
              iconName={'bed-empty'}
            />
            {/* <BedIcon /> */}
            <Text style={styles.infoText}>{items.numberOfBedrooms} Beds</Text>
          </View>
          {items?.distance && (
            <View style={styles.infoItem}>
              <IconButton
                iconSize={16}
                iconColor={'#171717'}
                iconName={'vector-line'}
              />
              <Text style={styles.infoText}>
                {items?.distance < 1000
                  ? (items?.distance).toFixed(2) + ' m'
                  : (items?.distance * 0.001).toFixed(2) + ' km'}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.price}>
          <IconButton
            iconSize={14}
            iconColor={'#171717'}
            iconName={'currency-inr'}
          />
          {items.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    left: Platform.OS === 'android' ? 2 : 0,
    width: '47%',
    // height: 234,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 5,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 10,
    padding: 6,
  },
  badge: {
    position: 'absolute',
    zIndex: 10,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 120,
    overflow: 'hidden',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heart: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  content: {
    padding: 5,
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 12,
    color: '#777',
    marginVertical: 2,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 3,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
    fontFamily: Fonts.REGULAR,
    fontWeight: '400',
  },
  price: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    fontWeight: '500',
    marginTop: 4,
    marginVertical: 6,
  },
});

export default PropertyCard;
