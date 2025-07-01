import IconButton from '@components/Buttons/IconButton';
import {Fonts} from '@constants/font';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';

export interface SelectOption {
  label: string;
  value: string;
}

interface CommonSelectProps {
  options: SelectOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  placeholder?: string;
}

const CommonSelect: React.FC<CommonSelectProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
}) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    options.find(opt => opt.value === selectedValue)?.label || placeholder;

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setVisible(true)}>
        <Text
          numberOfLines={1}
          style={[styles.selectorText, !selectedValue && styles.placeholder]}>
          {selectedLabel}
        </Text>
        <IconButton
          iconSize={24}
          //red , heart
          iconColor={'#171717'}
          iconName={visible ? 'chevron-up' : 'chevron-down'}
        />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onSelect(item.value);
                    setVisible(false);
                  }}>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    padding: 12,
    paddingRight: 25,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  selectorText: {
    fontSize: 16,
    color: '#171717',
    fontFamily: Fonts.REGULAR,
    width: '90%',
  },
  placeholder: {
    color: '#999',
    fontSize: 16,
    width: '90%',
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  dropdown: {
    backgroundColor: '#F8F9FC',
    borderRadius: 12,
    paddingVertical: 8,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontFamily: Fonts.REGULAR,
  },
});

export default CommonSelect;
