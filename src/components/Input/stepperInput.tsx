import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface CommonStepperInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

const CommonStepperInput: React.FC<CommonStepperInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
}) => {
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={decrement}
          disabled={value <= min}
          style={[styles.button,styles.disabled]}>
          <MaterialCommunityIcons name="minus" size={18} color={value <= min ? '#999' : '#000'} />
        </TouchableOpacity>

        <Text style={styles.value}>{value}</Text>

        <TouchableOpacity
          onPress={increment}
          disabled={value >= max}
          style={styles.button}>
          <MaterialCommunityIcons name="plus" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  button: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#2F8D79', // green (like image)
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: '#D9D9D9',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    minWidth: 28,
    textAlign: 'center',
  },
});

export default CommonStepperInput;
