import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

interface ChatMessageSuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (message: string) => void;
  containerStyle?: object;
  itemStyle?: object;
  textStyle?: object;
  autoHide?: boolean; // hides tapped items
}

const ChatMessageSuggestions: React.FC<ChatMessageSuggestionsProps> = ({
  suggestions,
  onSelectSuggestion,
  containerStyle,
  itemStyle,
  textStyle,
  autoHide = true,
}) => {
  const [visibleSuggestions, setVisibleSuggestions] = useState(suggestions);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

//   useEffect(() => {
//     setVisibleSuggestions(suggestions);
//   }, [suggestions]);

  // Handle keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSelect = (item: string) => {
    if (autoHide) {
      setVisibleSuggestions(prev => prev.filter(s => s !== item));
    }
    onSelectSuggestion(item);
  };

  // Hide suggestions if keyboard is visible
  if (keyboardVisible || !visibleSuggestions.length) return null;

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        data={visibleSuggestions}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.suggestionItem, itemStyle]}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
          >
            <Text style={[styles.suggestionText, textStyle]}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderTopWidth:0.2,
    borderTopColor:'#ccc'
  },
  suggestionItem: {
    backgroundColor: '#f2f3f5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  suggestionText: {
    color: '#333',
    fontSize: 14,
  },
});

export default ChatMessageSuggestions;
