import {Fonts} from '@constants/font';
import {useTheme} from '@theme/ThemeProvider';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// @ts-ignore
import NotificationIcon from '@assets/svg/new/no_notifications.svg';
// @ts-ignore
import NoChatIcon from '@assets/svg/new/no_chat.svg';

const NoChats = (props: any) => {
  const {onExplore, title, body, buttonText, iconName} = props;
  const {theme} = useTheme();

  const renderIcons = (routeName: string) => {
    switch (routeName) {
      case 'Notifications':
        return <NotificationIcon />;
      case 'Chat':
        return <NoChatIcon />;
      case 'Appointment':
        return (
          <Image
            source={require('../assets/images/noappoinments.png')}
            style={{width: 200, height: 200}}
          />
        );
      case 'MyAds':
        return (
          <Image
            source={require('../assets/images/nomyads.png')}
            style={{width: 200, height: 200}}
          />
        );
      case 'Fav':
        return (
          <Image
            source={require('../assets/images/nofav.png')}
            style={{width: 200, height: 200}}
          />
        );
      case 'ReportAd':
        return (
          <Image
            source={require('../assets/images/noreportads.png')}
            style={{width: 200, height: 200}}
          />
        );
      default:
        return <NotificationIcon />;
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* <MaterialCommunityIcons
        name={icon}
        size={64}
        color={color ? color : '#B0B0B0'}
        style={styles.icon}
      /> */}
      <View style={{margin: 10, marginBottom: 20}}>
        {renderIcons(iconName)}
      </View>
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
          <MaterialCommunityIcons
            name={'arrow-right'}
            size={18}
            color={'#fff'}
            style={{
              margin: 2,
              marginLeft: 5,
            }}
          />
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
    width: '100%',
    height: 500,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    fontFamily: Fonts.BOLD,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    fontFamily: Fonts.REGULAR,
  },
  button: {
    backgroundColor:  '#269669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: Fonts.BOLD,
    textAlign: 'center',
  },
});

export default NoChats;
