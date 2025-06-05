import React, {FC, useCallback, useMemo} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface CommonSearchHeaderProps {
  searchValue: string;
  onChangeSearch: (text: string) => void;
  onBackPress: () => void;
  placeholder?: string;
  inputProps?: TextInputProps;
}

const CommonSearchHeader: FC<CommonSearchHeaderProps> = ({
  searchValue,
  onChangeSearch,
  onBackPress,
  placeholder = 'Search',
  inputProps,
}) => {
  const handleTextChange = useCallback(
    (text: string) => onChangeSearch(text),
    [onChangeSearch],
  );

  const inputPlaceholder = useMemo(() => placeholder, [placeholder]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            value={searchValue}
            onChangeText={handleTextChange}
            placeholder={inputPlaceholder}
            style={styles.input}
            placeholderTextColor="#888"
            {...inputProps}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(CommonSearchHeader);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F9F9F9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#fff',
    // height: (Platform.OS === 'android' ? 200 : 0),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 18,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    elevation: 2,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 48,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 0,
  },
});
