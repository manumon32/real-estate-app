import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import Image from 'react-native-fast-image';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import TextInput from '@components/Input/textInput';
import CommonImageUploader from '@components/Input/ImageUploader';
import ImagePickerModal from '@components/Modal/ImagePickerModal';
import useBoundStore from '@stores/index';
import CommonAmenityToggle from '@components/Input/amenityToggle';
import {useTheme} from '@theme/ThemeProvider';
import {useRoute} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {compressImage} from '../../helpers/ImageCompressor';
import {uploadImages} from '@api/services';

const Step5MediaUpload = (props: any) => {
  const route = useRoute();
  // @ts-ignore
  const items = route?.params?.items || null;
  const {
    setImages,
    setFloorPlans,
    images,
    floorPlans,
    managePlansList,
    token,
    clientId,
    bearerToken,
    setImageUploadLoading,
  } = useBoundStore();
  const [assets, setAssets] = useState<any[]>(images || []);
  const [floorPlan, setFloorPlan] = useState<any[]>(floorPlans || []);
  const [showBoostPopup, setShowBoostPopup] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const {
    currentStep,
    // handleSubmit,
    errors,
    touched,
    values,
    // setTouched,
    setFieldValue,
    isStringInEitherArray,
  } = props;

  const [price, setPrice] = useState(null);
  const [benifits, setBenifits] = useState([]);
  // Keep track of loading per image
  const [loadingState, setLoadingState] = useState<{[key: string]: boolean}>(
    {},
  );

  const removeAsset = useCallback((uri: string | undefined) => {
    if (!uri) {
      return;
    }
    setAssets(prev =>
      prev.filter(item => (item.uri ? item.uri !== uri : item !== uri)),
    );
  }, []);

  const removeFloor = useCallback((uri: string | undefined) => {
    if (!uri) {
      return;
    }
    setFloorPlan(prev =>
      prev.filter(item => (item.uri ? item.uri !== uri : item !== uri)),
    );
  }, []);

  useEffect(() => {
    // @ts-ignore
    if (managePlansList?.[0].price) {
      // @ts-ignore
      setPrice(managePlansList?.[0].price);
      // @ts-ignore
      setBenifits(managePlansList?.[0].benifits);
    }
  }, [managePlansList]);

  const renderItem = useCallback(
    ({item}: {item: any}) => {
      const isLoading = loadingState[item?.uri || item];
      const isFailed = item.status
        ? item.status === 'falied'
          ? true
          : false
        : false;
      return (
        <View style={styles.previewContainer}>
          <Image
            source={{
              uri: item?.uri || item,
              cache: Image.cacheControl.immutable,
            }}
            style={styles.preview}
            resizeMode="cover"
          />
          {isLoading && (
            <View style={styles.overlay}>
              <ActivityIndicator color={'#ffff'} />
            </View>
          )}
          {!isLoading && (
            <Pressable
              style={styles.removeBtn}
              onPress={() => removeAsset(item?.uri || item)}>
              <Text style={styles.removeText}>✕</Text>
            </Pressable>
          )}
          {isFailed && !isLoading && (
            // <View style={styles.overlay}>
            <Pressable
              style={{
                backgroundColor: 'red',
                padding: 5,
                borderRadius: 10,
                bottom: 30,
              }}
              onPress={() => retryUpload(item)}>
              <Text style={[styles.removeText, {textAlign: 'center'}]}>
                Retry
              </Text>
            </Pressable>
            // </View>
          )}
        </View>
      );
    },
    // @ts-ignore
    [loadingState, removeAsset, retryUpload],
  );

  const renderItemFloor = useCallback(
    ({item}: {item: any}) => {
      const isLoading = loadingState[item?.uri || item];
      return (
        <View style={styles.previewContainer}>
          <Image
            source={{
              uri: item?.uri || item,
              cache: Image.cacheControl.immutable,
            }}
            style={styles.preview}
            resizeMode="cover"
          />
          {isLoading && (
            <View style={styles.overlay}>
              <ActivityIndicator color={'#ffff'} />
            </View>
          )}
          {!isLoading && (
            <Pressable
              style={styles.removeBtn}
              onPress={() => removeFloor(item?.uri || item)}>
              <Text style={styles.removeText}>✕</Text>
            </Pressable>
          )}
        </View>
      );
    },
    [loadingState, removeFloor],
  );

  useEffect(() => {
    setImages(assets);
    setFieldValue('imageUrls', assets);
  }, [assets, setFieldValue, setImages]);

  useEffect(() => {
    setFloorPlans(floorPlan);
    setFieldValue('floorPlanUrl', floorPlan);
  }, [floorPlan, setFieldValue, setFloorPlans]);

  const keyExtractor = useCallback(
    (item: any) => item.uri ?? item.fileName ?? Math.random().toString(),
    [],
  );
  useEffect(() => {
    setFieldValue('showLoanOffers', isStringInEitherArray('loanEligible'));
    setFieldValue('showEmiCalculator', isStringInEitherArray('loanEligible'));
  }, [isStringInEitherArray, setFieldValue]);
  const previews = useMemo(
    () => (
      <FlatList
        data={assets}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={styles.previewRow}
      />
    ),
    [assets, keyExtractor, renderItem],
  );

  const uploadImagesLocal = async (images: any[], retry = false) => {
    setImageUploadLoading(true);

    // 1️⃣ Add selected images to state for immediate preview
    const assetsWithId = images.map(img => ({
      ...img,
      id: img.uri,
      uploadedUrl: null,
      status: 'queued', // status: queued | uploading | success | failed
    }));
    !retry &&
      setAssets(prev => [
        ...prev.filter(item => !images.some(img => img.uri === item.uri)),
        ...assetsWithId,
      ]);

    // 2️⃣ Show loader for all images
    const initialLoading: {[key: string]: boolean} = {};
    assetsWithId.forEach(img => (initialLoading[img.id] = true));
    setLoadingState(prev => ({...prev, ...initialLoading}));

    const uploadParams = {token, clientId, bearerToken};

    // 3️⃣ Upload all images in parallel using Promise.allSettled
    const uploadResults = await Promise.allSettled(
      assetsWithId.map(async img => {
        try {
          // Mark as uploading
          setAssets(prev =>
            prev.map(item =>
              item.id === img.id ? {...item, status: 'uploading'} : item,
            ),
          );

          // Compress image
          const compressedUri = await compressImage(img.uri);
          if (!compressedUri) {
            throw new Error('Compression failed');
          }

          // Prepare FormData
          const formData = new FormData();
          formData.append('images', {
            uri: compressedUri,
            name: `image_${img.id}.jpg`,
            type: 'image/jpeg',
          } as any);

          // Upload
          const uploadedUrl: any = await uploadImages(formData, uploadParams);

          if (!uploadedUrl?.length) {
            throw new Error('Empty upload response');
          }

          // Update asset with uploaded URL
          setAssets(prev =>
            prev.map(item =>
              item.id === img.id
                ? {
                    ...item,
                    uploadedUrl: uploadedUrl[0],
                    status: 'success',
                  }
                : item,
            ),
          );

          return {id: img.id, success: true};
        } catch (err) {
          console.log('Upload failed for', img.uri, err);
          setAssets(prev =>
            prev.map(item =>
              item.id === img.id ? {...item, status: 'failed'} : item,
            ),
          );
          return {id: img.id, success: false, error: err};
        } finally {
          // Hide loader for this image
          setLoadingState(prev => ({...prev, [img.id]: false}));

          setImageUploadLoading(false);
        }
      }),
    );

    console.log('All upload results:', uploadResults);
  };

  const uploadFloorPlanLocal = async (plans: any[]) => {
    setImageUploadLoading(true);
    // Add selected images to state immediately for preview
    const assetsWithId = plans.map(img => ({
      ...img,
      id: img.uri,
      uploadedUrl: null,
    }));
    setFloorPlan(prev => [...prev, ...assetsWithId]);

    // Show loader for all images immediately
    const initialLoading: {[key: string]: boolean} = {};
    assetsWithId.forEach(img => (initialLoading[img.id] = true));
    setLoadingState(prev => ({...prev, ...initialLoading}));

    const uploadParams = {token, clientId, bearerToken};

    // Upload all images in parallel
    const uploadPromises = assetsWithId.map(async img => {
      try {
        // Compress
        const compressedUri = await compressImage(img.uri);

        if (!compressedUri) {
          return;
        }

        // Prepare FormData
        const formData = new FormData();
        formData.append('images', {
          uri: compressedUri,
          name: `floor_${img.id}.jpg`,
          type: 'image/jpeg',
        } as any);

        // Upload
        const uploadedUrl: any = await uploadImages(formData, uploadParams);

        if (uploadedUrl?.length) {
          // Update asset with uploaded URL immediately
          setFloorPlan(prev =>
            prev.map(item =>
              item.id === img.id
                ? {...item, uploadedUrl: uploadedUrl[0]}
                : item,
            ),
          );
        }
      } catch (err) {
        console.log('Upload failed for', img.uri, err);
      } finally {
        // Hide loader for this image
        setLoadingState(prev => ({...prev, [img.id]: false}));
      }
    });

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    setImageUploadLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const retryUpload = async (img: any) => {
    await uploadImagesLocal([img], true);
  };

  const previewsFloorPlan = useMemo(
    () => (
      <FlatList
        data={floorPlan}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItemFloor}
        contentContainerStyle={styles.previewRow}
      />
    ),
    [floorPlan, keyExtractor, renderItemFloor],
  );

  const {theme} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const [scrollY, setScrollY] = useState(0);

  const {height} = Dimensions.get('window');
  const CONTENT_HEIGHT = 2000; // your scrollable content height
  const visibleHeight = height;
  const indicatorHeight = (visibleHeight / CONTENT_HEIGHT) * visibleHeight;

  const scrollIndicatorPosition =
    (scrollY / (CONTENT_HEIGHT - visibleHeight)) *
    (visibleHeight - indicatorHeight);

  return (
    <SlideInView direction={currentStep === 4 ? 'right' : 'left'}>
      <Text style={[styles.headingText, {color: theme.colors.text}]}>
        Image Upload
      </Text>
      <View style={styles.inputContainer}>
        <CommonImageUploader
          onUpload={uploadImagesLocal}
          limit={assets.length >= 15 ? 0 : 15 - assets.length}
          label="Upload Property Images"
        />
        {touched?.imageUrls && errors?.imageUrls && (
          <Text style={styles.error}>{errors?.imageUrls}</Text>
        )}
        {previews}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={values?.videoUrl}
          onChangeText={text => {
            setFieldValue('videoUrl', text);
          }}
          placeholder="Video URL (YouTube)"
        />
      </View>

      {isStringInEitherArray('floorPlanUrls') && (
        <View style={styles.inputContainer}>
          <CommonImageUploader
            label="Upload Floor Plan"
            // uri => setFloorPlan(prev => [...prev, ...(uri ?? [])])
            onUpload={uploadFloorPlanLocal}
            limit={floorPlan.length >= 10 ? 0 : 10 - floorPlan.length}
          />
          {previewsFloorPlan}
        </View>
      )}

      {!items?._id && (
        <View style={[styles.inputContainer, {flexDirection: 'row'}]}>
          <View style={{width: '90%'}}>
            <CommonAmenityToggle
              label={
                // @ts-ignore
                String(price)
                  ? // @ts-ignore
                    'Featured Property (₹' + String(price) + ')'
                  : 'Featured Property '
              }
              selected={values.featured}
              onToggle={() => setFieldValue('featured', !values.featured)}
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowBoostPopup(true)}
            style={{
              justifyContent: 'center',
              alignContent: 'center',
              margin: 10,
            }}>
            <MaterialCommunityIcons
              name="information"
              size={30}
              color="#3d94ffff"
            />
          </TouchableOpacity>
        </View>
      )}

      {showBoostPopup && (
        <View style={styles.popupOverlay}>
          <View
            style={[
              styles.popupContainer,
              {backgroundColor: theme.colors.background},
            ]}>
            <Text style={[styles.popupTitle, {color: theme.colors.text}]}>
              Feature Your Ad
            </Text>
            <Text style={[styles.popupAmount, {color: theme.colors.text}]}>
              Amount: ₹{price ?? 'N/A'}
            </Text>
            {/* @ts-ignore */}
            {managePlansList?.[0].duration && (
              <Text
                style={[
                  styles.popupAmount,
                  {color: theme.colors.text, fontSize: 12},
                ]}>
                {/* @ts-ignore */}
                Package Availability: {managePlansList?.[0].duration} Days
              </Text>
            )}
            <Text
              style={[
                [styles.popupBenefits, {marginBottom: 5}],
                {color: theme.colors.text},
              ]}>
              Benefits:
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false} // hide native
              onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}
              scrollEventThrottle={16}
              indicatorStyle={isDarkMode ? 'black' : 'white'}
              style={{maxHeight: 200, padding: 10}}>
              {benifits.map(items => (
                <Text
                  key={items}
                  style={[styles.popupBenefits, {color: theme.colors.text}]}>
                  {'  '}• {items}
                </Text>
              ))}
            </ScrollView>
            {/* Custom Scroll Indicator */}
            <View style={styles.scrollBarTrack}>
              <View
                style={[
                  styles.scrollBarThumb,
                  {
                    height: 200,
                    transform: [{translateY: scrollIndicatorPosition}],
                  },
                ]}
              />
            </View>
            <View style={styles.popupActions}>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  setShowBoostPopup(false);
                  // makePayment(selectedAd._id);
                }}>
                <Text style={styles.continueButtonText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImagesSelected={setAssets}
      />
    </SlideInView>
  );
};

const styles = StyleSheet.create({
  scrollBarTrack: {
    position: 'absolute',
    right: 50,
    top: 0,
    bottom: 0,
    display: 'none',
    width: 8, // 🔹 track width
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    height: 50,
  },
  scrollBarThumb: {
    width: 8, // 🔹 indicator width
    backgroundColor: '#40DABE',
    borderRadius: 4,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  priceInputContainer: {
    padding: 5,
    width: '70%',
  },
  priceUnitContainer: {
    padding: 5,
    width: '30%',
  },
  inputContainer: {
    padding: 5,
  },
  headingText: {
    color: '#171717',
    fontFamily: Fonts.MEDIUM,
    fontSize: 20,
    margin: 10,
    marginTop: 20,
  },

  previewRow: {gap: 12},
  previewContainer: {
    position: 'relative',
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: -1,
    right: -1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 20,
  },
  error: {
    color: 'red',
    marginBottom: 2,
    marginTop: 3,
    left: 10,
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
  },

  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 999,
    borderRadius: 20,
  },
  popupContainer: {
    width: '90%',
    backgroundColor: '#000',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'teal',
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  popupAmount: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  popupBenefits: {
    fontSize: 13,
    color: '#555',
    marginBottom: 5,
  },
  popupActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#333',
  },
  continueButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2A9D8F',
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
  },
  continueButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

export default React.memo(Step5MediaUpload);
