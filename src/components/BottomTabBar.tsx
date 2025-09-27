import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useTheme} from '@theme/ThemeProvider';
// @ts-ignore
import AdPostIcon from '@assets/svg/post.svg';
// @ts-ignore
import HomeIcon from '@assets/svg/new/home.svg';
// @ts-ignore
import ChatIcon from '@assets/svg/new/chat.svg';
// @ts-ignore
import MyAdsIcon from '@assets/svg/new/myads.svg';
// @ts-ignore
import ProfileIcon from '@assets/svg/new/profile.svg';
// @ts-ignore
import ProfileActiveIcon from '@assets/svg/new/profile_active.svg';
// @ts-ignore
import HomeActiveIcon from '@assets/svg/new/home_active.svg';
// @ts-ignore
import ChatActiveIcon from '@assets/svg/new/chat_active.svg';
// @ts-ignore
import MyadsActiveIcon from '@assets/svg/new/myads_active.svg';

import {Fonts} from '@constants/font';
import useBoundStore from '@stores/index';
import SafeFooter from './SafeFooter';

const renderIcons = (routeName: string, isFocused: boolean) => {
  switch (routeName) {
    case 'Home':
      return isFocused ? <HomeActiveIcon /> : <HomeIcon />;
    case 'Chat':
      return isFocused ? <ChatActiveIcon /> : <ChatIcon />;
    case 'MyAds':
      return isFocused ? <MyadsActiveIcon /> : <MyAdsIcon />;
    case 'Profile':
      return isFocused ? <ProfileActiveIcon /> : <ProfileIcon />;
    default:
      return '';
  }
};

const BottomTabBar = ({state, navigation}: any) => {
  const {theme} = useTheme();
  const {setVisible, bearerToken, unreadCount, setUnreadCount} =
    useBoundStore();
  const styles = getStyles(theme);
  const ingoreRoutes = [
    'Settings',
    'Notifications',
    'Communication',
    'PrivacyPolicy',
    'TermsConditions',
    'filter',
  ];

  return (
    <SafeFooter style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes
          .filter((item: {name: string}) => !ingoreRoutes.includes(item.name))
          .map((route: any, index: number) => {
            const isFocused = state.index === index;
            const onPress = () => {
              if (
                (route.name === 'AddPost' ||
                  route.name === 'Chat' ||
                  route.name === 'Profile' ||
                  route.name === 'MyAds') &&
                !bearerToken
              ) {
                setVisible();
              } else if (route.name === 'AddPost') {
                navigation.navigate('PostAd');
              } else {
                if (route.name === 'Chat') {
                  setUnreadCount(0);
                }
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }
            };

            return (
              <React.Fragment key={route.key}>
                <TouchableOpacity onPress={onPress} style={styles.button}>
                  {route.name !== 'AddPost' ? (
                    <>
                      {renderIcons(route.name, isFocused)}
                      {route.name === 'Chat' &&
                        unreadCount > 0 &&
                        bearerToken &&
                        !isFocused && (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                          </View>
                        )}
                    </>
                  ) : (
                    <View style={styles.addButton}>
                      <AdPostIcon />
                    </View>
                  )}
                  <Text
                    style={[
                      isFocused ? styles.textFocusedStyle : styles.textStyle,
                      // eslint-disable-next-line react-native/no-inline-styles
                      {
                        bottom: route.name === 'AddPost' ? 28 : 0,
                      },
                    ]}>
                    {route.name === 'AddPost'
                      ? 'Post Ad'
                      : route.name === 'MyAds'
                      ? 'My Ads'
                      : route.name}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
      </View>
    </SafeFooter>
  );
};

export const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: 60,
      justifyContent: 'center',
      borderTopWidth: 0.2,
      borderTopColor: '#ccc',
      backgroundColor: theme.colors.background,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: 'transparent',
    },
    textFocusedStyle: {
      fontSize: 12,
      color: '#1BAF49',
      fontFamily: Fonts.MEDIUM,
    },
    textStyle: {
      fontSize: 12,
      color: '#888',
      fontFamily: Fonts.MEDIUM,
    },
    addButton: {
      bottom: 25,
      left: 0,
      right: 0,
      alignItems: 'center',
      elevation: 5,
    },
    button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      // bottom: 10,
    },
    badge: {
      position: 'absolute',
      top: 16,
      right: 25,
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
  });

export default BottomTabBar;
