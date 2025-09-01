import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {Fonts} from '@constants/font';

interface PriceRangeSliderProps {
  value: number[]; // [min, max]
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
  max = 10000000,
  step = 100,
  sliderLength = 300,
  theme,
}) => {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);

  // keep slider and inputs in sync
  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  const handleInputChange = (text: string, type: 'min' | 'max') => {
    const numericValue = parseInt(text.replace(/\D/g, ''), 10) || 0;

    if (type === 'min') {
      setMinValue(numericValue);
      onChange([Math.max(min, numericValue), maxValue]);
    } else {
      setMaxValue(numericValue);
      onChange([minValue, Math.min(max, numericValue)]);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme?.colors?.backgroundHome || '#fff'},
      ]}>
      <Text style={[styles.heading, {color: theme?.colors?.text || '#000'}]}>
        Price Range
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, ]}
          keyboardType="numeric"
          value={minValue.toString()}
          onChangeText={text => handleInputChange(text, 'min')}
          placeholder="Min"
          placeholderTextColor="#aaa"
        />
        <Text style={[styles.toText, {color: theme?.colors?.text}]}>to</Text>
        <TextInput
          style={[styles.input,]}
          keyboardType="numeric"
          value={maxValue.toString()}
          onChangeText={text => handleInputChange(text, 'max')}
          placeholder="Max"
          placeholderTextColor="#aaa"
        />
      </View>

      <Text style={[styles.rangeText, {color: theme?.colors?.text}]}>
        ₹{minValue.toLocaleString()} - ₹{maxValue.toLocaleString()}
      </Text>

      <MultiSlider
        values={[minValue, maxValue]}
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
    padding: 8,
    borderRadius: 12,
  },
  heading: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: Fonts.BOLD,
  },
  rangeText: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: Fonts.REGULAR,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 6,
    fontSize: 14,
    fontFamily: Fonts.REGULAR,
    backgroundColor: '#fff',
  },
  toText: {
    marginHorizontal: 8,
    fontSize: 14,
    fontFamily: Fonts.REGULAR,
  },
  selectedColor: {backgroundColor: '#2f7e6f'},
  unselectedColor: {backgroundColor: '#e0e0e0'},
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
