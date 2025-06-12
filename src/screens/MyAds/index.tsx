import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ListingCardProps {
  title: string;
  location: string;
  price: string;
  status: string;
  date: string;
  views: number;
  imageUrl: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
  title,
  location,
  price,
  status,
  date,
  views,
  imageUrl,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{uri: imageUrl}} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{status}</Text>
            </View>
          </View>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.price}>₹{price}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Icon name="eye-outline" size={16} color="#888" />
          <Text style={styles.metaText}>{views}</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="clock-outline" size={16} color="#888" />
          <Text style={styles.metaText}>Posted {date}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.outlinedButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlinedButton}>
          <Text style={styles.buttonText}>Make us Sold</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MyAds = () => {
  return (
    <View style={{backgroundColor:'#fff', padding:10, height:'100%'}}>
      <ListingCard
        title="2 BHK Apartment"
        location="HSR Layout - Bangalore"
        price="25,000"
        status="For Sale"
        date="Apr 15, 2025"
        views={200}
        imageUrl="https://media.istockphoto.com/id/1396856251/photo/colonial-house.jpg?s=612x612&w=0&k=20&c=_tGiix_HTQkJj2piTsilMuVef9v2nUwEkSC9Alo89BM="
      />
      <ListingCard
        title="2 BHK Apartment"
        location="HSR Layout - Bangalore"
        price="25,000"
        status="For Sale"
        date="Apr 15, 2025"
        views={200}
        imageUrl="https://media.istockphoto.com/id/1396856251/photo/colonial-house.jpg?s=612x612&w=0&k=20&c=_tGiix_HTQkJj2piTsilMuVef9v2nUwEkSC9Alo89BM="
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default MyAds;
