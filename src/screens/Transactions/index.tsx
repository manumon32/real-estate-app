/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeader';
import {useNavigation} from '@react-navigation/native';
import useBoundStore from '@stores/index';
import React, {useCallback, useEffect} from 'react';
import {useTheme} from '@theme/ThemeProvider';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import AdsListSkelton from '@components/SkeltonLoader/AdsListSkelton';
import {SafeAreaView} from 'react-native-safe-area-context';
import NoChats from '@components/NoChatFound';

const formatDate = (arg: string | number | Date) => {
  const date = new Date(arg);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour12: true,
  });
};

const ListingCard = ({item, theme, navigation}: any) => {
  const plan = item?.subscriptionPlanId;
  const property = item?.propertyId;
  const url = item.invoiceUrl;
  const filename = 'invloice_' + property?._id + '.pdf';
  const [loading, setLoading] = React.useState(false);
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to save PDF',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const openPdfLink = async () => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No app available to open this link.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open document.');
      console.log(error);
    }
  };

  const openPDF = async () => {
    try {
      await requestStoragePermission();
      setLoading(true);
      const localFile =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${filename}`
          : `${RNFS.DocumentDirectoryPath}/${filename}`;

      const options = {
        fromUrl: url,
        toFile: localFile,
      };

      const result = await RNFS.downloadFile(options).promise;

      if (result.statusCode === 200) {
        await FileViewer.open(localFile);
      } else {
        openPdfLink();
      }
    } catch (error) {
      openPdfLink();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.background,
          borderWidth: 1,
          borderColor: '#fff',
        },
      ]}>
      <TouchableOpacity
        onPress={() => {
          // navigate to property or details page
          item.status === 'active' &&
            navigation.navigate('Details', {items: property});
        }}>
        <View style={styles.row}>
          {/* Property Image */}
          <Image
            source={{
              uri: property?.imageUrls?.[0] || 'https://via.placeholder.com/80',
            }}
            style={styles.image}
          />

          {/* Info */}
          <View style={styles.info}>
            <View style={styles.headerRow}>
              <Text
                numberOfLines={1}
                style={[styles.title, {color: theme.colors.text}]}>
                {property?.title || plan?.name}
              </Text>
            </View>

            <Text style={[styles.price, {color: theme.colors.text}]}>
              ₹{plan?.price}
            </Text>
            {property.isFeatured ? (
              <View style={[styles.badge]}>
                <Text numberOfLines={2} style={[styles.badgeText]}>
                  {'featured'}
                </Text>
              </View>
            ) : (
              <View style={[styles.badgeExpired]}>
                <Text numberOfLines={2} style={[styles.badgeText]}>
                  {'Plan Expired'}
                </Text>
              </View>
            )}
            <Text style={[styles.subText, {color: theme.colors.text}]}>
              {property.isFeatured ? ' Valid till' : 'Expired on'}:{' '}
              {formatDate(item.endDate)}
            </Text>
            {url && (
              <TouchableOpacity
                onPress={() => {
                  openPDF();
                }}>
                {loading ? (
                  <ActivityIndicator
                    style={{alignItems: 'flex-start'}}
                    color={theme.colors.text}
                  />
                ) : (
                  <Text style={styles.invoiceText}>View Invoice</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Transactions = () => {
  const {transactions, fetchTransactions, transLoading} = useBoundStore();
  const navigation = useNavigation();
  const {theme} = useTheme();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderItem = useCallback(
    ({item}: any) => (
      <ListingCard item={item} theme={theme} navigation={navigation} />
    ),
    [navigation],
  );

  return (
    <SafeAreaView style={{backgroundColor: theme.colors.background, flex: 1}}>
      <CommonHeader title="Orders" textColor="#171717" />

      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item: any) => item._id}
        contentContainerStyle={{
          paddingBottom: 120,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              fetchTransactions();
            }}
            colors={['#40DABE', '#227465']}
          />
        }
        ListFooterComponent={
          <>
            {transLoading && transactions.length <= 0 && <AdsListSkelton />}
            {!transLoading &&
              (transactions.length <= 0 ? (
                <NoChats
                  onExplore={() => {
                    // @ts-ignore
                    navigation.navigate('Main');
                  }}
                  icon="receipt"
                  title="Its quite here..."
                  body="Get out there to start finding great deals."
                  buttonText={'Explore'}
                />
              ) : null)}
          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
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
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    flex: 1,
  },
  badge: {
    backgroundColor: '#3ed493ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeExpired: {
    backgroundColor: '#ef6060ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#1e1e1e',
  },
  subText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  invoiceText: {
    fontSize: 14,
    color: '#676bebff',
    marginTop: 4,
  },
});

export default Transactions;
