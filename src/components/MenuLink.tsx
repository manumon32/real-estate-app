import {Fonts} from '@constants/font';
import {useTheme} from '@theme/ThemeProvider';
import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Switch} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface MenuLinkProps {
  /** Material‑Community‑Icons name, e.g. "heart-outline" */
  icon?: string;
  /** Main label */
  label: string;
  /** Optional number or text shown on the right */
  value?: string | number;
  /** Tap handler */
  onPress?: () => void;
  /** Hide arrow at the far right (defaults to true = show) */
  showChevron?: boolean;
  /** Override row / label / value styles if needed */
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  showToggle?: boolean;
  toggleDisabled?: boolean;
  selected?: boolean;
  onToggle?: any;
}

const MenuLink: React.FC<MenuLinkProps> = ({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  containerStyle,
  labelStyle,
  valueStyle,
  selected,
  toggleDisabled = false,
  showToggle,
  onToggle,
}) => {
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.row, containerStyle]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color="#9E9E9E"
          style={styles.icon}
        />
      )}

      <Text
        numberOfLines={1}
        style={[[styles.label, {color: theme.colors.text}], labelStyle]}>
        {label}
      </Text>

      {value !== undefined && (
        <Text style={[styles.value, {color: theme.colors.text}, valueStyle]}>
          {value}
        </Text>
      )}

      {showChevron && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={34}
          color="#9E9E9E"
          style={styles.chevron}
        />
      )}
      {showToggle && (
        <Switch
          color="#2F8D79"
          value={selected}
          disabled={toggleDisabled}
          onValueChange={onToggle}
        />
      )}
    </TouchableOpacity>
  );
};

export default React.memo(MenuLink);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#171717',
    fontFamily: Fonts.REGULAR,
  },
  value: {
    fontSize: 14,
    color: '#171717',
    fontFamily: Fonts.REGULAR,
  },
  chevron: {},
});
