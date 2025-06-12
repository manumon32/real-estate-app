/* eslint-disable react-native/no-inline-styles */
// import CommonHeader from '@components/Header/CommonHeader';
import React from 'react';
import {SafeAreaView} from 'react-native';
import PostAdContainer from './stepper';
import {Formik} from 'formik';
import { postAdValidationSchema } from './validationSchema';


const PostAd = () => {
  const initialValues = {
    title: '',
    description: '',
    numberOfBedrooms: '',
    numberOfBathrooms: '',
    propertyType: [],
    listingType: [],
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
        {({handleSubmit, setFieldValue, values, errors, touched, handleBlur, setTouched}) => (
          <PostAdContainer
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            handleSubmit={handleSubmit}
            handleBlur={handleBlur}
            setTouched={setTouched}
          />
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default PostAd;
