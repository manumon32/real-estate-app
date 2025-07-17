import React from 'react';
import {Modal, View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ViewBenifitsModal = ({visible, onClose, selectedItem}: any) => {
  return (
    <Modal
      statusBarTranslucent
      visible={visible}
      animationType="slide"
      transparent>
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                onClose();
              }}>
              <MaterialCommunityIcons name="close" size={24} />
            </Pressable>
            <Text style={styles.title}>{selectedItem?.name ?? ''}</Text>
            <View style={{width: 24}} />
          </View>

          {/* Radio Options */}
          <FlatList
            data={selectedItem ?? []}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <Pressable style={styles.optionRow}>
                <MaterialCommunityIcons
                  name="check-circle"
                  color="#22C55E"
                  size={18}
                />
                <Text style={styles.optionText}>{item}</Text>
              </Pressable>
            )}
            scrollEnabled={false}
          />
          {/* Send Button */}
          {/* <TouchableOpacity
            style={[styles.sendBtn, {backgroundColor: '#2f8f72'}]}
       >
            <Text style={styles.sendBtnText}>Buy</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  commentLabel: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    paddingVertical: 8,
    fontSize: 15,
    marginBottom: 20,
  },
  sendBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ViewBenifitsModal;
