import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TextInput from '@components/Input/textInput';
import SelectInput, {SelectOption} from '@components/Input/selectInput';
import CommonDistanceInput from '@components/Input/distanceInput';
import {Fonts} from '@constants/font';
import SlideInView from './animatedView';

const Step1BasicInfo = ({currentStep}: any) => {
  const propertyOptions: SelectOption[] = [
    {label: 'Residential', value: 'residential'},
    {label: 'Commercial', value: 'commercial'},
    {label: 'Land', value: 'land'},
  ];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  return (
    <SlideInView direction={currentStep == null ? 'right' : 'left'}>
      <Text style={styles.headingText}>Basic Details</Text>
      <View style={styles.inputContainer}>
        <TextInput onChangeText={() => {}} placeholder="Property Title" />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          // value={}
          onChangeText={() => {}}
          placeholder="Property Description"
          placeholderTextColor={'#696969'}
          multiline
          style={{minHeight: 100, justifyContent: 'center'}}
        />
      </View>
      <View style={styles.inputContainer}>
        <SelectInput
          options={propertyOptions}
          selectedValue={selectedCategory}
          onSelect={setSelectedCategory}
          placeholder="Select Property Category"
        />
      </View>

      <View style={styles.inputContainer}>
        <SelectInput
          options={propertyOptions}
          selectedValue={selectedCategory}
          onSelect={setSelectedCategory}
          placeholder="Select Property Type"
        />
      </View>

      <View style={styles.inputContainer}>
        <SelectInput
          options={propertyOptions}
          selectedValue={selectedCategory}
          onSelect={setSelectedCategory}
          placeholder="Furnishing Status"
        />
      </View>

      <View style={styles.inputContainer}>
        <CommonDistanceInput
          label="Property Age"
          unit="years"
          // value={'10'}
          onChange={() => {}}
        />
      </View>

      <Text style={styles.headingText}>Contact Details</Text>
      <View style={styles.inputContainer}>
        <TextInput onChangeText={() => {}} placeholder="Name" />
      </View>
      <View style={styles.inputContainer}>
        <TextInput onChangeText={() => {}} placeholder="Mobile Number" />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={() => {}}
          placeholder="Secondary Mobile Number"
        />
      </View>
    </SlideInView>
  );
};

const styles = StyleSheet.create({
  container: {},
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

export default React.memo(Step1BasicInfo);
