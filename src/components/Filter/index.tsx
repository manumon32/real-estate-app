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

const FilterModal = ({visible, onClose, onApply}: any) => {
  const {setFilters, appConfigs} = useBoundStore();
  const [selectedPropertyType, setSelectedPropertyType] = useState([]);
  const [selectedListingType, setSelectedListingType] = useState(null);
  const [selectedBedrooms, setSelectedBedrooms] = useState(null);
  const [selectedBathrooms, setSelectedBathrooms] = useState(null);
  const [priceRange, setPriceRange] = useState<number[]>([1000000, 5000000]);

  const PROPERTY_TYPES = appConfigs?.propertyTypes || [];
  const LISTING_TYPES = appConfigs?.listingTypes || [];
  const BEDROOMS = [
    {name: '1BHK', _id: '1BHK'},
    {name: '2BHK', _id: '2BHK'},
    {name: '3BHK', _id: '3BHK'},
  ];
  const BATHROOMS = [
    {name: '1', _id: '1'},
    {name: '2', _id: '1'},
    {name: '3', _id: '1'},
    {name: '4+', _id: '4+'},
  ];

  const toggleItem = useCallback((item: any, setSelectedList: any) => {
    setSelectedList((prev: any) => {
      const isMulti = Array.isArray(prev);
      console.log(prev);
      return isMulti
        ? prev?.includes(item)
          ? prev.filter((i: any) => i !== item)
          : [...prev, item]
        : item;
    });
  }, []);

  useEffect(() => {
    console.log(appConfigs);
  }, [appConfigs]);

  const renderChips = useCallback(
    (items: any[], selected: any, setSelected: any) => (
      <View style={styles.chipContainer}>
        {items.map((item: any, index: any) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.chip,
              selected?.includes(item._id) && styles.chipSelected,
            ]}
            onPress={() => toggleItem(item._id, setSelected)}>
            <Text
              style={
                selected?.includes(item._id)
                  ? styles.chipTextSelected
                  : styles.chipText
              }>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
    [toggleItem],
  );

  // const renderIconChips = useCallback(
  //   (
  //     items: {label: any; icon: any}[],
  //     selected: string | any[],
  //     setSelected: any,
  //   ) => (
  //     <View style={styles.chipContainer}>
  //       {items.map(({label, icon}) => (
  //         <TouchableOpacity
  //           key={label}
  //           style={[
  //             styles.chip,
  //             selected.includes(label) && styles.chipSelected,
  //           ]}
  //           onPress={() => toggleItem(label, setSelected)}>
  //           <IconButton
  //             iconName={icon}
  //             iconSize={18}
  //             iconColor={selected.includes(label) ? '#fff' : '#333'}
  //             style={{marginRight: 5}}
  //           />
  //           <Text
  //             style={
  //               selected.includes(label)
  //                 ? styles.chipTextSelected
  //                 : styles.chipText
  //             }>
  //             {label}
  //           </Text>
  //         </TouchableOpacity>
  //       ))}
  //     </View>
  //   ),
  //   [toggleItem],
  // );

  const handleApply = useCallback(() => {
    setFilters({
      amenities: selectedPropertyType,
      listingType: selectedListingType,
      bedrooms: selectedBedrooms,
      bathrooms: selectedBathrooms,
    });
    onApply();
  }, [
    setFilters,
    selectedPropertyType,
    selectedListingType,
    selectedBedrooms,
    selectedBathrooms,
    onApply,
  ]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      backdropColor={'red'}
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
          <ScrollView
            style={{
              borderRadius: 20,
              height: '80%',
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: '#fff',
              padding: 20,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.title}>Filters & Sort</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
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
                width: '100%',
                // top: 15,
              }}
            />
            <Text style={styles.label}>Type</Text>
            {renderChips(
              PROPERTY_TYPES,
              selectedPropertyType,
              setSelectedPropertyType,
            )}

            <Text style={styles.label}>Listing Type</Text>

            {renderChips(
              LISTING_TYPES,
              selectedListingType,
              setSelectedListingType,
            )}

            <Text style={styles.label}>Bedrooms</Text>
            {renderChips(BEDROOMS, selectedBedrooms, setSelectedBedrooms)}

            <Text style={styles.label}>Bathrooms</Text>
            {renderChips(BATHROOMS, selectedBathrooms, setSelectedBathrooms)}

            <StepSlider
              value={priceRange}
              onChange={setPriceRange}
              min={10000}
            />
          </ScrollView>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
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
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
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
  applyButton: {
    backgroundColor: '#2A9D8F',
    padding: 15,
    marginRight: 15,
    marginLeft: 15,
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
