import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TextInput from '@components/Input/textInput';
import SelectInput, {SelectOption} from '@components/Input/selectInput';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import CommonDistanceInput from '@components/Input/distanceInput';

const Step3LocationDetails = ({currentStep}: any) => {
  const propertyOptions: SelectOption[] = [
    {label: 'Residential', value: 'residential'},
    {label: 'Commercial', value: 'commercial'},
    {label: 'Land', value: 'land'},
  ];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <SlideInView direction={currentStep === 2 ? 'right' : 'left'}>
      <Text style={styles.headingText}>Location and Area Details</Text>
      <View style={styles.inputContainer}>
        <TextInput onChangeText={() => {}} placeholder="Full Address" />
      </View>

      <View style={styles.inputContainer}>
        <SelectInput
          options={propertyOptions}
          selectedValue={selectedCategory}
          onSelect={setSelectedCategory}
          placeholder="City"
        />
      </View>

      <View style={styles.inputContainer}>
        <SelectInput
          options={propertyOptions}
          selectedValue={selectedCategory}
          onSelect={setSelectedCategory}
          placeholder="State"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput onChangeText={() => {}} placeholder="Land Mark" />
      </View>

      <View style={styles.inputContainer}>
        <TextInput onChangeText={() => {}} placeholder="Pin code" />
      </View>

      <Text style={styles.headingText}>Location Benefits</Text>
      <View style={styles.inputContainer}>
        <CommonDistanceInput
          label="Hospital"
          unit="/km"
          // value={'10'}
          onChange={() => {}}
        />
      </View>
      <View style={styles.inputContainer}>
        <CommonDistanceInput
          label="School"
          unit="/km"
          // value={'10'}
          onChange={() => {}}
        />
      </View>
      <View style={styles.inputContainer}>
        <CommonDistanceInput
          label="Metro Station"
          unit="/km"
          // value={'10'}
          onChange={() => {}}
        />
      </View>
      <Text style={styles.headingText}>Area Details</Text>
      <View style={styles.inputContainer}>
        <CommonDistanceInput
          label="Area Size"
          unit="/Sq.ft"
          // value={'10'}
          onChange={() => {}}
        />
      </View>
      <View style={styles.inputContainer}>
        <CommonDistanceInput
          label="Carpet Area"
          unit="/Sq.ft"
          // value={'10'}
          onChange={() => {}}
        />
      </View>
      <View style={styles.inputContainer}>
        <CommonDistanceInput
          label="Build-up Area"
          unit="/Sq.ft"
          // value={'10'}
          onChange={() => {}}
        />
      </View>

      <View style={styles.inputContainer}>
        <CommonDistanceInput
          label="Super Build-up Area"
          unit="/Sq.ft"
          // value={'10'}
          onChange={() => {}}
        />
      </View>
    </SlideInView>
  );
};

const styles = StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
  },
  priceInputContainer: {
    padding: 5,
    width: '70%',
  },
  priceUnitContainer: {
    padding: 5,
    width: '30%',
  },
  inputContainer: {
    padding: 5,
  },
  headingText: {
    color: '#171717',
    fontFamily: Fonts.MEDIUM,
    fontSize: 20,
    margin: 10,
    marginTop: 20,
  },
});

export default React.memo(Step3LocationDetails);
