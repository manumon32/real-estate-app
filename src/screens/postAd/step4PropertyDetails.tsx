import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import CommonStepperInput from '@components/Input/stepperInput';
import CommonAmenityToggle from '@components/Input/amenityToggle';
import useBoundStore from '@stores/index';

const Step4PropertyDetails = (props: any) => {
  const [isGym, setIsGym] = useState<boolean>(false);
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

  const AMENITIES = appConfigs?.amenities || [];
  return (
    <SlideInView direction={currentStep === 3 ? 'right' : 'left'}>
      <Text style={styles.headingText}>Property Features</Text>

      {isStringInEitherArray('kitchen') && (
        <View style={styles.inputContainer}>
          <CommonStepperInput
            label="Kitchen"
            value={values.carParking}
            onChange={value => {
              setFieldValue(`carParking`, value);
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

      <Text style={styles.headingText}>Amenities</Text>

      {isStringInEitherArray('amenities') &&
        AMENITIES.map(
          items =>
            items.name && (
              <View style={styles.inputContainer}>
                <CommonAmenityToggle
                  label={items.name}
                  selected={isGym}
                  onToggle={() => setIsGym(prev => !prev)}
                />
              </View>
            ),
        )}
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
