// components/SearchBar.tsx
import React from 'react';
import {View, StyleSheet, TextInputProps, Text} from 'react-native';
import IconButton from '@components/Buttons/IconButton';

type SearchBarProps = TextInputProps;

const SearchBar: React.FC<SearchBarProps> = props => {
  return (
    <View style={styles.container}>
      <IconButton
        iconName="magnify"
        iconSize={20}
        iconColor="#888"
        style={styles.icon}
      />
      <View
        placeholder="Search"
        placeholderTextColor="#888"
        {...props}>
        <Text style={styles.input}>Search</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 5,
    zIndex: 0,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    fontSize: 14,
    color:'#696969'
  },
});

export default React.memo(SearchBar);;