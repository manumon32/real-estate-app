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
  // @ts-ignore
  const items = route?.params?.items || null;
  const {locationForAdpost, token, clientId, setPostAd, setImages, setFloorPlans} = useBoundStore();
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<{}>({});
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    numberOfBedrooms: '',
    numberOfBathrooms: '',
    propertyTypeId: '',
    listingTypeId: '',
    price: '',
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
    numberOfBalconies: 0,
    numberOfKitchens: 0,
    carParking: 1,
    amenityIds: [],
    imageUrls: [],
    floorPlanUrl: [],
    videoUrl: '',
    // Add other fields
  });

  const fetchDetails = useCallback(async () => {
    if (!items._id) return; // guard clause

    setLoading(true);
    try {
      const res = await fetchDetailsAPI(items?._id, {
        token,
        clientId,
      });
      let newInitialValues = {...initialValues, ...res};
      // @ts-ignore
      const listingTypeFields = newInitialValues.listingTypeId?.fields;
      // @ts-ignore
      const propertyTypeFields = newInitialValues.propertyTypeId?.fields;
      setFields([...listingTypeFields, ...propertyTypeFields]);
      let newpostAd = {
        // @ts-ignore
        listingTypeId: [newInitialValues.listingTypeId?._id],
        // @ts-ignore
        propertyTypeId: [newInitialValues.propertyTypeId?._id],
      };
      let amenityIds = newInitialValues.amenityIds.map((item:any) => item._id);
      console.log(amenityIds);

      let newInitialValuesData = {
        ...newInitialValues,
        // @ts-ignore
        listingTypeId: newInitialValues.listingTypeId?._id,
        // @ts-ignore
        propertyTypeId: newInitialValues.propertyTypeId?._id,
        amenityIds: amenityIds,
      };

      setImages(newInitialValues?.imageUrls || []);
      setFloorPlans(newInitialValues?.floorPlanUrl || []);
      setPostAd(newpostAd);
        // @ts-ignore
      setInitialValues(newInitialValuesData);
      setLoading(false);
      // TODO: setState(res) if you need to store it
    } catch (err) {
      console.error('fetchDetails failed:', err);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (items && items._id) {
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
              fields={fields}
              setFields={setFields}
            />
          )}
        </Formik>
      )}
    </SafeAreaView>
  );
};

export default PostAd;
