/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, RefreshControl, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import CommonHeader from '@components/Header/CommonHeader';
import MenuLink from '@components/MenuLink';
import useBoundStore from '@stores/index';
import {useTheme} from '@theme/ThemeProvider';

const Notifications = () => {
  const {fetchUserDetails, userProfileloading, updateuser, user} =
    useBoundStore();
  const {theme} = useTheme();

  const notificationPrefs = user?.notificationPreferences || {
    pushNotification: true,
    emailNotification: true,
    receiveUpdates: true,
    receiveRecommendations: true,
  };

  const handleToggle = (key: keyof typeof notificationPrefs) => {
    const payload = {
      notificationPreferences: {
        ...notificationPrefs,
        [key]: !notificationPrefs[key],
      },
    };
    updateuser(payload);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <CommonHeader
        title="Notifications"
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
            label="Push Notifications"
            selected={notificationPrefs.pushNotification}
            showToggle
            onToggle={() => handleToggle('pushNotification')}
            showChevron={false}
          />
          <View style={styles.divider} />

          <MenuLink
            label="Email Notifications"
            selected={notificationPrefs.emailNotification}
            showToggle
            onToggle={() => handleToggle('emailNotification')}
            showChevron={false}
          />
          <View style={styles.divider} />

          <MenuLink
            label="Receive Updates"
            selected={notificationPrefs.receiveUpdates}
            showToggle
            onToggle={() => handleToggle('receiveUpdates')}
            showChevron={false}
          />
          <View style={styles.divider} />

          <MenuLink
            label="Receive Recommendations"
            selected={notificationPrefs.receiveRecommendations}
            showToggle
            onToggle={() => handleToggle('receiveRecommendations')}
            showChevron={false}
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

export default Notifications;
