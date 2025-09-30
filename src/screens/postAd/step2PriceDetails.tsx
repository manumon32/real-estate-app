import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TextInput from '@components/Input/textInput';
// import SelectInput, {SelectOption} from '@components/Input/selectInput';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import CommonAmenityToggle from '@components/Input/amenityToggle';
import CommonDistanceInput from '@components/Input/distanceInput';
import {useTheme} from '@theme/ThemeProvider';

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
  const [priceInput, setPriceInput] = useState('');

  const valueInputRef = useRef(null);

  const formatINR = (value: string | number) => {
    const num =
      typeof value === 'string'
        ? parseInt(value.replace(/\D/g, ''), 10)
        : value;
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  useEffect(() => {
    setPriceInput(values?.price?.toString() || '');
  }, [values?.price]);
  useEffect(() => {
    if (touched?.price && errors?.price && valueInputRef.current) {
      // @ts-ignore
      valueInputRef.current?.focus();
    }
  }, [errors?.price, touched?.price]);

  const {theme} = useTheme();
  return (
    <SlideInView direction={currentStep === 1 ? 'right' : 'left'}>
      <Text style={[styles.headingText, {color: theme.colors.text}]}>
        Price Details
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          // @ts-ignore
          ref={valueInputRef}
          onChangeText={text => {
            // Allow only numbers
            const numeric = text.replace(/\D/g, '');
            setPriceInput(numeric);
            setFieldValue('price', numeric);
          }}
          value={formatINR(priceInput)}
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
            value={String(values.propertyTax)}
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
