/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ViewStyle,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {Fonts} from '@constants/font';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface CommonHeaderProps {
  title: string;
  onBackPress?: () => void;
  onRightPress?: () => void;
  rightIcon?: string;
  backgroundColor?: string;
  textColor?: string;
  containerStyle?: ViewStyle;
  rightText?: string;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  onBackPress,
  onRightPress,
  rightIcon,
  backgroundColor = '#fff',
  textColor = '#1C1C1E',
  containerStyle,
  rightText,
}) => {
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.wrapper,
        {backgroundColor},
        containerStyle,
        {
          paddingTop: Platform.OS === 'android' ? insets.top : 10,
          height: Platform.OS === 'android' ? 80 : 50,
        },
      ]}>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={Platform.OS === 'android' ? 'dark-content' : 'dark-content'}
      />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            onBackPress ? onBackPress() : navigation.goBack();
          }}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color={textColor}
          />
        </TouchableOpacity>

        <Text style={[styles.title, {color: textColor}]} numberOfLines={1}>
          {title}
        </Text>

        {rightIcon ? (
          <TouchableOpacity style={styles.rightButton} onPress={onRightPress}>
            <MaterialCommunityIcons
              name={rightIcon}
              size={22}
              color={textColor}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.rightPlaceholder} />
        )}
        {rightText ? (
          <Text style={{fontSize: 14, fontFamily: Fonts.MEDIUM}}>
            {rightText}
          </Text>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    // height:80,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    marginHorizontal: 12,
    fontFamily: Fonts.MEDIUM,
  },
  rightButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightPlaceholder: {
    width: 32,
    height: 32,
  },
});
