import IconButton from '@components/Buttons/IconButton';
import {Fonts} from '@constants/font';
import React from 'react';
import {TextInput, View, StyleSheet, TextInputProps} from 'react-native';

interface TextInputprops extends TextInputProps {
  value?: string;
  onChangeText: (text: string) => void;
  iconName?: string;
  iconColor?: string;
  placeholder?: string;
  style?: any;
}

const CommonTextInput: React.FC<TextInputprops> = ({
  value,
  onChangeText,
  placeholder = '',
  iconName,
  iconColor,
  style,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {iconName && (
        <IconButton
          iconName={iconName}
          iconSize={18}
          iconColor={iconColor}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        {...rest}
        style={[styles.input, style]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F6FA', // soft background
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingLeft: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    // marginRight: 1,
  },
  input: {
    fontSize: 16,
    color: '#171717',
    fontWeight: 400,
    paddingLeft: 10,
    height: 50,
    width:'100%',
    justifyContent: 'flex-start',
    fontFamily: Fonts.REGULAR,
  },
});

export default CommonTextInput;
