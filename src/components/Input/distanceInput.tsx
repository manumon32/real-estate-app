import {Fonts} from '@constants/font';
import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

interface CommonDistanceInputProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  onChangeText?: (val: string) => void;
  onChangeUnit?: (val: string) => void;
  placeholder?: string;
  unit?: string;
  editable?: boolean;
  name?: string;
  placeholderUnit?: string;
  placeholderValue?: string;
  error?: boolean;
}

const CommonDistanceInput: React.FC<CommonDistanceInputProps> = ({
  editable = false,
  label,
  value,
  name,
  error,
  onChange,
  placeholder = '',
  placeholderUnit,
  placeholderValue,
  unit = 'Km',
  onChangeUnit,
  onChangeText,
}) => {
  return (
    <View
      style={[
        styles.container,
        error && {
          borderWidth: 1,
          borderColor: 'red',
        },
      ]}>
      {!editable && (
        <>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.inputBox}>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              placeholderTextColor="#ccc"
              style={styles.input}
              keyboardType='decimal-pad'
            />
            <Text style={styles.unit}>{unit}</Text>
          </View>
        </>
      )}
      {editable && (
        <>
          <View style={styles.inputBoxText}>
            <TextInput
              value={name}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#ccc"
              style={styles.inputText}
            />
          </View>
          <View style={[styles.inputBoxText, {width: '20%'}]}>
            <TextInput
              value={value}
              onChangeText={onChange}
              keyboardType="decimal-pad"
              placeholder={placeholderValue}
              placeholderTextColor="#ccc"
              style={styles.inputText}
            />
          </View>
          <View style={[styles.inputBoxText, {width: '20%'}]}>
            <TextInput
              value={unit}
              onChangeText={onChangeUnit}
              placeholder={placeholderUnit}
              placeholderTextColor="#ccc"
              style={styles.inputText}
            />
          </View>
        </>
      )}
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
  inputBoxText: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    width: '50%',
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
  inputText: {
    fontSize: 16,
    color: '#171717',
    minWidth: 30,
    padding: 0,
    marginRight: 4,
    width: '100%',
  },
  unit: {
    fontSize: 14,
    color: '#696969',
    fontFamily: Fonts.REGULAR,
  },
});

export default CommonDistanceInput;
