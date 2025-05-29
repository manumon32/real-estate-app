// components/FilterButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Fonts } from '@constants/font';
import IconButton from './IconButton';

type FilterButtonProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: boolean;
  iconName?: string;
  iconColor?: string;
  iconStyle?: ViewStyle;
  iconSize?:number;
};

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  selected = false,
  onPress,
  style,
  textStyle,
  icon,
  iconStyle,
  iconColor,
  iconName,
  iconSize,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, selected && styles.buttonSelected, style]}
      activeOpacity={0.7}>
      {icon && (
        <IconButton
          style={iconStyle}
          iconSize={iconSize}
          iconColor={iconColor}
          iconName={iconName}
        />
      )}
      <Text style={[styles.label, selected && styles.labelSelected, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    color: '#171717',
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  buttonSelected: {
    backgroundColor: '#216F63',
  },
  label: {
    color: '#fffff',
    fontFamily: Fonts.REGULAR,
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '500',
  },
  labelSelected: {
    color: '#171717',
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '500',
  },
});

export default FilterButton;
