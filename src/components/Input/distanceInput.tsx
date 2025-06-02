import {Fonts} from '@constants/font';
import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

interface CommonDistanceInputProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  unit?: string;
}

const CommonDistanceInput: React.FC<CommonDistanceInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '0',
  unit = 'Km',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputBox}>
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor="#171717"
          style={styles.input}
        />
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#171717',
    fontFamily: Fonts.REGULAR,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 70,
    justifyContent: 'space-between',
  },
  input: {
    fontSize: 16,
    color: '#171717',
    minWidth: 30,
    maxWidth: 120,
    padding: 0,
    marginRight: 4,
  },
  unit: {
    fontSize: 14,
    color: '#696969',
    fontFamily: Fonts.REGULAR,
  },
});

export default CommonDistanceInput;
