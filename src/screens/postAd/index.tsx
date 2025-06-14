/* eslint-disable react-native/no-inline-styles */
// import CommonHeader from '@components/Header/CommonHeader';
import React from 'react';
import {SafeAreaView} from 'react-native';
import PostAdContainer from './stepper';
import {Formik} from 'formik';
import {postAdValidationSchema} from './validationSchema';
import useBoundStore from '@stores/index';

const PostAd = () => {

  const {locationForAdpost} = useBoundStore();
  const initialValues = {
    title: '',
    description: '',
    numberOfBedrooms: '',
    numberOfBathrooms: '',
    propertyTypeId: '',
    listingTypeId: '',
    price: 0,
    isNegotiable: true,
    isFeatured: false,
    maintenanceCharge: 0,
    propertyTax: 0,
    loanEligible: false,
    reraApproved: false,
    reraId: '',
    areaSize: '',
    carpetArea: '',
    builtUpArea: '',
    superBuiltUpArea: '',
    nearbyLandmarks: [
      {
        name: 'School',
        value: '5',
        unit: 'Km',
      },
    ],
    address:locationForAdpost?.name,
    latitude:locationForAdpost?.lat,
    longitude:locationForAdpost?.lng,
    numberOfBalconies:1,
    carParking:1
    // Add other fields
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Formik
        initialValues={initialValues}
        validationSchema={postAdValidationSchema}
        onSubmit={values => {
          console.log('Form submitted!', values);
        }}>
        {({
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
          handleBlur,
          setTouched,
          handleChange,
        }) => (
          <PostAdContainer
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            handleSubmit={handleSubmit}
            handleBlur={handleBlur}
            setTouched={setTouched}
            handleChange={handleChange}
          />
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default PostAd;
