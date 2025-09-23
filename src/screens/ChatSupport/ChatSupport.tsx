import React, { useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

type Option = {
  label: string;
  nextId: string;
};

type Node = {
  id: string;
  question: string;
  options: Option[];
};

type Props = {
  data: Node[];
  theme: any
};

const ChatSupport: React.FC<Props> = ({ data, theme }) => {
  const [history, setHistory] = useState<string[]>(["root"]);
  const currentId = history[history.length - 1];

  const currentNode = useMemo(
    () => data.find((n) => n.id === currentId),
    [currentId, data]
  );

  const handleOptionPress = useCallback((nextId: string) => {
    setHistory((prev) => [...prev, nextId]);
  }, []);

  const handleBack = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  if (!currentNode) {
    return (
      <View style={styles.container}>
        <Text style={styles.question}>⚠️ Something went wrong.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor:theme.colors.background, minHeight:700}]}>
      {/* Back Button */}
      {history.length > 1 && (
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      )}

      {/* Question */}
      <Text style={[styles.question, {color:theme.colors.text}]}>{currentNode.question}</Text>

      {/* Options */}
      {currentNode.options.length > 0 ? (
        currentNode.options.map((opt) => (
          <TouchableOpacity
            key={opt.label}
            style={styles.optionBtn}
            onPress={() => handleOptionPress(opt.nextId)}
          >
            <Text style={[styles.optionText]}>{opt.label}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={[styles.answer, {color:theme.colors.text}]} />
      )}
    </ScrollView>
  );
};

export default ChatSupport;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backBtn: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: "#007AFF",
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  optionBtn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
  answer: {
    fontSize: 16,
    color: "#444",
    marginTop: 10,
  },
});
