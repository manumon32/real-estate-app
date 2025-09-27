/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Modal,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import IconButton from '@components/Buttons/IconButton';
import StepSlider from '@components/Input/StepSlider';
import useBoundStore from '@stores/index';
import {Fonts} from '@constants/font';
import CommonAmenityToggle from '@components/Input/amenityToggle';
import {useTheme} from '@theme/ThemeProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {GOOGLE_API_KEY} from '@constants/google';
import SafeFooter from '@components/SafeFooter';

const FilterModal = ({visible, onClose, onApply}: any) => {
  //
  const {appConfigs, setFilters, resetFilters, filters, setLocation, location} =
    useBoundStore();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  // const [price, setprice] = useState<number[]>([1000000, 5000000]);
  const [fields, setFields] = useState<{}>({});
  const [filtersNew, setFilterNew] = useState<any>(filters);
  const {theme} = useTheme();
  const PROPERTY_TYPES = appConfigs?.propertyTypes || [];
  const LISTING_TYPES = appConfigs?.listingTypes || [];
  const [predictions, setPredictions] = useState<any[]>([]);
  const FURNISHING_STATS = appConfigs?.furnishingStatuses || [];
  const AVAILABILITY_STATS = appConfigs?.availabilityStatuses || [];
  const BEDROOMS = [
    {name: '1 BHK', _id: '1', filterName: 'numberOfBedrooms'},
    {name: '2 BHK', _id: '2', filterName: 'numberOfBedrooms'},
    {name: '3 BHK', _id: '3', filterName: 'numberOfBedrooms'},
    {name: '4 BHK', _id: '4', filterName: 'numberOfBedrooms'},
    {name: '4+ BHK', _id: '4+', filterName: 'numberOfBedrooms'},
  ];
  const BATHROOMS = [
    {name: '1', _id: '1', filterName: 'numberOfBathrooms'},
    {name: '2', _id: '2', filterName: 'numberOfBathrooms'},
    {name: '3', _id: '3', filterName: 'numberOfBathrooms'},
    {name: '4', _id: '4', filterName: 'numberOfBathrooms'},
    {name: '4+', _id: '4+', filterName: 'numberOfBathrooms'},
  ];

  const updateFilter = useCallback(
    (name: string, item: any) => {
      if (name) {
        setFilterNew({...filtersNew, [name]: item});
      }
    },
    [filtersNew],
  );

  const fetchPredictions = useCallback(async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setPredictions([]);
      return;
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_API_KEY}&language=en`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      setPredictions(json?.predictions || []);
    } catch (err) {
      console.error('Prediction fetch failed', err);
    }
  }, []);

  const fetchPlaceDetails = async (placeId: string) => {
    setLoading(true);
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      console.log('res', json.result);
      const locations = json.result.geometry.location;
      let name = json.result.formatted_address || '';
      let city_name = null;
      let district_name = null;
      let state_name = null;
      let country_name = null;
      if (json.result.address_components) {
        const components = json.result.address_components;
        const city = components.find((c: any) => c.types.includes('locality'));
        const district = components.find((c: any) =>
          c.types.includes('administrative_area_level_2'),
        );
        const state = components.find((c: any) =>
          c.types.includes('administrative_area_level_1'),
        );
        const country = components.find((c: any) =>
          c.types.includes('country'),
        );

        if (city) {
          city_name = city.long_name;
        }
        if (district) {
          district_name = district.long_name;
        }
        if (state) {
          state_name = state.long_name;
        }
        if (country) {
          country_name = country.long_name;
        }
      }
      setLocation({
        name: name,
        lat: locations.lat,
        lng: locations.lng,
        city: city_name,
        district: district_name,
        state: state_name,
        country: country_name,
      });
      setPredictions([]);
    } catch (err) {
      console.error('Details fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = (item: any) => (
    <TouchableOpacity
      key={item.place_id}
      style={styles.item}
      onPress={() => fetchPlaceDetails(item.place_id)}>
      <MaterialCommunityIcons
        name="map-marker"
        size={20}
        color="#696969"
        style={{marginRight: 10}}
      />
      <Text style={styles.itemText}>{item.description}</Text>
    </TouchableOpacity>
  );

  const getMergedFields = useCallback((id: any, argFields: string[]) => {
    setFields(prev => {
      const newMap: any = {...prev};
      if (newMap[id]) {
        delete newMap[id];
      } else {
        newMap[id] = argFields;
      }
      return newMap;
    });
  }, []);

  const toggleItem = useCallback(
    (name: string, item: any, setSelectedList?: any) => {
      if (name) {
        let newFilter = filtersNew?.[name] ? filtersNew?.[name] : [];
        console.log(filtersNew);
        setFilterNew({
          ...filtersNew,
          [name]: newFilter?.includes(item)
            ? newFilter?.filter((i: any) => i !== item)
            : [...newFilter, item],
        });
      } else {
        setSelectedList((prev: any) => {
          const isMulti = Array.isArray(prev);
          return isMulti
            ? prev?.includes(item)
              ? prev?.filter((i: any) => i !== item)
              : [...prev, item]
            : item;
        });
      }
    },
    [filtersNew, setFilterNew],
  );

  useEffect(() => {
    setFilterNew(filters);
  }, [filters]);

  useEffect(() => {
    setQuery(location?.name ?? '');
  }, [location]);

  const renderChips = useCallback(
    (items: any[], selected?: any, setSelected?: any) => (
      <View style={styles.chipContainer}>
        {items.map((item: any, index: any) => {
          const newselected = item.filterName
            ? filtersNew?.[item.filterName]
            : selected;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                newselected?.includes(item._id) && styles.chipSelected,
              ]}
              onPress={() => {
                item.fields && getMergedFields(item._id, item.fields);
                toggleItem(item.filterName, item._id, setSelected);
              }}>
              <Text
                style={
                  newselected?.includes(item._id)
                    ? styles.chipTextSelected
                    : [styles.chipText, {color: theme.colors.text}]
                }>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ),
    [filtersNew, getMergedFields, theme, toggleItem],
  );

  const isStringInEitherArray = (value: string): boolean => {
    const mergedUnique = [...new Set(Object.values(fields).flat())];
    return mergedUnique.length <= 0 ? true : mergedUnique?.includes(value);
  };

  const updatePrice = (items: any) => {
    console.log(items);
    updateFilter('price', items);
  };

  const handleApply = useCallback(() => {
    setFilters(filtersNew);
    onApply();
  }, [filtersNew, onApply, setFilters]);
  const labelColor = {color: theme.colors.text};

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      backdropColor={'red'}
      statusBarTranslucent
      onRequestClose={onClose}
      style={{
        borderRadius: 20,
      }}>
      <View style={styles.container}>
        <View
          style={{
            marginTop: 'auto',
            height: '80%',
            backgroundColor: theme.colors.backgroundHome,
            borderRadius: 20,
          }}>
          <View style={{flexDirection: 'row', padding: 20, paddingBottom: 0}}>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              Filters & Sort
            </Text>
            <Pressable
              onPress={() => {
                onClose();
              }}
              style={styles.closeButton}>
              <IconButton
                iconSize={24}
                //red , heart
                iconColor={'#000'}
                iconName={'close'}
              />
            </Pressable>
          </View>

          <View
            style={{
              backgroundColor: '#EBEBEB',
              borderWidth: 1,
              borderColor: '#EBEBEB',
            }}
          />
          <ScrollView
            style={{
              borderRadius: 20,
              height: '80%',
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: theme.colors.backgroundHome,
              padding: 20,
              paddingTop: 0,
            }}>
            <View
              style={{
                top: 10,
                height: 48,
                borderWidth: 1,
                borderColor: '#EBEBEB',
                borderRadius: 12,
                flexDirection: 'row',
                backgroundColor: '#fff',
                width: '100%',
                paddingHorizontal: 12,
                marginBottom: 10,
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#696969"
              />
              <TextInput
                value={query}
                onChangeText={text => fetchPredictions(text)}
                placeholder="Enter location"
                style={{
                  height: 48,
                  width: '80%',
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  fontSize: 16,
                }}
              />
              <MaterialCommunityIcons
                name="close"
                size={20}
                onPress={() => {
                  setQuery('');
                  setPredictions([]);
                }}
                color="#696969"
              />
            </View>
            {loading ? (
              <ActivityIndicator style={{marginTop: 20}} />
            ) : (
              predictions.length > 0 && (
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    borderColor: '#EBEBEB',
                    borderWidth: 1,
                    marginTop: 10,
                    padding: 8,
                  }}>
                  {predictions.map(items => {
                    return renderItem(items);
                  })}
                </View>
              )
            )}
            <Text style={[styles.label, labelColor]}>Type</Text>
            {renderChips(PROPERTY_TYPES)}

            <Text style={[styles.label, labelColor]}>Listing Type</Text>

            {renderChips(LISTING_TYPES)}

            <Text style={[styles.label, labelColor]}>Bedrooms</Text>
            {renderChips(BEDROOMS)}

            <Text style={[styles.label, labelColor]}>Bathrooms</Text>
            {renderChips(BATHROOMS)}
            <View style={{marginTop: 20, marginBottom: -20}}>
              <StepSlider
                value={filtersNew?.price ? filtersNew?.price : [0, 1000]}
                theme={theme}
                onChange={updatePrice}
                // min={1000}
              />
            </View>
            {isStringInEitherArray('furnishedStatus') && (
              <>
                <Text style={[styles.label, labelColor]}>
                  Furnishing Status
                </Text>

                {renderChips(FURNISHING_STATS)}
              </>
            )}

            <Text style={[styles.label, labelColor]}>Availability Status</Text>

            {renderChips(AVAILABILITY_STATS)}
            {isStringInEitherArray('reraApproved') && (
              <>
                <Text style={[styles.label, labelColor]}>RERA Approved</Text>
                <CommonAmenityToggle
                  label="RERA Approved"
                  selected={filtersNew?.reraApproved}
                  onToggle={() =>
                    updateFilter('reraApproved', !filtersNew?.reraApproved)
                  }
                />
              </>
            )}
          </ScrollView>
          <SafeFooter style={{flexDirection: 'row', bottom: 10}}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setFields([]);
                setFilterNew({});
                resetFilters();
              }}>
              <Text style={[styles.applyText, {color: '#000'}]}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </SafeFooter>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
  },
  closeButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'flex-end',
    bottom: 10,
  },
  title: {
    width: '90%',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Fonts.MEDIUM,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
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
    // marginRight: 5,
    // marginBottom: 5,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 14,
    flex: 1,
    color: 'rgba(0, 0, 0, 0.82)',
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
  clearButton: {
    backgroundColor: '#f4f4f4',
    width: '45%',
    padding: 15,
    borderWidth: 1,
    marginRight: 5,
    marginLeft: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 0 : 30,
  },
  applyButton: {
    width: '45%',
    backgroundColor: '#2A9D8F',
    padding: 15,
    paddingRight: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 0 : 30,
  },
  applyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(FilterModal);
