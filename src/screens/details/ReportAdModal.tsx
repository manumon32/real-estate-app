import useBoundStore from '@stores/index';
import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const reportOptions = [
  'Offensive content',
  'Fraud',
  'Duplicate ad',
  'Product already sold',
  'Other',
];

const ReportAdModal = ({visible, onClose, onSubmit}: any) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [comment, setComment] = useState('');

  const {reportAdLoading} = useBoundStore();

  const handleSend = () => {
    onSubmit({reason: selectedReason, comment});
    setSelectedReason('');
    setComment('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                setSelectedReason('');
                setComment('');
                onClose();
              }}>
              <MaterialCommunityIcons name="close" size={24} />
            </Pressable>
            <Text style={styles.title}>Report ad</Text>
            <View style={{width: 24}} />
          </View>

          {/* Radio Options */}
          <FlatList
            data={reportOptions}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <Pressable
                style={styles.optionRow}
                onPress={() => setSelectedReason(item)}>
                <MaterialCommunityIcons
                  name={
                    selectedReason === item
                      ? 'radiobox-marked'
                      : 'radiobox-blank'
                  }
                  size={22}
                  color="#333"
                />
                <Text style={styles.optionText}>{item}</Text>
              </Pressable>
            )}
            scrollEnabled={false}
          />

          {/* Comment Input */}
          <Text style={styles.commentLabel}>Add a comment</Text>
          <TextInput
            style={styles.input}
            placeholder="Comment"
            value={comment}
            onChangeText={setComment}
            multiline
          />

          {/* Send Button */}
          <TouchableOpacity
            style={[
              styles.sendBtn,
              {backgroundColor: selectedReason && comment ? '#2f8f72' : '#ccc'},
            ]}
            disabled={!(selectedReason && comment)}
            onPress={handleSend}>
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
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

export default ReportAdModal;
