/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TextInput from '@components/Input/textInput';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import useBoundStore from '@stores/index';
import {useTheme} from '@theme/ThemeProvider';
// import {RenderChips, useChipScrollRefs} from '@components/RenderChips';

const Step1BasicInfo = (props: any) => {
  const {
    currentStep,
    isStringInEitherArray,
    renderChips,
    setFieldValue,
    values,
    handleBlur,
    touched,
    errors,
  } = props;
  // const {refs: chipScrollRefs, scrollToChipIndex} = useChipScrollRefs();

  const {appConfigs} = useBoundStore();
  const {theme} = useTheme();

  const PROPERTY_TYPES = appConfigs?.propertyTypes || [];
  const LISTING_TYPES = appConfigs?.listingTypes || [];
  const FURNISHING_STATS = appConfigs?.furnishingStatuses || [];
  const OWNERSHIP_TYPE = appConfigs?.ownershipTypes || [];
  const FACING_DIRECTION = appConfigs?.facingDirections || [];
  const LISTED_BY = appConfigs?.listedBy || [];
  const AVAILABILITY_STATS = appConfigs?.availabilityStatuses || [];
  const BEDROOMS = [
    {name: '1 BHK', _id: '1', filterName: 'numberOfBedrooms'},
    {name: '2 BHK', _id: '2', filterName: 'numberOfBedrooms'},
    {name: '3 BHK', _id: '3', filterName: 'numberOfBedrooms'},
    {name: '4 BHK', _id: '4', filterName: 'numberOfBedrooms'},
    {name: '4+ BHK', _id: '5', filterName: 'numberOfBedrooms'},
    // {name: '4+ BHK', _id: '6', filterName: 'numberOfBedrooms'},
    // {name: '4+ BHK', _id: '7', filterName: 'numberOfBedrooms'},
    // {name: '4+ BHK', _id: '8', filterName: 'numberOfBedrooms'},
  ];
  const BATHROOMS = [
    {name: '1', _id: '1', filterName: 'numberOfBathrooms'},
    {name: '2', _id: '2', filterName: 'numberOfBathrooms'},
    {name: '3', _id: '3', filterName: 'numberOfBathrooms'},
    {name: '4', _id: '4', filterName: 'numberOfBathrooms'},
    {name: '4+', _id: '5', filterName: 'numberOfBathrooms'},
  ];

  // const scrollRefs = useRef<ScrollView[]>([]);
  // const ITEM_WIDTH = 80;
  // const scrollToIndex = (sectionIndex: number, itemIndex: number) => {
  //   scrollRefs.current[sectionIndex]?.scrollTo({
  //     x: itemIndex * ITEM_WIDTH,
  //     animated: true,
  //   });
  // };

  useEffect(() => {
    // scrollToIndex();
  }, []);

  return (
    <SlideInView
      direction={currentStep == null ? 'right' : 'left'}
      keyboardShouldPersistTaps={'handled'}>
      <>
        {/* <Text style={styles.headingText}>Basic Details</Text> */}
        <View style={styles.inputContainer}>
          <Text
            style={[
              styles.label,
              {color: theme.colors.text},
              touched?.propertyTypeId &&
                errors?.propertyTypeId && {color: 'red'},
            ]}>
            Type*
          </Text>
          {renderChips(PROPERTY_TYPES)}
          {touched?.propertyTypeId && errors?.propertyTypeId && (
            <Text style={styles.error}>{errors?.propertyTypeId}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text
            style={[
              styles.label,
              {color: theme.colors.text},
              touched?.listingTypeId && errors?.listingTypeId && {color: 'red'},
            ]}>
            Subtype*
          </Text>

          {renderChips(LISTING_TYPES)}
          {touched?.listingTypeId && errors?.listingTypeId && (
            <Text style={styles.error}>{errors?.listingTypeId}</Text>
          )}
        </View>
        {OWNERSHIP_TYPE.length > 0 && (
          <View style={styles.inputContainer}>
            {/* {isStringInEitherArray('ownershipTypeId') && ( */}
            <>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                Ownership Type
              </Text>
              {renderChips(OWNERSHIP_TYPE)}
            </>
            {/* )} */}
          </View>
        )}
        {isStringInEitherArray('furnishedStatus') &&
          FURNISHING_STATS.length > 0 && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                Furnishing Status
              </Text>
              {renderChips(FURNISHING_STATS)}
            </View>
          )}

        {AVAILABILITY_STATS.length > 0 && (
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: theme.colors.text}]}>
              Availability Status
            </Text>

            {renderChips(AVAILABILITY_STATS)}
          </View>
        )}

        {isStringInEitherArray('bedroom') && (
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: theme.colors.text}]}>
              Bedrooms
            </Text>
            {renderChips(BEDROOMS)}
            {/* <RenderChips
          data={BEDROOMS}
          selectedIds={[]}
          onSelect={item => console.log('Selected:', item)}
          // @ts-ignore
          scrollRef={{current: chipScrollRefs.current.bedrooms}}
          scrollKey="bedrooms"
        /> */}
          </View>
        )}
        {isStringInEitherArray('bathrooom') && (
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: theme.colors.text}]}>
              Bathrooms
            </Text>
            {renderChips(BATHROOMS)}
          </View>
        )}

        {FACING_DIRECTION.length > 0 && (
          <View style={styles.inputContainer}>
            {/* {isStringInEitherArray('ownershipTypeId') && ( */}
            <>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                Facing
              </Text>
              {renderChips(FACING_DIRECTION)}
            </>
            {/* )} */}
          </View>
        )}
        {LISTED_BY.length > 0 && (
          <View style={styles.inputContainer}>
            {/* {isStringInEitherArray('ownershipTypeId') && ( */}
            <>
              <Text style={[styles.label, {color: theme.colors.text}]}>
                Listed By
              </Text>
              {renderChips(LISTED_BY)}
            </>
            {/* )} */}
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text
            style={[
              styles.label,
              {
                color:
                  touched?.title && errors?.title ? 'red' : theme.colors.text,
              },
            ]}>
            Title*
          </Text>
          {/* <TextInput onChangeText={() => {}} placeholder="Property Title" /> */}
          <TextInput
            placeholder="Property Title"
            value={values?.title}
            onChangeText={text => setFieldValue('title', text)}
            onBlur={handleBlur('title')}
            error={touched?.title && errors?.title ? true : false}
          />
          {touched?.title && errors?.title && (
            <Text style={styles.error}>{errors?.title}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text
            style={[
              styles.label,
              {
                color:
                  touched?.description && errors?.description ? 'red' : theme.colors.text,
              },
            ]}>
            Additional information*
          </Text>
          <TextInput
            onChangeText={text => setFieldValue('description', text)}
            value={values?.description}
            placeholder="Property Description"
            placeholderTextColor={'#ccc'}
            onBlur={handleBlur('description')}
            multiline
            style={{minHeight: 100, justifyContent: 'center'}}
            error={touched?.description && errors?.description ? true : false}
          />
          {touched?.description && errors?.description && (
            <Text style={styles.error}>{errors?.description}</Text>
          )}
        </View>
      </>
    </SlideInView>
  );
};

const styles = StyleSheet.create({
  container: {},
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
  chipContainer: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 5,
    // marginBottom: 5,
  },
  chipSelected: {
    backgroundColor: '#2A9D8F',
    borderColor: '#2A9D8F',
  },
  chipText: {
    color: '#333',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 2,
    marginTop: 3,
    left: 5,
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
  },
});

export default React.memo(Step1BasicInfo);
