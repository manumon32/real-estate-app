import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
// import SearchBar from '@components/SearchBar';
const SearchBar = React.lazy(() => import('@components/SearchBar'));
import IconButton from '@components/Buttons/IconButton';
import {Fonts} from '@constants/font';
// import FilterModal from '@components/Filter';
const FilterModal = React.lazy(() => import('@components/Filter'));

import {useNavigation} from '@react-navigation/native';
import useBoundStore from '@stores/index';

function SearchContent(): React.JSX.Element {
  const [visible, setVisibles] = useState(false);
  const navigation = useNavigation();
  const clearFilterList = useBoundStore(s => s.clearFilterList);
  const bearerToken = useBoundStore(s => s.bearerToken);
  const setVisible = useBoundStore(s => s.setVisible);
  const setGlobalModalVisible = useBoundStore(s => s.setGlobalModalVisible);
  const resetFilters = useBoundStore(s => s.resetFilters);
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            resetFilters();
            setTimeout(() => {
              setGlobalModalVisible();
            }, 100);
          }}
          style={styles.searchicon}>
          <SearchBar
            onChangeText={text => console.log(text)}
            autoCorrect={false}
            editable={false}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (bearerToken) {
              // @ts-ignore
              navigation.navigate('FavAds');
            } else {
              setVisible();
            }
          }}
          style={styles.favIcon}>
          <IconButton
            iconSize={24}
            //red , heart
            iconColor={'#696969'}
            iconName={'heart-outline'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setVisibles(true)}
          style={styles.favIcon}>
          <IconButton
            iconSize={24}
            iconColor={'#696969'}
            iconName={'filter-variant'}
          />
        </TouchableOpacity>
        <FilterModal
          visible={visible}
          onClose={() => {
            setVisibles(false);
          }}
          onApply={() => {
            setVisibles(false);
            clearFilterList();
            // @ts-ignore
            navigation.navigate('filter');
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
    padding: 10,
  },
  searchicon: {width: '70%', zIndex: 10, opacity: 10},
  favIcon: {
    width: '15%',
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  textStyle: {
    fontSize: 12,
    fontFamily: Fonts.MEDIUM,
    textAlign: 'center',
    lineHeight: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default SearchContent;
