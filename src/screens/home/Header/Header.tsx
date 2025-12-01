/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@theme/ThemeProvider';
import IconButton from '@components/Buttons/IconButton';
import {Fonts} from '@constants/font';
import SearchContent from './SearchContent';
import HeaderIconContent from './HeaderIconContent';
import useBoundStore from '@stores/index';

import CommonLocationModal from '@components/Modal/LocationSearchModal';

// const CommonLocationModal = React.lazy(
//   () => import('@components/Modal/LocationSearchModal'),
// );
const GlobalSearchModal = React.lazy(
  () => import('@components/Modal/GlobalSearchModal'),
);

function Header({navigation}: any): React.JSX.Element {
  const {theme} = useTheme();
  const setlocationModalVisible = useBoundStore(s => s.setlocationModalVisible);
  const location = useBoundStore(s => s.location);
  const bearerToken = useBoundStore(s => s.bearerToken);
  const setVisible = useBoundStore(s => s.setVisible);
  const locationfetchLoading = useBoundStore(s => s.locationfetchLoading);
  const notificationsCount = useBoundStore(s => s.notificationsCount);
  const listings = useBoundStore(s => s.listings);
  const setLocation = useBoundStore(s => s.setLocation);
  const locationHistory = useBoundStore(s => s.locationHistory);
  const locationModalvisible = useBoundStore(s => s.locationModalvisible);
  const globalModalvisible = useBoundStore(s => s.globalModalvisible);
  const setGlobalModalVisible = useBoundStore(s => s.setGlobalModalVisible);

  const backgroundStyle = {
    backgroundColor: theme.colors.background,
  };

  const isDarkMode = useColorScheme() === 'dark';
  return (
    <>
      <View style={[backgroundStyle]}>
        <StatusBar
          backgroundColor={theme.colors.background}
          barStyle={Platform.OS === 'android' ? 'dark-content' : 'dark-content'}
        />
        <LinearGradient
          colors={theme.colors.backgroundPalette}
          start={!isDarkMode ? {x: 1, y: 2} : {x: 1, y: 0}}
          end={!isDarkMode ? {x: 0.5, y: 1} : {x: 1, y: 1}}
          style={[
            styles.container,
            {
              paddingTop: Platform.OS === 'android' ? 0 : 0,
            },
          ]}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => {
                setlocationModalVisible();
              }}
              style={styles.locationContainer}>
              <IconButton
                iconSize={16}
                style={styles.iconStyle}
                iconColor={theme.colors.text}
                iconName={'map-marker'}
              />
              <Text
                numberOfLines={1}
                style={[styles.textStyle, {color: theme.colors.text}]}>
                {location?.default
                  ? locationfetchLoading
                    ? 'Fetching...'
                    : location?.name || 'Kerala'
                  : location?.name || 'Kerala'}
              </Text>
              <IconButton
                iconSize={18}
                iconColor={theme.colors.text}
                iconName={'chevron-down'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                bearerToken
                  ? navigation.navigate('NotificationList')
                  : setVisible();
              }}>
              <IconButton
                iconSize={24}
                iconColor={theme.colors.text}
                iconName={'bell'}
              />
              {notificationsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificationsCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <SearchContent />
          <HeaderIconContent />
        </LinearGradient>
      </View>
      {listings.length > 0 && (
        <View
          style={[
            styles.divider,
            {backgroundColor: theme.colors.backgroundHome},
          ]}>
          <Text style={[styles.freshTextStyle, {color: theme.colors.text}]} />
        </View>
      )}
      {globalModalvisible && (
        <GlobalSearchModal
          visible
          onClose={setGlobalModalVisible}
          onSelectLocation={setLocation}
          locationHistory={locationHistory}
        />
      )}
      <CommonLocationModal
        visible={locationModalvisible}
        onClose={setlocationModalVisible}
        onSelectLocation={setLocation}
        locationHistory={locationHistory}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220 + (Platform.OS === 'android' ? 10 : 0),
    backgroundColor: 'transparent',
  },
  headerContainer: {
    padding: 22,
    paddingTop: 8,
    paddingBottom: 0,
    flexDirection: 'row',
  },
  locationContainer: {
    width: '90%',
    flexDirection: 'row',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -6,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  divider: {
    borderRadius: 20,
    bottom: 8,
    width: '100%',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  arrowDown: {
    top: 2,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  textStyle: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    marginRight: 5,
    maxWidth: '80%',
  },
  iconStyle: {
    marginRight: 5,
  },
  freshTextStyle: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    margin: 10,
    marginBottom: 5,
  },
});

export default React.memo(Header);
