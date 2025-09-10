/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CommonHeader from '@components/Header/CommonHeader';
import {useTheme} from '@theme/ThemeProvider';
import {Fonts} from '@constants/font';

const TermsConditions = () => {
  const {theme} = useTheme();
  const Section = ({children}: {children: React.ReactNode}) => (
    <Text style={[styles.section, {color: theme.colors.text}]}>{children}</Text>
  );

  const SubSection = ({children}: {children: React.ReactNode}) => (
    <Text style={[styles.subSection, {color: theme.colors.text}]}>
      {children}
    </Text>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <CommonHeader title="Terms & Conditions" textColor="#171717" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.card,
            {backgroundColor: theme.colors.background, borderColor: '#EBEBEB'},
          ]}>
          <Section>
            1. Eligibility
            <SubSection>Users must be 18+ and legally capable under</SubSection>
            Indian law.
          </Section>

          <Section>
            2. Services{'\n'}- Hotplotz provides a platform for buying, selling,
            and renting properties. We do not own, verify, or guarantee the
            accuracy of listings.
          </Section>

          <Section>
            3. User Responsibilities{'\n'}- Users must provide accurate
            information, avoid fraud/spam, and use the platform lawfully.
          </Section>

          <Section>
            4. Property Listings{'\n'}- All property details are submitted by
            users. Independent verification is advised. We are not liable for
            errors or disputes.
          </Section>

          <Section>5. Paid Services & Payment Gateways</Section>
          <SubSection>
            - Subscriptions and payments are processed securely via third-party
            providers.
          </SubSection>
          <SubSection>
            - We are not responsible for errors, delays, or failures caused by
            payment providers.
          </SubSection>
          <SubSection>
            - Users must ensure accurate billing details. Refunds are not
            provided except where legally required.
          </SubSection>

          <Section>
            6. Data Security{'\n'}- Reasonable security practices (IT Act 2000,
            SPDI Rules 2011) are followed, including encryption and secure
            servers.
          </Section>

          <Section>
            7. Limitation of Liability{'\n'}- We are not liable for losses,
            damages, or disputes arising from use of the platform or property
            transactions.
          </Section>

          <Section>
            8. Changes to Terms{'\n'}- We may update these Terms & Conditions
            from time to time. Updates will be communicated via the app/email.
          </Section>

          <Text style={styles.footer}>Last updated: September 2025</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  section: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    letterSpacing: 0.1,
    lineHeight: 22,
    color: '#333333',
    marginTop: 12,
  },
  subSection: {
    fontSize: 13,
    fontFamily: Fonts.MEDIUM,
    color: '#555',
    lineHeight: 20,
    marginTop: 6,
    marginLeft: 12,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    fontFamily: Fonts.MEDIUM,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default React.memo(TermsConditions);
