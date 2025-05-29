import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import SearchBar from '@components/SearchBar';
import IconButton from '@components/Buttons/IconButton';
import {Fonts} from '@constants/font';
const FilterModal = React.lazy(() => import('@components/Filter'));

function SearchContent(): React.JSX.Element {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => {}} style={styles.searchicon}>
          <SearchBar
            onChangeText={text => console.log(text)}
            autoCorrect={false}
            editable={false}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favIcon}>
          <IconButton
            iconSize={24}
            //red , heart
            iconColor={'#696969'}
            iconName={'heart-outline'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={styles.favIcon}>
          <IconButton
            iconSize={24}
            iconColor={'#696969'}
            iconName={'filter-variant'}
          />
        </TouchableOpacity>
        <FilterModal
          visible={visible}
          onClose={() => setVisible(false)}
          onApply={() => setVisible(false)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    paddingLeft: 18,
    width: '100%',
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
