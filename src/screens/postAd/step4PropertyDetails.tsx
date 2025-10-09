import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import CommonStepperInput from '@components/Input/stepperInput';
import useBoundStore from '@stores/index';
import {CommonMultiSelect} from '@components/Input/CommonMultiSelect';
import {useTheme} from '@theme/ThemeProvider';
import CommonAmenityToggle from '@components/Input/amenityToggle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonDistanceInput from '@components/Input/distanceInput';
import {FieldArray} from 'formik';

const Step4PropertyDetails = (props: any) => {
  const {errors} = props;
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
    <SlideInView
      style={{minHeight: 400}}
      direction={currentStep === 4 ? 'right' : 'left'}>
      {isStringInEitherArray('"propertyFeatures"') && (
        <Text style={[styles.headingText, {color: theme.colors.text}]}>
          Property Features
        </Text>
      )}

      {isStringInEitherArray('propertyFeatures') && (
        <View style={styles.inputContainer}>
          <CommonStepperInput
            label="Kitchen"
            value={values.numberOfKitchens}
            onChange={value => {
              setFieldValue('numberOfKitchens', value);
            }}
          />
        </View>
      )}
      {isStringInEitherArray('propertyFeatures') && (
        <View style={styles.inputContainer}>
          <CommonStepperInput
            label="Balconies"
            value={values.numberOfBalconies}
            onChange={value => {
              setFieldValue('numberOfBalconies', value);
            }}
          />
        </View>
      )}
      {isStringInEitherArray('propertyFeatures') && (
        <View style={styles.inputContainer}>
          <CommonStepperInput
            label="Car Parking"
            value={values.carParking}
            onChange={value => {
              setFieldValue('carParking', value);
            }}
          />
        </View>
      )}

      {isStringInEitherArray('bachelorsAllowed') && (
        <View style={styles.inputContainer}>
          <CommonAmenityToggle
            label="Bachelor's Allowed"
            selected={values.bachelorsAllowed}
            onToggle={() =>
              setFieldValue('bachelorsAllowed', !values.bachelorsAllowed)
            }
          />
        </View>
      )}

      <FieldArray name="nearbyLandmarks">
        {({push, remove}) => (
          <View>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={[styles.headingText, {color: theme.colors.text}]}>
                Location Benefits
              </Text>

              <TouchableOpacity
                onPress={() =>
                  push({
                    name: '',
                    unit: 'Km',
                    value: '0',
                  })
                }
                style={styles.button}>
                <MaterialCommunityIcons name="plus" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            {values.nearbyLandmarks.map((item: any, index: any) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={[styles.inputContainer, {width: '95%'}]}>
                  <CommonDistanceInput
                    label={item?.name}
                    editable
                    unit={item.unit}
                    value={item.value}
                    name={item.name}
                    placeholderUnit="km"
                    placeholderValue="5"
                    placeholder="Railway Station"
                    onChangeText={value => {
                      setFieldValue(`nearbyLandmarks[${index}].name`, value);
                    }}
                    onChange={value =>
                      setFieldValue(`nearbyLandmarks[${index}].value`, value)
                    }
                    onChangeUnit={value =>
                      setFieldValue(`nearbyLandmarks[${index}].unit`, value)
                    }
                  />
                  {(errors?.nearbyLandmarks?.[index]?.name ||
                    errors?.nearbyLandmarks?.[index]?.value ||
                    errors?.nearbyLandmarks?.[index]?.unit) && (
                    <Text style={styles.error}>
                      {'Please fill all fields '}
                    </Text>
                  )}
                </View>
                {index !== 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      if (values.nearbyLandmarks.length > 1) {
                        try {
                          remove(index);
                        } catch (errors) {}
                      }
                    }}
                    style={styles.buttonClose}>
                    <MaterialCommunityIcons
                      name="close"
                      size={18}
                      color="#fff"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </FieldArray>
      {/* {isStringInEitherArray('amenities') && ( */}
      {isStringInEitherArray('amenity') && (
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
      )}
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
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 999,
    borderRadius: 20,
  },
  popupContainer: {
    width: '90%',
    backgroundColor: '#000',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'teal',
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  popupAmount: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  popupBenefits: {
    fontSize: 13,
    color: '#555',
    marginBottom: 5,
  },
  popupActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#333',
  },
  continueButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2A9D8F',
    borderRadius: 8,
  },
  continueButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },

  scrollBarTrack: {
    position: 'absolute',
    right: 50,
    top: 0,
    bottom: 0,
    display: 'none',
    width: 8, // 🔹 track width
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    height: 50,
  },
  scrollBarThumb: {
    width: 8, // 🔹 indicator width
    backgroundColor: '#40DABE',
    borderRadius: 4,
  },

  previewRow: {gap: 12},
  preview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  error: {
    color: 'red',
    marginBottom: 2,
    marginTop: 3,
    left: 10,
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
  },

  button: {
    padding: 2,
    borderRadius: 6,
    backgroundColor: '#2F8D79', // green (like image)
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonClose: {
    padding: 2,
    borderRadius: 6,
    backgroundColor: 'red', // green (like image)
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(Step4PropertyDetails);
