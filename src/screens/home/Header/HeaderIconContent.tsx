import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IconButton from '@components/Buttons/IconButton';
import {useTheme} from '@theme/ThemeProvider';
import {useNavigation} from '@react-navigation/native';
import useBoundStore from '@stores/index';

function HeaderIconContent(): React.JSX.Element {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {setFilters} = useBoundStore();

  const tabIcons = [
    {
      label: 'Buy',
      icon: 'home',
      _id: '684176d84eb67a1a216b94fd',
      type: 'listingTypeId',
    },
    {
      label: 'Rent',
      icon: 'key-variant',
      _id: '684176e74eb67a1a216b9501',
      type: 'listingTypeId',
    },
    {
      label: 'Lease',
      icon: 'calendar-month',
      _id: '6841770a4eb67a1a216b9505',
      type: 'listingTypeId',
    },
    {
      label: 'Land',
      icon: 'island',
      _id: '6841753e4a95cf182c60a307',
      type: 'propertyTypeId',
    },
    {
      label: 'Commertial',
      icon: 'office-building',
      _id: '684175aa4eb67a1a216b94ed',
      type: 'propertyTypeId',
    },
  ];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {tabIcons.map((items, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            let filterPayload = {
              [`${items.type}`]: items._id,
            };
            setFilters(filterPayload);
            // @ts-ignore
            navigation.navigate('filter');
          }}>
          <View style={styles.iconContainer}>
            <IconButton iconSize={24} iconName={items.icon} />
          </View>
          <Text style={[styles.textStyle, {color: theme.colors.text}]}>
            {items.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 52,
    height: 52,
    margin: 10,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 12,
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    textAlign: 'center',
  },
  box: {
    width: 120,
    height: 120,
    marginRight: 12,
    backgroundColor: '#CAF3EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tabStyle: {alignSelf: 'center'},
});

export default HeaderIconContent;
