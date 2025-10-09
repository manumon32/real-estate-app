/* eslint-disable react-native/no-inline-styles */
// import CommonHeader from '@components/Header/CommonHeader';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PostAdContainer from './stepper';
import {Formik} from 'formik';
import {postAdValidationSchema} from './validationSchema';
import useBoundStore from '@stores/index';
import {useRoute} from '@react-navigation/native';
import {fetchDetailsAPI} from '@api/services';
import {useTheme} from '@theme/ThemeProvider';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const PostAd = () => {
  const route = useRoute();
  // @ts-ignore
  const items = route?.params?.items || null;
  const {
    locationForAdpost,
    location,
    token,
    clientId,
    setPostAd,
    setImages,
    setFloorPlans,
    fetchPlans,
    setLocation,
    setadPostModal,
    setLocatioForAdPost,
  } = useBoundStore();
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<{}>({});
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    numberOfBedrooms: '',
    numberOfBathrooms: '',
    ownershipTypeId: null,
    propertyTypeId: '',
    listingTypeId: '',
    price: '',
    isNegotiable: true,
    featured: false,
    maintenanceCharge: 0,
    propertyTax: 0,
    loanEligible: false,
    showLoanOffers:false,
    showEmiCalculator:false,
    reraApproved: false,
    bachelorsAllowed: false,
    reraId: '',
    city: null,
    country: null,
    district: null,
    state: null,
    areaSize: '',
    carpetArea: '',
    builtUpArea: '',
    superBuiltUpArea: '',
    listedById: null,
    nearbyLandmarks: [
      {
        name: 'School',
        value: '5',
        unit: 'Km',
      },
    ],
    address: locationForAdpost?.name,
    latitude: null,
    longitude: null,
    numberOfBalconies: 0,
    numberOfKitchens: 0,
    facingDirectionId: null,
    carParking: 1,
    amenityIds: [],
    imageUrls: [],
    floorPlanUrl: [],
    videoUrl: '',
    // Add other fields
  });

  const fetchDetails = useCallback(async () => {
    if (!items._id) return; // guard clause
    await setadPostModal();
    setLoading(true);
    try {
      const res: any = await fetchDetailsAPI(items?._id, {
        token,
        clientId,
      });
      let newInitialValues = {
        ...initialValues,
        ...res,
      };
      console.log('newInitialValues', newInitialValues);
      const {coordinates} = newInitialValues.location;
      setLocation({
        name: newInitialValues.address,
        lat: coordinates[1],
        lng: coordinates[0],
      });
      // @ts-ignore
      const listingTypeFields = newInitialValues.listingTypeId?.fields;
      // @ts-ignore
      const propertyTypeFields = newInitialValues.propertyTypeId?.fields;
      setFields({
        listingTypeId: listingTypeFields,
        propertyTypeId: propertyTypeFields,
      });
      let newpostAd = {
        // @ts-ignore
        listingTypeId: [newInitialValues.listingTypeId?._id],
        // @ts-ignore
        propertyTypeId: [newInitialValues.propertyTypeId?._id],
        availabilityStatusId: [newInitialValues.availabilityStatusId?._id],
        furnishingStatusId: [newInitialValues.furnishingStatusId?._id],
        ownershipTypeId: [newInitialValues.ownershipTypeId?._id],
        facingDirectionId: [newInitialValues.facingDirectionId?._id],
        numberOfBedrooms: [String(newInitialValues.numberOfBedrooms)],
        numberOfBathrooms: [String(newInitialValues.numberOfBedrooms)],
        listedById: [newInitialValues.listedById?._id],
        state: newInitialValues.state,
        country: newInitialValues.country,
        district: newInitialValues.district,
        city: newInitialValues.city,
      };
      let amenityIds = newInitialValues.amenityIds.map((item: any) => item._id);

      let newInitialValuesData = {
        ...newInitialValues,
        // @ts-ignore
        listingTypeId: newInitialValues.listingTypeId?._id,
        // @ts-ignore
        listedById: newInitialValues.listedById?._id,
        // @ts-ignore
        propertyTypeId: newInitialValues.propertyTypeId?._id,
        amenityIds: amenityIds,
        availabilityStatusId: newInitialValues.availabilityStatusId?._id,
      };
      console.log('newInitialValues', newInitialValuesData);

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
    console.log('location', location);
    if (items && items._id) {
      fetchDetails();
    } else {
      setInitialValues({
        ...initialValues,
        city: location?.city,
        country: location?.country,
        district: location?.district,
        state: location?.state,
      });
      setLocatioForAdPost(location);
    }
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {theme} = useTheme();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
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
            validateForm,
            resetForm,
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
              validateForm={validateForm}
              resetForm={resetForm}
            />
          )}
        </Formik>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // fills the screen
    backgroundColor: 'rgba(0, 0, 0, 0.78)', // transparent dark overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // ensure it's on top
  },
});
export default PostAd;
