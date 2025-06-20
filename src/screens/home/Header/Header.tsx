/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Text, Platform, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@theme/ThemeProvider';
import IconButton from '@components/Buttons/IconButton';
import {Fonts} from '@constants/font';
import SearchContent from './SearchContent';
import HeaderIconContent from './HeaderIconContent';
import useBoundStore from '@stores/index';

function Header(): React.JSX.Element {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const {setlocationModalVisible, location} = useBoundStore();

  const backgroundStyle = {
    backgroundColor: theme.colors.background,
  };

  return (
    <>
      <View style={[backgroundStyle]}>
        <LinearGradient
          colors={theme.colors.backgroundPalette}
          start={{x: 1, y: 2}}
          end={{x: 0.5, y: 1}}
          style={[
            styles.container,
            {
              paddingTop: Platform.OS === 'android' ? insets.top : 0,
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
              <Text numberOfLines={1} style={[styles.textStyle, {color: theme.colors.text}]}>
                {location?.name || 'Kerala'}
              </Text>
              <IconButton
                iconSize={18}
                iconColor={theme.colors.text}
                iconName={'chevron-down'}
              />
            </TouchableOpacity>
            <IconButton
              iconSize={20}
              iconColor={theme.colors.text}
              iconName={'bell'}
            />
          </View>
          <SearchContent />
          <HeaderIconContent />
        </LinearGradient>
      </View>
      <View
        style={{
          borderRadius: 20,
          backgroundColor: theme.colors.backgroundHome,
          bottom: 5,
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
    height: 230 + (Platform.OS === 'android' ? 10 : 0),
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
    maxWidth:250,
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
