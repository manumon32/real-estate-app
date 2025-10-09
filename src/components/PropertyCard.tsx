/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useCallback, Suspense} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useColorScheme,
} from 'react-native';
import Image from 'react-native-fast-image';
import IconButton from '@components/Buttons/IconButton';
// @ts-ignore
import FeaturedIcon from '@assets/svg/featured.svg';
import {Fonts} from '@constants/font';
import {useTheme} from '@theme/ThemeProvider';
import useBoundStore from '@stores/index';

// Lazy load favorite button
const FavoriteButton = React.lazy(() => import('./FavoriteButton'));

interface PropertyCardProps {
  items: any;
  navigation: any;
  arg?: boolean;
  horizontal?: boolean;
  showLocation?: boolean;
}

const InfoItem = React.memo(
  ({icon, text, color}: {icon: string; text: string; color: string}) => (
    <View style={styles.infoItem}>
      <IconButton iconSize={16} iconColor={color} iconName={icon} />
      <Text style={[styles.infoText, {color}]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  ),
);

const PropertyCard = React.memo(
  ({
    items,
    navigation,
    arg,
    horizontal,
    showLocation = false,
  }: PropertyCardProps) => {
    const {theme} = useTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const {user} = useBoundStore();

    /** Format price */
    const formattedPrice = useMemo(
      () =>
        new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        }).format(items.price),
      [items.price],
    );

    /** Format date */
    const formattedDate = useMemo(
      () =>
        new Date(items?.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
        }),
      [items?.createdAt],
    );

    /** Distance formatting */
    const distanceText = useMemo(() => {
      if (!items?.distance) return null;
      return items.distance < 1000
        ? `${items.distance.toFixed(2)} m`
        : `${(items.distance * 0.001).toFixed(2)} km`;
    }, [items?.distance]);

    /** Navigation handler */
    const handlePress = useCallback(() => {
      navigation.navigate('Details', {items});
    }, [navigation, items]);

    const imageUrls = items?.thumbnailUrls
      ? items?.thumbnailUrls[0]
      : items?.imageUrls?.[0];

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.text,
            borderWidth: isDarkMode ? 0.2 : Platform.OS === 'android' ? 0 : 0.2,
            bottom: arg ? 30 : 0,
            top: arg ? -30 : 10,
            width: horizontal ? '90%' : '47%',
          },
        ]}
        onPress={handlePress}
        accessible
        accessibilityLabel={`View details for ${items.title}`}>
        {/* Featured badge */}
        {items.isFeatured && (
          <View style={styles.badge}>
            <FeaturedIcon />
          </View>
        )}

        {/* Property Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: imageUrls,
              priority: Image.priority.normal,
              cache: Image.cacheControl.immutable,
            }}
            resizeMode="cover"
            style={styles.image}
          />

          {/* Lazy Favorite button */}
          {(!user?._id || user?._id !== items.customerId) && (
            <Suspense fallback={<View style={styles.heart} />}>
              <FavoriteButton item={items} tuchableStyle={styles.favoriteBtn} />
            </Suspense>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.price, {color: theme.colors.text}]}>
            {formattedPrice}
          </Text>

          <Text
            style={[styles.title, {color: theme.colors.text}]}
            numberOfLines={arg ? 2 : 1}>
            {items.title}
          </Text>

          {/* Address */}
          <View style={styles.addressRow}>
            <IconButton
              iconSize={16}
              iconColor={theme.colors.text}
              iconName="map-marker"
            />
            <Text
              numberOfLines={1}
              style={[styles.subtitle, {color: theme.colors.text}]}>
              {items.address}
            </Text>
          </View>

          {/* Distance */}
          {distanceText && showLocation && (
            <View style={styles.infoRow}>
              <InfoItem
                icon="vector-line"
                text={distanceText}
                color={theme.colors.text}
              />
            </View>
          )}

          {/* Date */}
          <Text
            numberOfLines={1}
            style={[styles.subtitle, {color: theme.colors.text}]}>
            {formattedDate}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    left: Platform.OS === 'android' ? 2 : 0,
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
    width: 28,
    height: 28,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  content: {
    padding: 5,
  },
  price: {
    fontSize: 16,
    fontFamily: Fonts.MEDIUM,
    fontWeight: 'bold',
    marginTop: 4,
    marginVertical: 6,
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 12,
    marginVertical: 2,
    maxWidth: 150,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: Fonts.REGULAR,
    fontWeight: '400',
  },
});

export default PropertyCard;
