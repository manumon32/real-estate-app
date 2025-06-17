import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TextInput from '@components/Input/textInput';
// import SelectInput, {SelectOption} from '@components/Input/selectInput';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import CommonAmenityToggle from '@components/Input/amenityToggle';
import CommonDistanceInput from '@components/Input/distanceInput';

const Step2BasicInfo = (props: any) => {
  const {
    currentStep,
    setFieldValue,
    values,
    handleBlur,
    touched,
    errors,
    isStringInEitherArray,
  } = props;

  return (
    <SlideInView direction={currentStep === 1 ? 'right' : 'left'}>
      <Text style={styles.headingText}>Price Details</Text>
      <View style={styles.inputContainer}>
        <TextInput
          iconName="currency-inr"
          iconColor="#696969"
          onChangeText={text => setFieldValue('price', text)}
          value={String(values?.price)}
          placeholder="Price"
          placeholderTextColor={'#ccc'}
          onBlur={handleBlur('price')}
          error={touched?.price && errors?.price ? true : false}
          keyboardType="numeric"
        />
      </View>
      {touched?.price && errors?.price && (
        <Text style={styles.error}>{errors?.price}</Text>
      )}
      <View style={styles.inputContainer}>
        <CommonAmenityToggle
          label="Price Negotiable"
          selected={values.isNegotiable}
          onToggle={() => setFieldValue('isNegotiable', !values.isNegotiable)}
        />
      </View>
      <View style={styles.inputContainer}>
        <CommonAmenityToggle
          label="Featured Property"
          selected={values.isFeatured}
          onToggle={() => setFieldValue('isFeatured', !values.isFeatured)}
        />
      </View>
      {isStringInEitherArray('maintanceCharge') && (
        <View style={styles.inputContainer}>
          <CommonDistanceInput
            label="Maintance Charge"
            unit="/Month"
            value={values.maintenanceCharge}
            onChange={text => setFieldValue('maintenanceCharge', text)}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        {isStringInEitherArray('propertyTax') && (
          <CommonDistanceInput
            label="Property Tax"
            unit="/Annum"
            value={values.propertyTax}
            onChange={text => setFieldValue('propertyTax', text)}
          />
        )}
        {isStringInEitherArray('loanEligible') && (
          <View style={styles.inputContainer}>
            <CommonAmenityToggle
              label="Loan Eligible"
              selected={values.loanEligible}
              onToggle={() =>
                setFieldValue('loanEligible', !values.loanEligible)
              }
            />
          </View>
        )}

        {isStringInEitherArray('reraApproved') && (
          <View style={styles.inputContainer}>
            <CommonAmenityToggle
              label="RERA Approved"
              selected={values.reraApproved}
              onToggle={() =>
                setFieldValue('reraApproved', !values.reraApproved)
              }
            />
          </View>
        )}
        {isStringInEitherArray('reraId') && (
          <View style={styles.inputContainer}>
            <TextInput
              value={values?.reraId}
              onChangeText={text => setFieldValue('reraId', text)}
              placeholder="RERA ID"
            />
          </View>
        )}
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
  error: {
    color: 'red',
    marginBottom: 2,
    marginTop: 3,
    left: 10,
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
  },
});

export default React.memo(Step2BasicInfo);
