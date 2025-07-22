import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface CommonAmenityToggleProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

const CommonAmenityToggle: React.FC<CommonAmenityToggleProps> = ({
  label,
  selected,
  onToggle,
}) => {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.iconBox, selected && styles.selected]}>
        {selected && (
          <MaterialCommunityIcons name="check" size={16} color="#fff" />
        )}
        {!selected && (
          <MaterialCommunityIcons name="checkbox-blank-outline" size={16}   />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F8FC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#219E93',
  },
});

export default CommonAmenityToggle;
