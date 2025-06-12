import React, { useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';

type ChipItem = {
  name: string;
  _id: string;
  filterName?: string;
};

type RenderChipsProps = {
  data: ChipItem[];
  selectedIds?: string[];
  onSelect?: (item: ChipItem) => void;
  scrollToIndex?: number;
};

export const useChipScrollRefs = () => {
  const refs = useRef<Record<string, ScrollView | null>>({});
  const scrollToChipIndex = (key: string, index: number, itemWidth = 300) => {
    refs.current[key]?.scrollTo({
      x: index * itemWidth,
      animated: true,
    });
  };
  return { refs, scrollToChipIndex };
};

export const RenderChips = ({
  data,
  selectedIds = [],
  onSelect,
  scrollRef,
}: RenderChipsProps & { scrollKey: string; scrollRef: React.RefObject<ScrollView> }) => {
  const ITEM_WIDTH = 80;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      ref={(ref) => {
        if (ref) {scrollRef.current = ref;}
      }}
      contentContainerStyle={styles.chipContainer}
    >
      {data.map((item) => {
        const isSelected = selectedIds.includes(item._id);
        return (
          <TouchableOpacity
            key={item._id}
            onPress={() => onSelect?.(item)}
            style={[
              styles.chip,
              isSelected && styles.chipSelected,
              { width: ITEM_WIDTH },
            ]}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: '#2A9D8F',
    borderColor: '#2A9D8F',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
  },
});
