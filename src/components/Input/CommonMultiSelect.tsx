// CommonMultiSelect.tsx
import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {Checkbox, Chip, Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type Option<V = string | number> = {name: string; _id: V};

export interface CommonMultiSelectProps<V = string | number> {
  options: Option<V>[];
  value: V[];
  onChange: (v: V[]) => void;
  placeholder?: string;
  maxSelect?: number;
  showSelectAll?: boolean;
  error?: string;
}

export function CommonMultiSelect<V = string | number>({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  maxSelect = 10000,
  showSelectAll = false,
  error,
}: CommonMultiSelectProps<V>) {
  const [open, setOpen] = useState(false);

  const selectedSet = useMemo(() => new Set<V>(value), [value]);

  const toggle = useCallback(
    (v: V) => {
      const next = new Set(selectedSet);
      if (next.has(v)) next.delete(v);
      else if (!maxSelect || next.size < maxSelect) next.add(v);
      onChange(Array.from(next));
    },
    [selectedSet, maxSelect, onChange],
  );

  const clearAll = useCallback(() => onChange([]), [onChange]);
  const selectAll = useCallback(
    () => onChange(options.map(o => o._id)),
    [options, onChange],
  );

  const selectedOptions = useMemo(
    () => options.filter(o => selectedSet.has(o._id)),
    [options, selectedSet],
  );

  return (
    <SafeAreaView>
      {/* Field */}
      <TouchableOpacity
        style={[
          styles.field,
          error && styles.fieldError,
          open && styles.fieldActive,
        ]}
        onPress={() => setOpen(true)}>
        <Text style={value.length ? styles.fieldLabel : styles.placeholder}>
          {value.length ? `${value.length} selected` : placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={24} />
      </TouchableOpacity>

      {/* Chips */}
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {value.length > 0 && (
          <Chip
            icon="close-circle"
            onPress={clearAll}
            style={[styles.chip, styles.clearChip]}>
            Clear all
          </Chip>
        )}
        {selectedOptions.map(opt => (
          <Chip
            key={String(opt._id)}
            onClose={() => toggle(opt._id)}
            style={styles.chip}>
            {opt.name}
          </Chip>
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Modal list */}
      <Modal
        statusBarTranslucent
        visible={open}
        animationType="slide"
        transparent>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>Select options</Text>
              <MaterialCommunityIcons
                name="close"
                size={24}
                onPress={() => setOpen(false)}
              />
            </View>

            {showSelectAll && (
              <View style={styles.helperRow}>
                <Button onPress={selectAll}>Select All</Button>
                <Button onPress={clearAll}>Clear All</Button>
              </View>
            )}

            <FlatList
              data={options}
              keyExtractor={i => String(i._id)}
              renderItem={({item}) => {
                const checked = selectedSet.has(item._id);
                return item.name && item._id ? (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => toggle(item._id)}>
                    <Checkbox
                      status={checked ? 'checked' : 'unchecked'}
                      onPress={() => toggle(item._id)}
                    />
                    <Text style={styles.rowLabel}>{item.name}</Text>
                  </TouchableOpacity>
                ) : (
                  <></>
                );
              }}
            />

            <Button mode="contained" onPress={() => setOpen(false)}>
              Done
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    justifyContent: 'space-between',
    backgroundColor: '#F5F6FA', // soft background
    paddingHorizontal: 16,
    paddingLeft: 14,
  },
  fieldActive: {borderColor: '#6200ee'},
  fieldError: {borderColor: '#b00020'},
  fieldLabel: {fontSize: 16},
  placeholder: {fontSize: 16, color: '#999'},
  chip: {marginRight: 4, marginTop: 6},
  clearChip: {backgroundColor: '#f5f5f5'},
  error: {color: '#b00020', marginTop: 4},
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    height: '80%',
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {fontSize: 18, fontWeight: '600'},
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 6,
  },
  row: {flexDirection: 'row', alignItems: 'center', paddingVertical: 8},
  rowLabel: {fontSize: 16},
});
