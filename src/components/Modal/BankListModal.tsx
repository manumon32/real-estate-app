/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useMemo, useEffect} from 'react';
import {Text, TextInput, List, Button, useTheme} from 'react-native-paper';
import {
  FlatList,
  Image,
  StyleSheet,
  Modal,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useBoundStore from '@stores/index';

interface BankSelectModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (bank: string) => void;
  selectedBank?: string;
}

const BankSelectModal = ({
  visible,
  onDismiss,
  onSelect,
}: BankSelectModalProps) => {
  const {banks, bankVerification_loading} = useBoundStore();
  useEffect(() => {
    console.log('banks', banks);
  }, [banks]);
  const enrichedBanks = useMemo(() => {
    return banks?.map((bank: any) => {
      return {
        ...bank,
        ...{
          name: bank?.bankId?.name,
          logoUrl: bank?.bankId?.logoUrl,
        }, // spread bankId fields into top-level
      };
    });
  }, [banks]);
  const [search, setSearch] = useState('');
  const theme = useTheme();

  const filteredBanks = useMemo(() => {
    return enrichedBanks?.filter((bank: any) =>
      bank?.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [enrichedBanks, search]);

  const renderItem = ({item}: {item: any}) => (
    <>
      <List.Item
        title={item.name}
        onPress={() => {
          onSelect(item);
          // onDismiss();
        }}
        left={() => (
          <Image
            source={{uri: item.logoUrl}}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
        right={() =>
          item.status === 'verified' ? (
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={20}
              color={theme.colors.primary}
              style={{marginTop: 8, marginRight: 8}}
            />
          ) : null
        }
      />
    </>
  );

  return (
    <Modal
      visible={visible}
      statusBarTranslucent
      animationType="fade"
      transparent
      onRequestClose={onDismiss}>
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Select Your Bank</Text>
            <TextInput
              mode="outlined"
              placeholder="Search bank..."
              value={search}
              onChangeText={setSearch}
              style={styles.input}
              left={<TextInput.Icon icon="magnify" />}
            />
            <View style={{maxHeight:250}}>
            <FlatList
              data={filteredBanks}
              keyExtractor={(item: any) => item?._id}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={
                <>
                  {filteredBanks.length <= 0 && bankVerification_loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" />
                    </View>
                  ) : (
                    <></>
                  )}
                </>
              }
            />
            </View>
            <Button onPress={onDismiss} style={styles.closeBtn}>
              Cancel
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000055',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 4,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  closeBtn: {
    marginTop: 12,
  },

  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BankSelectModal;
