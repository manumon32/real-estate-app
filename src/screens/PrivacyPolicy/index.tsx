/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeaderProfile';
import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  //   FlatList,
  //   Text,
  //   RefreshControl,
} from 'react-native';
import {Fonts} from '@constants/font';

const PrivacyPolicy = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="Privacy Policy" textColor="#171717" />
      <ScrollView
      showsVerticalScrollIndicator={false}
        style={{padding: 15}}
        contentContainerStyle={{
          borderWidth: 1,
          borderRadius: 20,
          borderColor: '#EBEBEB',
          backgroundColor: '#F5F6FA',
          padding: 10,
          paddingBottom:120,
        }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: Fonts.MEDIUM,
            letterSpacing: 0.1,
            lineHeight: 32,
          }}>
          Your privacy is important to us. It is Brainstorming's policy to
          respect your privacy regarding any information we may collect from you
          across our website, and other sites we own and operate.
        </Text>
        <Text
          style={{
            top:20,
            fontSize: 14,
            fontFamily: Fonts.MEDIUM,
            letterSpacing: 0.1,
            lineHeight: 32,
          }}>
          We only ask for personal information when we truly need it to provide
          a service to you. We collect it by fair and lawful means, with your
          knowledge and consent. We also let you know why we’re collecting it
          and how it will be used.
        </Text>
        <Text
          style={{
            top:40,
            fontSize: 14,
            fontFamily: Fonts.MEDIUM,
            letterSpacing: 0.1,
            lineHeight: 32,
          }}>
          We only retain collected information for as long as necessary to
          provide you with your requested service. What data we store, we’ll
          protect within commercially acceptable means to prevent loss and
          theft, as well as unauthorized access, disclosure, copying, use or
          modification. We don’t share any personally identifying information
          publicly or with third-parties, except when required to by law.
        </Text>
        <Text
          style={{
            top:40,
            fontSize: 14,
            fontFamily: Fonts.MEDIUM,
            letterSpacing: 0.1,
            lineHeight: 32,
          }}>
          We only retain collected information for as long as necessary to
          provide you with your requested service. What data we store, we’ll
          protect within commercially acceptable means to prevent loss and
          theft, as well as unauthorized access, disclosure, copying, use or
          modification. We don’t share any personally identifying information
          publicly or with third-parties, except when required to by law.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    flex: 1,
  },
  badge: {
    backgroundColor: '#e0f5ec',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    color: '#15937c',
    fontWeight: '600',
  },
  location: {
    fontSize: 13,
    color: '#888',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e1e1e',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  outlinedButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },

  endText: {
    textAlign: 'center',
    color: '#888',
    padding: 12,
    fontStyle: 'italic',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: Fonts.MEDIUM,
  },
  loadingText: {
    marginTop: 8,
    color: '#555',
    fontSize: 14,
  },
});

export default React.memo(PrivacyPolicy);
