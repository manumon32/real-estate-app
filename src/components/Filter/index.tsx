/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {
  Modal,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import IconButton from '@components/Buttons/IconButton';

const AMENITIES = ['Apartment', 'Villa', 'Plot', 'Studio'];
const LISTING_TYPES = ['Sale', 'Rent', 'Lease'];
const BEDROOMS = ['1BHK', '2BHK', '3BHK'];
const BATHROOMS = ['1', '2', '3', '4+'];
const EXTRA_AMENITIES = [
  {label: 'Gym', icon: 'dumbbell'},
  {label: 'Pool', icon: 'pool'},
  {label: 'Parking', icon: 'car'},
  {label: 'Security', icon: 'shield-check'},
];

const FilterModal = ({visible, onClose, onApply}: any) => {
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedListingType, setSelectedListingType] = useState(null);
  const [selectedBedrooms, setSelectedBedrooms] = useState(null);
  const [selectedBathrooms, setSelectedBathrooms] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);

  React.useEffect(() => {
    console.log(' Filter Modal loaded');
  }, [visible]);

  const toggleItem = useCallback((item: any, setSelectedList: any) => {
    setSelectedList((prev: any[]) =>
      prev.includes(item)
        ? prev.filter((i: any) => i !== item)
        : [...prev, item],
    );
  }, []);

  const renderChips = useCallback(
    (items: any[], selected: string | any[], setSelected: any) => (
      <View style={styles.chipContainer}>
        {items.map((item: any, index: any) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.chip,
              selected.includes(item) && styles.chipSelected,
            ]}
            onPress={() => toggleItem(item, setSelected)}>
            <Text
              style={
                selected.includes(item)
                  ? styles.chipTextSelected
                  : styles.chipText
              }>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
    [toggleItem],
  );

  const renderIconChips = useCallback(
    (
      items: {label: any; icon: any}[],
      selected: string | any[],
      setSelected: any,
    ) => (
      <View style={styles.chipContainer}>
        {items.map(({label, icon}) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.chip,
              selected.includes(label) && styles.chipSelected,
            ]}
            onPress={() => toggleItem(label, setSelected)}>
            <IconButton
              iconName={icon}
              iconSize={18}
              iconColor={selected.includes(label) ? '#fff' : '#333'}
              style={{marginRight: 5}}
            />
            <Text
              style={
                selected.includes(label)
                  ? styles.chipTextSelected
                  : styles.chipText
              }>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
    [toggleItem],
  );

  const handleApply = useCallback(() => {
    onApply({
      amenities: selectedAmenities,
      listingType: selectedListingType,
      bedrooms: selectedBedrooms,
      bathrooms: selectedBathrooms,
      extras: selectedExtras,
    });
    onClose();
  }, [
    selectedAmenities,
    selectedListingType,
    selectedBedrooms,
    selectedBathrooms,
    selectedExtras,
    onApply,
    onClose,
  ]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      backdropColor={'red'}
      onRequestClose={onClose}
      style={{}}>
      <View style={styles.container}>
        <View
          style={{
            marginTop: 'auto',
            height: '85%',
            backgroundColor: '#fff', 
          }}>
        <ScrollView
          contentContainerStyle={{backgroundColor: '#fff', padding: 20}}>
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
          <Text style={styles.label}>Amenities</Text>
          {renderChips(AMENITIES, selectedAmenities, setSelectedAmenities)}

          <Text style={styles.label}>Listing Type</Text>
          {renderChips(
            LISTING_TYPES,
            selectedListingType ? [selectedListingType] : [],
            (val: React.SetStateAction<null>[]) =>
              setSelectedListingType(val[0]),
          )}

          <Text style={styles.label}>Bedrooms</Text>
          {renderChips(
            BEDROOMS,
            selectedBedrooms ? [selectedBedrooms] : [],
            (val: React.SetStateAction<null>[]) => setSelectedBedrooms(val[0]),
          )}

          <Text style={styles.label}>Bathrooms</Text>
          {renderChips(
            BATHROOMS,
            selectedBathrooms ? [selectedBathrooms] : [],
            (val: React.SetStateAction<null>[]) => setSelectedBathrooms(val[0]),
          )}

          <Text style={styles.label}>Extra Amenities</Text>
          {renderIconChips(EXTRA_AMENITIES, selectedExtras, setSelectedExtras)}

          <Text style={styles.label}>Bathrooms</Text>
          {renderChips(
            BATHROOMS,
            selectedBathrooms ? [selectedBathrooms] : [],
            (val: React.SetStateAction<null>[]) => setSelectedBathrooms(val[0]),
          )}

          <Text style={styles.label}>Extra Amenities</Text>
          {renderIconChips(EXTRA_AMENITIES, selectedExtras, setSelectedExtras)}
          

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </ScrollView>
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
  },
  closeButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'flex-end',
  },
  title: {
    width: '90%',
    fontSize: 22,
    fontWeight: 'bold',
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
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  applyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(FilterModal);
