import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import CommonStepperInput from '@components/Input/stepperInput';
import useBoundStore from '@stores/index';
import {CommonMultiSelect} from '@components/Input/CommonMultiSelect';
import { useTheme } from '@theme/ThemeProvider';

const Step4PropertyDetails = (props: any) => {
  // const amenityOptions = [
  //   {label: 'Pool', value: 'pool'},
  //   {label: 'Gym', value: 'gym'},
  //   {label: 'Parking', value: 'parking'},
  // ];

  const {appConfigs} = useBoundStore();

  const {
    currentStep,
    setFieldValue,
    values,
    // handleBlur,
    // touched,
    // errors,
    isStringInEitherArray,
  } = props;

  const {theme} = useTheme();
  const AMENITIES = appConfigs?.amenities || [];
  return (
    <SlideInView direction={currentStep === 3 ? 'right' : 'left'}>
      {(isStringInEitherArray('kitchen') ||
        isStringInEitherArray('balcony') ||
        isStringInEitherArray('carParking')) && (
        <Text style={[styles.headingText, {color: theme.colors.text}]}>
          Property Features
        </Text>
      )}

      {isStringInEitherArray('kitchen') && (
        <View style={styles.inputContainer}>
          <CommonStepperInput
            label="Kitchen"
            value={values.numberOfKitchens}
            onChange={value => {
              setFieldValue(`numberOfKitchens`, value);
            }}
          />
        </View>
      )}
      {isStringInEitherArray('balcony') && (
        <View style={styles.inputContainer}>
          <CommonStepperInput
            label="Balconies"
            value={values.numberOfBalconies}
            onChange={value => {
              setFieldValue(`numberOfBalconies`, value);
            }}
          />
        </View>
      )}
      {isStringInEitherArray('carParking') && (
        <View style={styles.inputContainer}>
          <CommonStepperInput
            label="Car Parking"
            value={values.carParking}
            onChange={value => {
              setFieldValue(`carParking`, value);
            }}
          />
        </View>
      )}

      {/* {isStringInEitherArray('amenities') && ( */}
        <>
          <Text style={[styles.headingText, {color: theme.colors.text}]}>
            Amenities
          </Text>
          <CommonMultiSelect
            options={AMENITIES}
            value={values.amenityIds}
            onChange={items => {
              setFieldValue('amenityIds', items);
            }}
            placeholder="Select Amenities"
            showSelectAll
          />
        </>
      {/* )} */}
      {/* <View style={styles.inputContainer}>
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
      </View> */}
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
