/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeader';
import useBoundStore from '@stores/index';
import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
  View,
  Image,
  TouchableOpacity,
  //   FlatList,
  //   Text,
  //   RefreshControl,
} from 'react-native';
import {Fonts} from '@constants/font';
import TextInput from '@components/Input/textInput';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonSuccessModal from '@components/Modal/CommonSuccessModal';
const EditProfile = () => {
  const {user, updateuser, updateLoading, updateSuccess, setUpdateSuccess} = useBoundStore();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.email || '');
  const navigation = useNavigation();

  React.useEffect(() => {
    if (updateSuccess) {
      setVisible(true);
    }
  }, [updateSuccess]);

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="Edit Profile" textColor="#171717" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
          backgroundColor: '#fff',
          padding: 16,
          height: '100%',
        }}
        style={{
          height: '100%',
        }}>
        <Image
          style={{
            height: 100,
            width: 100,
            borderRadius: 50,
            justifyContent: 'center',
            alignSelf: 'center',
          }}
          source={{
            uri: 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png',
          }}
        />

        <View
          style={[
            styles.badge,
            {
              borderRadius: 20,
              right: -25,
              bottom: 28,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            },
          ]}
          // onPress={onPress}
        >
          <TouchableOpacity
            style={{backgroundColor: '#000', padding: 8, borderRadius: 10}}>
            <MaterialCommunityIcons name="camera" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          {/* <TextInput onChangeText={() => {}} placeholder="Property Title" /> */}
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={text => {
              setName(text);
            }}
            // onBlur={handleBlur('title')}
            // error={touched?.title && errors?.title ? true : false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          {/* <TextInput onChangeText={() => {}} placeholder="Property Title" /> */}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => {
              setEmail(text);
            }}
            // onBlur={handleBlur('title')}
            // error={touched?.title && errors?.title ? true : false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          {/* <TextInput onChangeText={() => {}} placeholder="Property Title" /> */}
          <TextInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={text => {
              setPhoneNumber(text);
            }}
            // onBlur={handleBlur('title')}
            // error={touched?.title && errors?.title ? true : false}
          />
        </View>
      </ScrollView>
      <View style={{padding: 12}}>
        <TouchableOpacity
          onPress={() => {
            let payload = {
              name: name,
            };
            updateuser(payload);
          }}
          style={styles.buyButton}
          accessibilityRole="button">
          {!updateLoading && <Text style={styles.buyText}>{'Save'}</Text>}
          {updateLoading && <ActivityIndicator color={'#fff'} size={'small'} />}
        </TouchableOpacity>
      </View>
      <CommonSuccessModal
        visible={visible}
        title="Success."
        message="Profile Updated Successfully."
        onClose={() => {
          setVisible(false);
          setUpdateSuccess()
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buyButton: {
    backgroundColor: '#2f8f72',
    alignItems: 'center',
    borderRadius: 16,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    bottom: 15,
  },
  buyText: {
    color: '#fff',
    fontSize: 16,
  },
  container: {
    padding: 10,
    height: '100%',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    flex: 1,
  },
  badge: {
    // backgroundColor: '#e0f5ec',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    color: '#15937c',
    fontWeight: '600',
  },
  location: {
    fontSize: 13,
    color: '#888',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e1e1e',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  outlinedButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },

  endText: {
    textAlign: 'center',
    color: '#888',
    padding: 12,
    fontStyle: 'italic',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: Fonts.MEDIUM,
  },
  loadingText: {
    marginTop: 8,
    color: '#555',
    fontSize: 14,
  },

  inputContainer: {
    padding: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
    marginBottom: 10,
  },
});

export default React.memo(EditProfile);
