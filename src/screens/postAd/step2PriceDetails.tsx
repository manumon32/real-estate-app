import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TextInput from '@components/Input/textInput';
// import SelectInput, {SelectOption} from '@components/Input/selectInput';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import CommonAmenityToggle from '@components/Input/amenityToggle';
import CommonDistanceInput from '@components/Input/distanceInput';

const Step2BasicInfo = ({currentStep}: any) => {
  const [isGym, setIsGym] = useState<boolean>(false);

  return (
    <SlideInView direction={currentStep === 1 ? 'right' : 'left'}>
      <Text style={styles.headingText}>Price Details</Text>
      <View style={styles.inputContainer}>
        <TextInput
          iconName="currency-inr"
          iconColor="#696969"
          onChangeText={text => {
            const numericValue = text.replace(/[^0-9]/g, '');
            console.log(numericValue);
          }}
          placeholder="Price"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <CommonAmenityToggle
          label="Price Negotiable"
          selected={isGym}
          onToggle={() => setIsGym(prev => !prev)}
        />
      </View>
      <View style={styles.inputContainer}>
        <CommonAmenityToggle
          label="Featured Property"
          selected={isGym}
          onToggle={() => setIsGym(prev => !prev)}
        />
      </View>
      <View style={styles.inputContainer}>
        <CommonDistanceInput
          label="Maintance Charge"
          unit="/Month"
          // value={'10'}
          onChange={() => {}}
        />
      </View>

      <View style={styles.inputContainer}>
        <CommonDistanceInput
          label="Property Tax"
          unit="/Annum"
          // value={'10'}
          onChange={() => {}}
        />

        <View style={styles.inputContainer}>
          <CommonAmenityToggle
            label="Loan Eligible"
            selected={isGym}
            onToggle={() => setIsGym(prev => !prev)}
          />
        </View>

        <View style={styles.inputContainer}>
          <CommonAmenityToggle
            label="RERA Approved"
            selected={isGym}
            onToggle={() => setIsGym(prev => !prev)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput onChangeText={() => {}} placeholder="RERA ID" />
        </View>
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

export default React.memo(Step2BasicInfo);
