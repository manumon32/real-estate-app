/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import TextInput from '@components/Input/textInput';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import CommonDistanceInput from '@components/Input/distanceInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useBoundStore from '@stores/index';
import {useTheme} from '@theme/ThemeProvider';

const CommonLocationModal = React.lazy(
  () => import('@components/Modal/LocationSearchModal'),
);
const Step3LocationDetails = (props: any) => {
  const {
    currentStep,
    setFieldValue,
    values,
    errors,
    isStringInEitherArray,

    touched,
  } = props;

  const setLocation = useBoundStore(s => s.setLocation);
  const setlocationModalVisible = useBoundStore(s => s.setlocationModalVisible);
  const locationForAdpost = useBoundStore(s => s.locationForAdpost);
  const setadPostModal = useBoundStore(s => s.setadPostModal);
  const locationHistory = useBoundStore(s => s.locationHistory);
  const locationModalvisible = useBoundStore(s => s.locationModalvisible);

  const {theme} = useTheme();
  return (
    <SlideInView direction={currentStep === 3 ? 'right' : 'left'}>
      <Text style={[styles.headingText, {color: theme.colors.text}]}>
        Location and Area Details
      </Text>
      <TouchableOpacity
        onPress={() => {
          setadPostModal();
          setTimeout(() => {
            setlocationModalVisible();
          }, 300);
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
              setFieldValue('city', locationForAdpost?.city);
              setFieldValue('country', locationForAdpost?.country);
              setFieldValue('district', locationForAdpost?.district);
              setFieldValue('state', locationForAdpost?.state);
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

      <Text style={[styles.headingText, {color: theme.colors.text}]}>
        Area Details.
      </Text>
      {isStringInEitherArray('area') && (
        <View style={styles.inputContainer}>
          <CommonDistanceInput
            label="Area Size"
            unit="/sq.ft"
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
            unit="/sq.ft"
            value={values.carpetArea ? String(values.carpetArea) : ''}
            onChange={text => setFieldValue('carpetArea', text)}
          />
        </View>
      )}
      {isStringInEitherArray('buildUpArea') && (
        <View style={styles.inputContainer}>
          <CommonDistanceInput
            label="Build-up Area"
            unit="/sq.ft"
            value={values.builtUpArea ? String(values.builtUpArea) : ''}
            onChange={text => setFieldValue('builtUpArea', text)}
          />
        </View>
      )}

      {isStringInEitherArray('superBuildUpArea') && (
        <View style={styles.inputContainer}>
          <CommonDistanceInput
            label="Super Build-up Area"
            unit="/sq.ft"
            value={
              values.superBuiltUpArea ? String(values.superBuiltUpArea) : ''
            }
            onChange={text => setFieldValue('superBuiltUpArea', text)}
          />
        </View>
      )}
      {locationModalvisible && (
        <CommonLocationModal
          onClose={setlocationModalVisible}
          onSelectLocation={setLocation}
          locationHistory={locationHistory}
        />
      )}
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
