import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useTheme} from '@theme/ThemeProvider';
import IconButton from '@components/Buttons/IconButton';
import AdPostIcon from '@assets/svg/post.svg';
import {Fonts} from '@constants/font';
// import LoginModal from './Modal/LoginModal';
import useBoundStore from '@stores/index';
// import CommonLocationModal from './Modal/LocationSearchModal';

const renderTabIcon = (routeName: string) => {
  switch (routeName) {
    case 'Home':
      return 'home';
    case 'Chat':
      return 'chat-processing-outline';
    case 'MyAds':
      return 'file-document-outline';
    case 'Profile':
      return 'account';
    default:
      return '';
  }
};

const BottomTabBar = ({state, navigation}: any) => {
  const {theme} = useTheme();
  const {
    // visible,
    setVisible,
    bearerToken,
    unreadCount,
    setUnreadCount,
    // locationModalvisible,
    // setlocationModalVisible,
    // setLocation,
    // locationHistory,
  } = useBoundStore();

  const ingoreRoutes = [
    'Settings',
    'Notifications',
    'Communication',
    'PrivacyPolicy',
    'TermsConditions',
    'filter',
  ];

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}>
      <View style={styles.tabBar}>
        {state.routes
          .filter((item: {name: string}) => !ingoreRoutes.includes(item.name))
          .map((route: any, index: number) => {
            const isFocused = state.index === index;

            const color = isFocused ? '#2E7D32' : '#888';
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
                      <IconButton
                        iconSize={22}
                        iconColor={color}
                        iconName={renderTabIcon(route.name)}
                      />
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
        {/* <LoginModal visible={visible} onClose={() => setVisible()} /> */}
        {/* <CommonLocationModal
          visible={locationModalvisible}
          onClose={() => setlocationModalVisible()}
          onSelectLocation={setLocation}
          locationHistory={locationHistory}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  textFocusedStyle: {
    fontSize: 12,
    color: '#2E7D32',
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
