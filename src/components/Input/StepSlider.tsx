import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Fonts } from '@constants/font';

interface PriceRangeSliderProps {
  value: number[]; // Initial or controlled value
  onChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  theme?: any;
  sliderLength?: number;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 1000000000,
  step = 1000,
  sliderLength = 300,
  theme
}) => {
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.backgroundHome}]}>
      <Text style={[styles.heading, {color: theme.colors.text} ]}>Price Range</Text>
      <Text style={[styles.rangeText, {color: theme.colors.text}]}>
        ₹{value[0].toLocaleString()} - ₹{value[1].toLocaleString()}
      </Text>

      <MultiSlider
        values={value}
        min={min}
        max={max}
        step={step}
        onValuesChange={onChange}
        sliderLength={sliderLength}
        selectedStyle={styles.selectedColor}
        unselectedStyle={styles.unselectedColor}
        markerStyle={styles.markerStyle}
        trackStyle={{height: 6}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    // alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedColor: {backgroundColor: '#2f7e6f'},
  unselectedColor: {backgroundColor: '#e0e0e0'},
  heading: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: Fonts.BOLD
  },
  containerStyle: {marginTop: 20},
  rangeText: {
    fontSize: 16,
    color: '#444',
    fontFamily:Fonts.REGULAR
  },
  markerStyle: {
    height: 20,
    width: 20,
    backgroundColor: '#2f7e6f',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default PriceRangeSlider;
