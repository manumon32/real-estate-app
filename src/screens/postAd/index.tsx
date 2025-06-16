/* eslint-disable react-native/no-inline-styles */
// import CommonHeader from '@components/Header/CommonHeader';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import PostAdContainer from './stepper';
import {Formik} from 'formik';
import {postAdValidationSchema} from './validationSchema';
import useBoundStore from '@stores/index';
import {useRoute} from '@react-navigation/native';
import {fetchDetailsAPI} from '@api/services';

const PostAd = () => {
  const route = useRoute();
  const {items}: any = route.params;
  const {locationForAdpost, token, clientId} = useBoundStore();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
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
    address: locationForAdpost?.name,
    latitude: locationForAdpost?.lat,
    longitude: locationForAdpost?.lng,
    numberOfBalconies: 1,
    carParking: 1,
    amenityIds: [],
    imageUrls: [],
    // Add other fields
  });
  if (items?._id) {
  }

  const fetchDetails = useCallback(async () => {
    if (!items?._id) return; // guard clause

    setLoading(true);
    try {
      const res = await fetchDetailsAPI(items?._id, {
        token,
        clientId,
      });
      console.log(res);
      let newInitialValues = {...initialValues, ...res};
      console.log('newInitialValues', newInitialValues);
      setInitialValues(newInitialValues);
      setLoading(false);
      // TODO: setState(res) if you need to store it
    } catch (err) {
      console.error('fetchDetails failed:', err);
      setLoading(false);
    }
  }, [items?._id, token, clientId, initialValues]);

  useEffect(() => {
    if (items?._id) {
      fetchDetails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      {!loading && (
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
      )}
    </SafeAreaView>
  );
};

export default PostAd;
