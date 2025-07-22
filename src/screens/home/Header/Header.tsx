/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@theme/ThemeProvider';
import IconButton from '@components/Buttons/IconButton';
import {Fonts} from '@constants/font';
import SearchContent from './SearchContent';
import HeaderIconContent from './HeaderIconContent';
import useBoundStore from '@stores/index';

function Header({navigation}: any): React.JSX.Element {
  const {theme} = useTheme();
  const {
    setlocationModalVisible,
    location,
    bearerToken,
    setVisible,
    notificationsCount,
  } = useBoundStore();

  const backgroundStyle = {
    backgroundColor: theme.colors.background,
  };

  return (
    <>
      <View style={[backgroundStyle]}>
        <StatusBar
          backgroundColor={theme.colors.background}
          barStyle={Platform.OS === 'android' ? 'dark-content' : 'dark-content'}
        />
        <LinearGradient
          colors={theme.colors.backgroundPalette}
          start={{x: 1, y: 2}}
          end={{x: 0.5, y: 1}}
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
                {location?.name || 'Kerala'}
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
                iconSize={20}
                iconColor={theme.colors.text}
                iconName={'bell'}
              />
            </TouchableOpacity>
            {notificationsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationsCount}</Text>
              </View>
            )}
          </View>
          <SearchContent />
          <HeaderIconContent />
        </LinearGradient>
      </View>
      <View
        style={{
          borderRadius: 20,
          backgroundColor: theme.colors.backgroundHome,
          bottom: 8,
          width: '100%',
        }}>
        <Text style={[styles.freshTextStyle, {color: theme.colors.text}]}>
          {/* Fresh Recommendations */}
        </Text>
      </View>
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
    top: 8,
    right: 32,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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

export default Header;
