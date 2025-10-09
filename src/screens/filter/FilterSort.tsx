import React, {useMemo} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import useBoundStore from '@stores/index';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface FilterChipsProps {
  setFilters: (filters: any) => void;
  fetchFilterListings: () => void;
  theme: any;
}

const FilterChips: React.FC<FilterChipsProps> = ({setFilters, theme}) => {
  const {filters, clearFilterList, appConfigs} = useBoundStore();
  const {listingTypes = [], propertyTypes}: any = appConfigs;

  // 🔹 Get all listing type names from IDs
  const listingTypeNames = useMemo(() => {
    if (!filters.listingTypeId || !Array.isArray(filters.listingTypeId)) {
      return [];
    }
    return filters.listingTypeId
      .map((id: string) => {
        const item = listingTypes.find((lt: {_id: string}) => lt._id === id);
        return item ? {id: item._id, name: item.name} : null;
      })
      .filter(Boolean) as {id: string; name: string}[];
  }, [filters.listingTypeId, listingTypes]);

  const propertyTypeNames = useMemo(() => {
    if (!filters.propertyTypeId || !Array.isArray(filters.propertyTypeId)) {
      return [];
    }
    return filters.propertyTypeId
      .map((id: string) => {
        const item = propertyTypes.find((lt: {_id: string}) => lt._id === id);
        return item ? {id: item._id, name: item.name} : null;
      })
      .filter(Boolean) as {id: string; name: string}[];
  }, [filters.propertyTypeId, propertyTypes]);

  // 🔹 Remove a single listingTypeId
  const handleRemoveListingType = async (id: string) => {
    const updatedIds = filters.listingTypeId.filter(
      (listingId: string) => listingId !== id,
    );
    clearFilterList();
    setFilters({...filters, listingTypeId: updatedIds});
  };
  const handleRemovePropertyType = async (id: string) => {
    const updatedIds = filters.propertyTypeId.filter(
      (listingId: string) => listingId !== id,
    );
    clearFilterList();
    setFilters({...filters, propertyTypeId: updatedIds});
  };
  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {propertyTypeNames.map(({id, name}) => (
        <View
          key={id}
          style={[
            styles.chip,
            filters.orderBy === 'distance' && styles.chipSelected,
          ]}>
          <TouchableOpacity
            // eslint-disable-next-line react-native/no-inline-styles
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => handleRemovePropertyType(id)}>
            <Text
              style={[
                styles.chipText,
                {color: theme.colors.text},
                filters.orderBy === 'distance' && styles.chipTextSelected,
              ]}>
              {name}
            </Text>
            <MaterialCommunityIcons
              name="close"
              size={12}
              color={filters.orderBy === 'distance' ? '#fff' : '#666'}
              style={{}}
            />
          </TouchableOpacity>
        </View>
      ))}
      {listingTypeNames.map(({id, name}) => (
        <View
          key={id}
          style={[
            styles.chip,
            filters.orderBy === 'distance' && styles.chipSelected,
          ]}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => handleRemoveListingType(id)}>
            <Text
              style={[
                styles.chipText,
                {color: theme.colors.text},
                filters.orderBy === 'distance' && styles.chipTextSelected,
              ]}>
              {name}
            </Text>
            <MaterialCommunityIcons
              name="close"
              size={12}
              color={filters.orderBy === 'distance' ? '#fff' : '#666'}
              style={{}}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default FilterChips;

const styles = StyleSheet.create({
  container: {
    padding: 4,
    paddingRight: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 5,
    backgroundColor: '#f5f5f5',
  },
  chipSelected: {
    backgroundColor: '#2A9D8F',
    borderColor: '#2A9D8F',
  },
  chipText: {
    fontSize: 14,
    marginRight: 6,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  clearButton: {
    // marginLeft: 1,
    // padding: 2,
    // borderRadius: 10,
  },
});
