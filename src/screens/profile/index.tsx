/* eslint-disable react-native/no-inline-styles */
import CommonHeader from '@components/Header/CommonHeader';
import MenuLink from '@components/MenuLink';
import {Fonts} from '@constants/font';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PremiumCard from './PremiumCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useBoundStore from '@stores/index';

const Profile = () => {
  const navigation = useNavigation();
  const {logout, user} = useBoundStore();
  return (
    <SafeAreaView
      style={{backgroundColor: '#F6FCFF', padding: 10, height: '100%'}}>
      <CommonHeader
        title="My Profile"
        textColor="#171717"
        backgroundColor={'#F6FCFF'}
        // onBackPress={onBackPress}
      />
      <ScrollView contentContainerStyle={{paddingBottom: 120}}>
        <View style={styles.container}>
          <Image
            style={{height: 72, width: 72, borderRadius: 20}}
            source={{
              uri: 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png',
            }}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{user?.name?user.name:'App User'}</Text>
           {user?.email && <Text style={styles.email}>{user?.email?user.email:''}</Text>}

            <TouchableOpacity onPress={()=>{
              // @ts-ignore
              navigation.navigate('EditProfile');
            }} style={styles.editRow}>
              <Icon name="pencil-outline" size={18} color={'#000'} />
              <Text style={[styles.editTxt, {color: '#000'}]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <PremiumCard />
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            borderColor: '#EBEBEB',
            borderWidth: 1,
            marginTop: 10,
            margin: 10,
          }}>
          <MenuLink
            icon="heart-outline"
            label="Favorite Listings"
            value={12}
            // @ts-ignore
            onPress={() => navigation.navigate('FavAds')}
          />
          <View
            style={{
              backgroundColor: '#EBEBEB',
              borderWidth: 1,
              borderColor: '#EBEBEB',
              width: '90%',
              alignSelf: 'center',
            }}
          />
          <MenuLink
            icon="home"
            label="My Ads"
            value={12}
            // @ts-ignore
            onPress={() => navigation.navigate('FavAds')}
          />
          <View
            style={{
              backgroundColor: '#EBEBEB',
              borderWidth: 1,
              borderColor: '#EBEBEB',
              width: '90%',
              alignSelf: 'center',
            }}
          />
          <MenuLink
            icon="file"
            label="My Orders"
            // @ts-ignore
            onPress={() => navigation.navigate('FavAds')}
          />
          <View
            style={{
              backgroundColor: '#EBEBEB',
              borderWidth: 1,
              borderColor: '#EBEBEB',
              width: '90%',
              alignSelf: 'center',
            }}
          />
          <MenuLink
            icon="cog-outline"
            label="Settings"
            // @ts-ignore
            onPress={() => navigation.navigate('FavAds')}
          />
          <View
            style={{
              backgroundColor: '#EBEBEB',
              borderWidth: 1,
              borderColor: '#EBEBEB',
              width: '90%',
              alignSelf: 'center',
            }}
          />
          <MenuLink
            icon="help-circle"
            label="Help and Support"
            // @ts-ignore
            onPress={() => navigation.navigate('FavAds')}
          />

          <View
            style={{
              backgroundColor: '#EBEBEB',
              borderWidth: 1,
              borderColor: '#EBEBEB',
              width: '90%',
              alignSelf: 'center',
            }}
          />
        </View>
        <TouchableOpacity
          onPress={async () => {
           await logout();
            // @ts-ignore
            navigation.reset({index: 0, routes: [{name: 'Main'}]});
          }}
          style={styles.filledButton}>
          <MaterialCommunityIcons name="logout" size={18} color="#FF3F3F" />
          <Text style={styles.filledText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filledButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginLeft: 8,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3F3F',
    marginTop: 10,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
  },

  filledText: {
    color: '#FF3F3F',
    fontWeight: '500',
    fontSize: 14,
    fontFamily: Fonts.REGULAR,
    right: -5,
  },
  card: {
    backgroundColor: '#F6FCFF',
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
    backgroundColor: '#e0f5ec',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    padding: 20,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontFamily: Fonts.MEDIUM,
    color: '#171717',
  },
  email: {
    color: '#696969',
    marginTop: 2,
    fontSize: 14,
    fontFamily: Fonts.REGULAR,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  editTxt: {
    fontWeight: '500',
    fontFamily: Fonts.REGULAR,
  },
});

export default Profile;
