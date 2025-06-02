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
import { useNavigation } from '@react-navigation/native';

interface CommonHeaderProps {
  title: string;
  onBackPress?: () => void;
  onRightPress?: () => void;
  rightIcon?: string;
  backgroundColor?: string;
  textColor?: string;
  containerStyle?: ViewStyle;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  onBackPress,
  onRightPress,
  rightIcon,
  backgroundColor = '#fff',
  textColor = '#1C1C1E',
  containerStyle,
}) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.wrapper, { backgroundColor }, containerStyle]}>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={Platform.OS === 'android' ? 'dark-content' : 'dark-content'}
      />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress || navigation.goBack}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color={textColor}
          />
        </TouchableOpacity>

        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
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
      </View>
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Platform.OS === 'android' ? 30 : 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
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
