/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CommonHeader from '@components/Header/CommonHeader';
import {useTheme} from '@theme/ThemeProvider';
import {Fonts} from '@constants/font';

const PrivacyPolicy = () => {
  const {theme} = useTheme();

  const Section = ({children}: {children: React.ReactNode}) => (
    <Text style={[styles.section, {color: theme.colors.text}]}>{children}</Text>
  );
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <CommonHeader title="Privacy Policy" textColor="#171717" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.card,
            {backgroundColor: theme.colors.background, borderColor: '#EBEBEB'},
          ]}>
          <Section>
            JR GROUP (“Company,” “we,” “our,” or “us”) operates the Hotplotz
            mobile application (“App”) and related services in India. We value
            your trust and are committed to protecting your personal information
            in accordance with applicable Indian laws.
          </Section>

          <Section>
            1. Information We Collect{'\n'}- Personal Information: Name, phone
            number, email, ID proof, payment details{'\n'}- Property &
            Transaction Info: Listings, preferences, communications{'\n'}-
            Device Data: OS, IP address, logs, geolocation (with consent){'\n'}-
            Communication Data: Chats, calls, feedback
          </Section>

          <Section>
            2. Purpose of Processing{'\n'}- To provide and improve services,
            enable transactions, connect users, process payments, prevent fraud,
            send updates, comply with law.
          </Section>

          <Section>
            3. Legal Basis{'\n'}- Consent, Contractual necessity, Legal
            obligations, Legitimate interests
          </Section>

          <Section>
            4. Data Sharing{'\n'}- With property owners/agents, service
            providers, legal authorities, and business partners.
          </Section>

          <Section>
            5. Data Retention{'\n'}- Retained as long as necessary for services,
            disputes, legal compliance.
          </Section>

          <Section>
            6. Data Security{'\n'}- Reasonable security practices (IT Act 2000,
            SPDI Rules 2011), encryption, secure servers.
          </Section>

          <Section>
            7. User Rights{'\n'}- Access, correction, deletion, withdrawal
            consent, grievance redressal.
          </Section>

          <Section>
            8. Children’s Privacy{'\n'}- Not for under 18 years. Data from
            minors deleted.
          </Section>

          <Section>
            9. Third-Party Links{'\n'}- Not responsible for third-party
            practices.
          </Section>

          <Section>
            10. International Transfers{'\n'}- Data may be processed outside
            India with adequate safeguards.
          </Section>

          <Section>
            11. Policy Updates{'\n'}- Changes notified via app/email.
          </Section>

          <Section>
            12. Contact{'\n'}
            Data Protection Officer (DPO){'\n'}
            JR GROUP{'\n'}
            THOTTUMKARA, PURATHEZHATHU, Sakthikulangara, SAKTHIKULANGARA,
            Primary Health Centre Sakthikulangara, SAKTHIKULANGARA, Kollam,
            Kollam, Kerala, 691581{'\n'}
            Email: contact@hotplotz.com{'\n'}
            Phone: +91 8593987471
          </Section>
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
    marginTop: 12,
  },
});

export default React.memo(PrivacyPolicy);
