/* eslint-disable react-native/no-inline-styles */
import {useTheme} from '@theme/ThemeProvider';
import React from 'react';
import {View, Text, TouchableOpacity, Linking, Alert} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ContactUsCard = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const handlePress = (type: string) => {
    switch (type) {
      case 'whatsapp':
        Linking.openURL('https://wa.me/918593987471').catch(() =>
          Alert.alert('Error', 'WhatsApp is not installed'),
        );
        break;
      case 'call':
        Linking.openURL('tel:+918593987471');
        break;
      case 'email':
        const email = 'contact@hotplotz.com';
        const subject = 'HotPlotz Support';
        const body = 'Hello HotPlotz team, I need help with...';
        const mailUrl = `mailto:${email}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`;

        Linking.canOpenURL(mailUrl)
          .then(supported => {
            if (!supported) {
              Alert.alert('Error', 'No email app available');
            } else {
              Linking.openURL(mailUrl);
            }
          })
          .catch(err => {
            console.log(err);
            Alert.alert('Error', 'Something went wrong');
          });
        break;
      case 'chat':
        // @ts-ignore
        navigation.navigate('ChatSupport'); // 👈 Your chat detail screen name
        break;
      default:
        break;
    }
  };

  const contacts = [
    {
      id: 1,
      title: 'WhatsApp',
      icon: 'whatsapp',
      color: '#075E54',
      type: 'whatsapp',
    },
    {id: 2, title: 'Call Us', icon: 'phone', color: '#0D6EFD', type: 'call'},
    {
      id: 3,
      title: 'Email Support',
      icon: 'email',
      color: '#E63946',
      type: 'email',
    },
    {
      id: 4,
      title: 'Chat Support',
      icon: 'chat',
      color: '#2A9D8F',
      type: 'chat',
    },
  ];

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        justifyContent: 'center',
        alignContent: 'center',
        // width:'100%'
      }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          marginBottom: 12,
          color: theme.colors.text,
        }}>
        Contact Us
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {contacts.map(item => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            accessibilityLabel={`Contact via ${item.title}`}
            style={{
              flexBasis: '45%',
              backgroundColor: `${item.color}20`, // lighter tint of icon color
              borderRadius: 14,
              paddingVertical: 20,
              marginBottom: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => handlePress(item.type)}>
            <MaterialCommunityIcons
              name={item.icon}
              size={30}
              color={item.color}
            />
            <Text
              style={{
                marginTop: 6,
                fontSize: 12,
                fontWeight: '600',
                color: theme.colors.text,
                textAlign:'center'
              }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ContactUsCard;
