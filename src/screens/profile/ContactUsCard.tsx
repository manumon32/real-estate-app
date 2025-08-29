/* eslint-disable react-native/no-inline-styles */
import { useTheme } from '@theme/ThemeProvider';
import React from 'react';
import {View, Text, TouchableOpacity, Linking, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ContactUsCard = () => {
  const {theme} = useTheme();
  const handlePress = (type: string) => {
    switch (type) {
      case 'whatsapp':
        Linking.openURL('https://wa.me/911234567890').catch(() =>
          Alert.alert('Error', 'WhatsApp is not installed'),
        );
        break;
      case 'call':
        Linking.openURL('tel:+8593987471');
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
          .catch((err) =>{ console.log(err); Alert.alert('Error', 'Something went wrong')});
        break;
      case 'chat':
        // navigation.navigate('ChatDetail'); // 👈 Your chat detail screen name
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
      }}>
      <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 12, color: theme.colors.text}}>
        Contact Us
      </Text>

      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 12}}>
        {contacts.map(item => (
          <TouchableOpacity
            key={item.id}
            style={{
              flexBasis: '48%',
              backgroundColor: '#d8faf2ff',
              borderRadius: 12,
              paddingVertical: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => handlePress(item.type)}>
            <MaterialCommunityIcons
              name={item.icon}
              size={28}
              color={item.color}
            />
            <Text
              style={{
                marginTop: 6,
                fontSize: 14,
                fontWeight: '500',
                color: '#333',
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
