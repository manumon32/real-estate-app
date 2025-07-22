/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import TextInput from '@components/Input/textInput';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import CommonDistanceInput from '@components/Input/distanceInput';
import {FieldArray} from 'formik';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useBoundStore from '@stores/index';

const Step3LocationDetails = (props: any) => {
  const {
    currentStep,
    setFieldValue,
    values,
    errors,
    isStringInEitherArray,
    touched,
  } = props;
  const {setlocationModalVisible, locationForAdpost, setadPostModal} =
    useBoundStore();
  //

  return (
    <SlideInView direction={currentStep === 2 ? 'right' : 'left'}>
      <Text style={styles.headingText}>Location and Area Details</Text>
      <TouchableOpacity
        onPress={() => {
          setadPostModal();
          setTimeout(() => {
            setlocationModalVisible();
          }, 200);
        }}
        style={[styles.inputContainer, {flexDirection: 'row'}]}>
        <View style={{width: '85%'}}>
          <TextInput
            editable={false}
            value={locationForAdpost?.name}
            onChangeText={text => {
              setFieldValue('address', text);
              setFieldValue('latitude', locationForAdpost?.lat);
              setFieldValue('longitude', locationForAdpost?.lng);
            }}
            placeholder="Select Location"
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '15%',
          }}>
          <View
            style={{
              justifyContent: 'center',
              borderRadius: 20,
              backgroundColor: '#F5F6FA',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={42}
              color={'#1C1C1E'}
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* <View style={styles.inputContainer}>
        <SelectInput
          options={propertyOptions}
          selectedValue={selectedCategory}
          onSelect={setSelectedCategory}
          placeholder="City"
        />
      </View>

      <View style={styles.inputContainer}>
        <SelectInput
          options={propertyOptions}
          selectedValue={selectedCategory}
          onSelect={setSelectedCategory}
          placeholder="State"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput onChangeText={() => {}} placeholder="Land Mark" />
      </View>

      <View style={styles.inputContainer}>
        <TextInput onChangeText={() => {}} placeholder="Pin code" />
      </View> */}

      <Text style={styles.headingText}>Area Details.</Text>
      {isStringInEitherArray('area') && (
        <View style={styles.inputContainer}>
          <CommonDistanceInput
            label="Area Size"
            unit="/Sq.ft"
            value={String(values.areaSize)}
            error={touched?.areaSize && errors?.areaSize}
            onChange={text => setFieldValue('areaSize', text)}
          />
          {touched?.areaSize && errors?.areaSize && (
            <Text style={styles.error}>{errors?.areaSize}</Text>
          )}
        </View>
      )}
      {isStringInEitherArray('carpetArea') && (
        <View style={styles.inputContainer}>
          <CommonDistanceInput
            label="Carpet Area"
            unit="/Sq.ft"
            value={String(values.carpetArea)}
            onChange={text => setFieldValue('carpetArea', text)}
          />
        </View>
      )}
      {isStringInEitherArray('buildUpArea') && (
        <View style={styles.inputContainer}>
          <CommonDistanceInput
            label="Build-up Area"
            unit="/Sq.ft"
            value={String(values.builtUpArea)}
            onChange={text => setFieldValue('builtUpArea', text)}
          />
        </View>
      )}

      {isStringInEitherArray('superBuildUpArea') && (
        <View style={styles.inputContainer}>
          <CommonDistanceInput
            label="Super Build-up Area"
            unit="/Sq.ft"
            value={String(values.superBuiltUpArea)}
            onChange={text => setFieldValue('superBuiltUpArea', text)}
          />
        </View>
      )}
      <FieldArray name="nearbyLandmarks">
        {({push, remove}) => (
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.headingText}>Location Benefits</Text>

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
    </SlideInView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginVertical: 8,
    padding: 4,
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

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {fontSize: 18, fontWeight: '600', marginBottom: 10},
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
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

export default React.memo(Step3LocationDetails);
