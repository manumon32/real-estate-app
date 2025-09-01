import React from 'react';
import ChatSupport from './ChatSupport';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@theme/ThemeProvider';
import CommonHeader from '@components/Header/CommonHeader';

const Index = () => {
  const {theme} = useTheme();
  return (
    <SafeAreaView style={{backgroundColor: theme.colors.background}}>
      <CommonHeader
        title="Hotplotz Support"
        textColor={theme.colors.text}
        backgroundColor={theme.colors.background}
      />
      <ChatSupport
        data={[
          {
            _id: '68b2fec8d873031de86d127e',
            id: 'root',
            question: 'Hi 👋 Welcome to HotPlotz! What would you like to do?',
            options: [
              {label: 'Search Properties', nextId: 'search'},
              {label: 'Book a Visit', nextId: 'visit'},
              {label: 'FAQs', nextId: 'faqs'},
            ],
          },
          {
            _id: '68b2fec8d873031de86d127f',
            id: 'search',
            question: 'Great! What type of property are you looking for?',
            options: [
              {label: 'Buy', nextId: 'buy'},
              {label: 'Rent', nextId: 'rent'},
            ],
          },
          {
            _id: '68b2fec8d873031de86d1280',
            id: 'buy',
            question: 'What type of property do you want to buy?',
            options: [
              {label: 'Apartments', nextId: 'buy_apartments'},
              {label: 'Villas', nextId: 'buy_villas'},
              {label: 'Plots', nextId: 'buy_plots'},
            ],
          },
          {
            _id: '68b2fec8d873031de86d1281',
            id: 'rent',
            question: 'What type of property do you want to rent?',
            options: [
              {label: 'Apartments', nextId: 'rent_apartments'},
              {label: 'Villas', nextId: 'rent_villas'},
            ],
          },
          {
            _id: '68b2fec8d873031de86d1282',
            id: 'visit',
            question:
              'To book a visit, please share the property ID or choose from your saved properties.',
            options: [],
          },
          {
            _id: '68b2fec8d873031de86d1283',
            id: 'faqs',
            question: 'Here are some common questions:',
            options: [
              {label: 'Payment Options', nextId: 'faq_payment'},
              {label: 'Refund Policy', nextId: 'faq_refund'},
              {label: 'Contact Support', nextId: 'faq_support'},
            ],
          },
          {
            _id: '68b2fec8d873031de86d1284',
            id: 'faq_payment',
            question:
              'We support bank transfer, UPI, and major debit/credit cards.',
            options: [],
          },
          {
            _id: '68b2fec8d873031de86d1285',
            id: 'faq_refund',
            question: 'Refunds are processed within 7 working days.',
            options: [],
          },
          {
            _id: '68b2fec8d873031de86d1286',
            id: 'faq_support',
            question:
              'You can reach us at support@hotplotz.com or call +91-9876543210.',
            options: [],
          },
        ]}
        theme={theme}
      />
    </SafeAreaView>
  );
};

export default Index;
