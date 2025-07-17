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
} from 'react-native';
import IconButton from '@components/Buttons/IconButton';
import StepSlider from '@components/Input/StepSlider';
import useBoundStore from '@stores/index';
import {Fonts} from '@constants/font';
import CommonAmenityToggle from '@components/Input/amenityToggle';

const FilterModal = ({visible, onClose, onApply}: any) => {
  //
  const {appConfigs, setFilters, resetFilters, filters} = useBoundStore();
  // const [price, setprice] = useState<number[]>([1000000, 5000000]);
  const [fields, setFields] = useState<{}>({});
  const [filtersNew, setFilterNew] = useState<any>(filters);

  const PROPERTY_TYPES = appConfigs?.propertyTypes || [];
  const LISTING_TYPES = appConfigs?.listingTypes || [];
  const FURNISHING_STATS = appConfigs?.furnishingStatuses || [];
  const AVAILABILITY_STATS = appConfigs?.availabilityStatuses || [];
  const BEDROOMS = [
    {name: '1 BHK', _id: '1', filterName: 'numberOfBedrooms'},
    {name: '2 BHK', _id: '2', filterName: 'numberOfBedrooms'},
    {name: '3 BHK', _id: '3', filterName: 'numberOfBedrooms'},
    {name: '4 BHK', _id: '4', filterName: 'numberOfBedrooms'},
    {name: '4+ BHK', _id: '4%2B', filterName: 'numberOfBedrooms'},
  ];
  const BATHROOMS = [
    {name: '1', _id: '1', filterName: 'numberOfBathrooms'},
    {name: '2', _id: '2', filterName: 'numberOfBathrooms'},
    {name: '3', _id: '3', filterName: 'numberOfBathrooms'},
    {name: '4', _id: '4', filterName: 'numberOfBathrooms'},
    {name: '4+', _id: '4%2B', filterName: 'numberOfBathrooms'},
  ];

  const updateFilter = useCallback(
    (name: string, item: any) => {
      if (name) {
        setFilterNew({...filtersNew, [name]: item});
      }
    },
    [filtersNew],
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
        setFilterNew({
          ...filtersNew,
          [name]: newFilter?.includes(item)
            ? newFilter.filter((i: any) => i !== item)
            : [...newFilter, item],
        });
      } else {
        setSelectedList((prev: any) => {
          const isMulti = Array.isArray(prev);
          return isMulti
            ? prev?.includes(item)
              ? prev.filter((i: any) => i !== item)
              : [...prev, item]
            : item;
        });
      }
    },
    [filtersNew, setFilterNew],
  );

  useEffect(()=>{
    setFilterNew(filters);
  },[filters])

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
                    : styles.chipText
                }>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ),
    [filtersNew, getMergedFields, toggleItem],
  );

  const isStringInEitherArray = (value: string): boolean => {
    const mergedUnique = [...new Set(Object.values(fields).flat())];
    return mergedUnique.length <= 0 ? true : mergedUnique?.includes(value);
  };

  const updatePrice = (items: any) => {
    updateFilter('price', items);
  };

  const handleApply = useCallback(() => {
    setFilters(filtersNew);
    onApply();
  }, [filtersNew, onApply, setFilters]);

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
            backgroundColor: '#fff',
            borderRadius: 20,
          }}>
          <View style={{flexDirection: 'row', padding: 20, paddingBottom: 0}}>
            <Text style={styles.title}>Filters & Sort</Text>
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
              backgroundColor: '#fff',
              padding: 20,
              paddingTop: 0,
            }}>
            <Text style={[styles.label]}>Type</Text>
            {renderChips(PROPERTY_TYPES)}

            <Text style={styles.label}>Listing Type</Text>

            {renderChips(LISTING_TYPES)}

            <Text style={styles.label}>Bedrooms</Text>
            {renderChips(BEDROOMS)}

            <Text style={styles.label}>Bathrooms</Text>
            {renderChips(BATHROOMS)}
            <View style={{marginTop: 20, marginBottom: -20}}>
              <StepSlider
                value={
                  filtersNew?.price ? filtersNew?.price : [100, 100000000000]
                }
                onChange={updatePrice}
                min={1000}
              />
            </View>
            {isStringInEitherArray('furnishedStatus') && (
              <>
                <Text style={styles.label}>Furnishing Status</Text>

                {renderChips(FURNISHING_STATS)}
              </>
            )}

            <Text style={styles.label}>Availability Status</Text>

            {renderChips(AVAILABILITY_STATS)}
            {isStringInEitherArray('reraApproved') && (
              <>
                <Text style={styles.label}>RERA Approved</Text>
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
          <View style={{flexDirection: 'row', bottom:10}}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setFields([]);
                setFilterNew({});
                resetFilters();
                onClose();
              }}>
              <Text style={[styles.applyText, {color:'#000'}]}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
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
    width:'45%',
    padding: 15,
    borderWidth:0.5,
    marginRight: 5,
    marginLeft: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 0 : 30,
  },
  applyButton: {
    width:'45%',
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
