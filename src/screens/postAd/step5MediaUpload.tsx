import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Fonts} from '@constants/font';
import SlideInView from './animatedView';
import TextInput from '@components/Input/textInput';
import CommonImageUploader from '@components/Input/ImageUploader';

const Step5MediaUpload = ({currentStep}: any) => {
  return (
    <SlideInView direction={currentStep === 4 ? 'right' : 'left'}>
      <Text style={styles.headingText}>Property Features</Text>
      <View style={styles.inputContainer}>
        <CommonImageUploader
          onUpload={uri => console.log('Uploaded image:', uri)}
          label="Upload Property Images"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput onChangeText={() => {}} placeholder="Video URL (YouTube)" />
      </View>

      <View style={styles.inputContainer}>
        <TextInput onChangeText={() => {}} placeholder="Upload Floor Plan" />
      </View>

      <View style={styles.inputContainer}>
        <CommonImageUploader
          onUpload={uri => console.log('Uploaded image:', uri)}
          label="Upload Floor Plan"
        />
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
});

export default React.memo(Step5MediaUpload);
