import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import SelectInput, {SelectOption} from '@components/Input/selectInput';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import CommonStepperInput from '@components/Input/stepperInput';
import CommonAmenityToggle from '@components/Input/amenityToggle';

const Step4PropertyDetails = ({currentStep}: any) => {
  const propertyOptions: SelectOption[] = [
    {label: 'Residential', value: 'residential'},
    {label: 'Commercial', value: 'commercial'},
    {label: 'Land', value: 'land'},
  ];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isGym, setIsGym] = useState<boolean>(false);

  const [noOfKitchens, setKitchen] = useState<number>(1);

  return (
    <SlideInView direction={currentStep === 3 ? 'right' : 'left'}>
      <Text style={styles.headingText}>Property Features</Text>

      <View style={styles.inputContainer}>
        <CommonStepperInput
          label="Kitchen"
          value={noOfKitchens}
          onChange={setKitchen}
        />
      </View>
      <View style={styles.inputContainer}>
        <CommonStepperInput
          label="Bedrooms"
          value={noOfKitchens}
          onChange={setKitchen}
        />
      </View>
      <View style={styles.inputContainer}>
        <CommonStepperInput
          label="Bathrooms"
          value={noOfKitchens}
          onChange={setKitchen}
        />
      </View>
      <View style={styles.inputContainer}>
        <CommonStepperInput
          label="Balconies"
          value={noOfKitchens}
          onChange={setKitchen}
        />
      </View>

      <Text style={styles.headingText}>Property Features</Text>

      <View style={styles.inputContainer}>
        <CommonAmenityToggle
          label="Gym"
          selected={isGym}
          onToggle={() => setIsGym(prev => !prev)}
        />
      </View>
      <View style={styles.inputContainer}>
        <CommonAmenityToggle
          label="Pool"
          selected={isGym}
          onToggle={() => setIsGym(prev => !prev)}
        />
      </View>

      <View style={styles.inputContainer}>
        <CommonAmenityToggle
          label="Parking"
          selected={isGym}
          onToggle={() => setIsGym(prev => !prev)}
        />
      </View>

      <View style={styles.inputContainer}>
        <SelectInput
          options={propertyOptions}
          selectedValue={selectedCategory}
          onSelect={setSelectedCategory}
          placeholder="Facing Direction"
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

export default React.memo(Step4PropertyDetails);
