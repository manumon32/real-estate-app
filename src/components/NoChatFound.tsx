import {Fonts} from '@constants/font';
import {useTheme} from '@theme/ThemeProvider';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NoChats = (props: any) => {
  const {onExplore, title, body, icon, buttonText} = props;
  const {theme} = useTheme();
  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <MaterialCommunityIcons
        name={icon}
        size={64}
        color="#B0B0B0"
        style={styles.icon}
      />
      {title && (
        <Text style={[styles.title, {color: theme.colors.text}]}>{title}</Text>
      )}
      {body && (
        <Text style={[styles.subtitle, {color: theme.colors.text}]}>
          {body}
        </Text>
      )}
      {buttonText && (
        <TouchableOpacity style={styles.button} onPress={onExplore}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
    width:'100%'
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    fontFamily: Fonts.BOLD,
    textAlign:'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    fontFamily: Fonts.REGULAR,
  },
  button: {
    backgroundColor: '#00C897',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: Fonts.BOLD,
    textAlign:'center',
  },
});

export default NoChats;
