/* SimilarAds.tsx */
import PropertyCard from '@components/PropertyCard';
import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {View, FlatList, ActivityIndicator, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fetchListingsFromAPI} from '@api/services';

interface SimilarAdsProps {
  token: string | null;
  clientId: string | null;
  listingTypeId: any;
  propertyTypeId: any;
  location: any;
  propertyId: any;
  sectionColor: any;
  headerStyle: any;
  theme: any;
}

const SimilarAds: React.FC<SimilarAdsProps> = ({
  token,
  clientId,
  listingTypeId,
  propertyTypeId,
  location,
  propertyId,
  sectionColor,
  headerStyle,
  theme,
}) => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const controller = new AbortController();

    const fetchSimilarAds = async () => {
      try {
        setLoading(true);
        let filters: any = {
          pageNum: 1,
          pageSize: 6,
          listingTypeId,
          propertyTypeId,
          orderBy: 'distance',
          orderByDir: 'asc',
          filter__id: 'nin-' + propertyId,
        };

        if (location) {
          const {city, district, state, country, lat, lng} = location;

          if (city || district) {
            filters = {
              ...filters,
              filter_near: [lat, lng, city ? 30 : 50].join(','), // 30 = radius
              orderBy: 'distance',
              orderByDir: 'asc',
            };
          } else if (state) {
            filters = {
              ...filters,
              filter_state: state,
              orderBy: 'distance',
              orderByDir: 'asc',
            };
          } else if (country) {
            filters = {
              ...filters,
              filter_country: country,
              orderBy: 'distance',
              orderByDir: 'asc',
            };
          }
        }

        const res = await fetchListingsFromAPI(filters, {token, clientId});
        setAds(res?.rows ?? []);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Failed to load similar ads:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarAds();

    return () => controller.abort();
  }, [clientId, listingTypeId, location, propertyId, propertyTypeId, token]);

  const renderAdItem = useCallback(
    ({item}: any) => (
      <View style={{width: 200}}>
        <PropertyCard items={item} navigation={navigation} horizontal />
      </View>
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: any) => item._id, []);

  const memoizedAds = useMemo(() => ads, [ads]);

  if (loading) {
    return (
      <View style={{padding: 16}}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!memoizedAds.length) return null;

  return (
    <>
      {memoizedAds.length > 0 && (
        <Text style={[headerStyle, sectionColor, {marginBottom: 10}]}>
          Similar Ads
        </Text>
      )}
      <View
        style={[
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor: theme.colors.backgroundHome,
            paddingBottom: 10,
          },
        ]}>
        <FlatList
          data={memoizedAds}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={keyExtractor}
          renderItem={renderAdItem}
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          windowSize={7}
          removeClippedSubviews
          contentContainerStyle={{padding: 5}}
        />
      </View>
    </>
  );
};

export default React.memo(SimilarAds);
