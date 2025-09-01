/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, RefreshControl, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import CommonHeader from '@components/Header/CommonHeader';
import MenuLink from '@components/MenuLink';
import useBoundStore from '@stores/index';
import {useTheme} from '@theme/ThemeProvider';

const Communication = () => {
  const {fetchUserDetails, userProfileloading, updateuser, user} =
    useBoundStore();
  const {theme} = useTheme();

  const commPrefs = user?.communicationPreferences || {
    email: true,
    sms: true,
    call: true,
  };

  const handleToggle = (key: keyof typeof commPrefs) => {
    const payload = {
      communicationPreferences: {
        ...commPrefs,
        [key]: !commPrefs[key],
      },
    };
    updateuser(payload);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <CommonHeader
        title="Communication Preferences"
        textColor={theme.colors.text}
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={userProfileloading}
            onRefresh={fetchUserDetails}
            colors={['#40DABE', '#40DABE', '#227465']}
          />
        }>
        <View style={[styles.card, {backgroundColor: theme.colors.background}]}>
          <MenuLink
            label="Email"
            selected={commPrefs.email}
            showToggle
            showChevron={false}
            onToggle={() => handleToggle('email')}
          />
          <View style={styles.divider} />

          <MenuLink
            label="SMS"
            selected={commPrefs.sms}
            showToggle
            showChevron={false}
            onToggle={() => handleToggle('sms')}
          />
          <View style={styles.divider} />

          <MenuLink
            label="Call"
            selected={commPrefs.call}
            showToggle
            showChevron={false}
            onToggle={() => handleToggle('call')}
          />
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
    paddingBottom: 120,
    padding: 10,
  },
  card: {
    borderRadius: 16,
    borderColor: '#EBEBEB',
    borderWidth: 1,
    marginTop: 10,
    margin: 10,
  },
  divider: {
    backgroundColor: '#EBEBEB',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    width: '90%',
    alignSelf: 'center',
  },
});

export default Communication;
