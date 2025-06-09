import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IconButton from '@components/Buttons/IconButton';
import {useTheme} from '@theme/ThemeProvider';

function HeaderIconContent(): React.JSX.Element {
  const {theme} = useTheme();

  const tabIcons = [
    {label: 'Buy', icon: 'home'},
    {label: 'Rent', icon: 'key-variant'},
    {label: 'Commertial', icon: 'office-building'},
    {label: 'Land', icon: 'island'},
    {label: 'Lease', icon: 'calendar-month'},
    {label: 'Buy', icon: 'home'},
  ];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {tabIcons.map((items, index) => (
        <TouchableOpacity key={index}>
          <View style={styles.iconContainer}>
            <IconButton iconSize={24} iconName={items.icon} />
          </View>
          <Text style={[styles.textStyle, {color: theme.colors.text}]}>
            {items.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 52,
    height: 52,
    margin: 10,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 12,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    textAlign: 'center',
  },
  box: {
    width: 120,
    height: 120,
    marginRight: 12,
    backgroundColor: '#CAF3EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tabStyle: {alignSelf: 'center'},
});

export default HeaderIconContent;
