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
import ImageUploadSkeleton from '@components/SkeltonLoader/ImageUploadSkeleton';
import useBoundStore from '@stores/index';
import CommonAmenityToggle from '@components/Input/amenityToggle';
import {useTheme} from '@theme/ThemeProvider';
import {useRoute} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {compressImage} from '../../helpers/ImageCompressor';
import RNFS from 'react-native-fs';

import {uploadImages} from '@api/services';
import Toast from 'react-native-toast-message';

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
  // Separate states for images and floor plans
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isProcessingFloorPlan, setIsProcessingFloorPlan] = useState(false);
  const [processingImageCount, setProcessingImageCount] = useState(0);
  const [processingFloorPlanCount, setProcessingFloorPlanCount] = useState(0);

  // Separate upload loading states
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isUploadingFloorPlans, setIsUploadingFloorPlans] = useState(false);

  // Communicate skeleton loading state to parent
  useEffect(() => {
    const isSkeletonShowing = isProcessingImages || isProcessingFloorPlan;
    if (props.onSkeletonStateChange) {
      props.onSkeletonStateChange(isSkeletonShowing);
    }
  }, [isProcessingImages, isProcessingFloorPlan, props]);

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

  // Update global imageUploadLoading based on both upload states
  useEffect(() => {
    const isAnyUploading = isUploadingImages || isUploadingFloorPlans;
    setImageUploadLoading(isAnyUploading);
  }, [isUploadingImages, isUploadingFloorPlans, setImageUploadLoading]);

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
      const hasError = item?.status === 'failed';
      const isSuccess = item?.status === 'success';

      return (
        <Pressable
          style={styles.previewContainer}
          onPress={hasError ? () => retryUpload(item) : undefined}>
          <Image
            source={{
              uri: item?.uri || item,
              cache: Image.cacheControl.immutable,
            }}
            style={styles.preview}
            resizeMode="cover"
            onError={() => {
              console.log('Image failed to load:', item?.uri || item);
            }}
          />
          {isLoading && (
            <View style={styles.overlay}>
              <ActivityIndicator color={'#ffff'} size="small" />
            </View>
          )}
          {hasError && (
            <View style={[styles.overlay, styles.errorOverlay]}>
              <MaterialCommunityIcons
                name="refresh"
                size={24}
                color="#ff4444"
              />
              <Text style={styles.retryText}>Tap to retry</Text>
            </View>
          )}
          {isSuccess && (
            <View style={styles.successBadge}>
              <MaterialCommunityIcons
                name="check-circle"
                size={16}
                color="#4CAF50"
              />
            </View>
          )}
          {!isLoading && (
            <Pressable
              style={styles.removeBtn}
              onPress={() => removeAsset(item?.uri || item)}>
              <Text style={styles.removeText}>✕</Text>
            </Pressable>
          )}
        </Pressable>
      );
    },
    // @ts-ignore
    [loadingState, removeAsset, retryUpload],
  );

  // Retry function for failed floor plan uploads
  const retryFloorPlanUpload = useCallback(
    async (failedItem: any) => {
      setLoadingState(prev => ({...prev, [failedItem.id]: true}));

      // Check if this is the only floor plan upload in progress
      const hasOtherUploading = floorPlan.some(
        item =>
          item.id !== failedItem.id &&
          (item.status === 'uploading' || loadingState[item.id]),
      );

      if (!hasOtherUploading && !isUploadingImages) {
        setIsUploadingFloorPlans(true);
      }

      try {
        // Mark as uploading
        setFloorPlan(prev =>
          prev.map(item =>
            item.id === failedItem.id ? {...item, status: 'uploading'} : item,
          ),
        );

        const compressedUri = await compressImage(failedItem.uri);
        if (!compressedUri) {
          throw new Error('Compression failed');
        }

        const formData = new FormData();
        formData.append('images', {
          uri: compressedUri,
          name: `floor_${failedItem.id}.jpg`,
          type: 'image/jpeg',
        } as any);

        const uploadParams = {token, clientId, bearerToken};
        const uploadedUrl: any = await uploadImages(formData, uploadParams);

        if (uploadedUrl?.length) {
          // Update with uploaded URL and mark as success
          setFloorPlan(prev =>
            prev.map(item =>
              item.id === failedItem.id
                ? {
                    ...item,
                    uploadedUrl: uploadedUrl[0],
                    status: 'success',
                  }
                : item,
            ),
          );
        } else {
          throw new Error('Upload failed - no URL returned');
        }
      } catch (error) {
        console.error('Retry upload failed:', error);
        // Mark as failed again
        setFloorPlan(prev =>
          prev.map(item =>
            item.id === failedItem.id ? {...item, status: 'failed'} : item,
          ),
        );

        Toast.show({
          type: 'error',
          text1: 'Retry failed',
          text2: 'Please try again',
          position: 'bottom',
        });
      } finally {
        setLoadingState(prev => ({...prev, [failedItem.id]: false}));

        // Check if all floor plan uploads are complete
        const stillUploading = floorPlan.some(
          item =>
            item.id !== failedItem.id &&
            (item.status === 'uploading' || loadingState[item.id]),
        );

        if (!stillUploading) {
          setIsUploadingFloorPlans(false);
        }
      }
    },
    [floorPlan, loadingState, isUploadingImages, token, clientId, bearerToken],
  );

  const renderItemFloor = useCallback(
    ({item}: {item: any}) => {
      const isLoading = loadingState[item?.uri || item];
      const hasError = item.status === 'failed';
      const isSuccess = item.status === 'success' && item.uploadedUrl;

      return (
        <Pressable
          style={styles.previewContainer}
          onPress={hasError ? () => retryFloorPlanUpload(item) : undefined}>
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
              <ActivityIndicator color={'#ffff'} size="small" />
            </View>
          )}
          {hasError && (
            <View style={[styles.overlay, styles.errorOverlay]}>
              <MaterialCommunityIcons
                name="refresh"
                size={24}
                color="#ff4444"
              />
              <Text style={styles.retryText}>Tap to retry</Text>
            </View>
          )}
          {isSuccess && (
            <View style={styles.successBadge}>
              <MaterialCommunityIcons
                name="check-circle"
                size={16}
                color="#4CAF50"
              />
            </View>
          )}
          {!isLoading && (
            <Pressable
              style={styles.removeBtn}
              onPress={() => removeFloor(item?.uri || item)}>
              <Text style={styles.removeText}>✕</Text>
            </Pressable>
          )}
        </Pressable>
      );
    },
    [loadingState, removeFloor, retryFloorPlanUpload],
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
    (item: any, index: number) =>
      item.uri ?? item.fileName ?? `${item.id || index}`,
    [],
  );
  useEffect(() => {
    setFieldValue('showLoanOffers', isStringInEitherArray('loanEligible'));
    setFieldValue('showEmiCalculator', isStringInEitherArray('loanEligible'));
  }, [isStringInEitherArray, setFieldValue]);
  // Retry function for failed uploads
  const retryUpload = useCallback(
    async (failedItem: any) => {
      // Set individual loading state
      setLoadingState(prev => ({...prev, [failedItem.id]: true}));

      // Check if this is the only upload in progress, if so enable global loading
      const hasOtherUploading = assets.some(
        item =>
          item.id !== failedItem.id &&
          (item.status === 'uploading' || loadingState[item.id]),
      );

      if (!hasOtherUploading && !isUploadingFloorPlans) {
        setIsUploadingImages(true);
      }

      try {
        // Mark as uploading
        setAssets(prev =>
          prev.map(item =>
            item.id === failedItem.id ? {...item, status: 'uploading'} : item,
          ),
        );

        const compressedUri = await compressImage(failedItem.uri);
        if (!compressedUri) {
          throw new Error('Compression failed');
        }

        const formData = new FormData();
        formData.append('images', {
          uri: compressedUri,
          name: `image_${failedItem.id}.jpg`,
          type: 'image/jpeg',
        } as any);

        const uploadParams = {token, clientId, bearerToken};
        const uploadedUrl: any = await uploadImages(formData, uploadParams);

        if (uploadedUrl?.length) {
          // Update with uploaded URL and mark as success
          setAssets(prev =>
            prev.map(item =>
              item.id === failedItem.id
                ? {
                    ...item,
                    uploadedUrl: uploadedUrl[0],
                    status: 'success',
                  }
                : item,
            ),
          );
        } else {
          throw new Error('Upload failed - no URL returned');
        }
      } catch (error) {
        console.error('Retry upload failed:', error);
        // Mark as failed again
        setAssets(prev =>
          prev.map(item =>
            item.id === failedItem.id ? {...item, status: 'failed'} : item,
          ),
        );

        Toast.show({
          type: 'error',
          text1: 'Upload failed',
          text2: 'Tap the image to retry',
          position: 'bottom',
        });
      } finally {
        setLoadingState(prev => ({...prev, [failedItem.id]: false}));

        // Check if all image uploads are complete
        const stillUploading = assets.some(
          item =>
            item.id !== failedItem.id &&
            (item.status === 'uploading' || loadingState[item.id]),
        );

        if (!stillUploading) {
          setIsUploadingImages(false);
        }
      }
    },
    [assets, loadingState, isUploadingFloorPlans, token, clientId, bearerToken],
  );

  // Handle picker opening - show skeleton immediately
  const handlePickerOpen = useCallback(() => {
    setIsProcessingImages(true);
    setProcessingImageCount(5); // Show 5 skeleton items
  }, []);

  // Handle picker closing without selection
  const handlePickerClose = useCallback(() => {
    setIsProcessingImages(false);
    setProcessingImageCount(0);
  }, []);

  const previews = useMemo(
    () => (
      <FlatList
        data={assets}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={styles.previewRow}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: 92, // 80 + 12 gap
          offset: 92 * index,
          index,
        })}
      />
    ),
    [assets, keyExtractor, renderItem],
  );

  const uploadImagesLocal = async (images: any[]) => {
    if (!images || images.length === 0) {
      setIsProcessingImages(false);
      setProcessingImageCount(0);
      return;
    }

    // Update processing count to actual number of images
    setProcessingImageCount(images.length);
    setIsUploadingImages(true); // Use separate state for images

    try {
      // 1️⃣ Add selected images to state for immediate preview after a brief delay
      const assetsWithId = images.map(img => ({
        ...img,
        id: img.uri,
        uploadedUrl: null,
        status: 'queued', // status: queued | uploading | success | failed
      }));

      // Wait a bit to show skeleton, then show actual previews
      await new Promise(resolve => setTimeout(resolve, 800));

      // Stop skeleton and show actual previews
      setIsProcessingImages(false);
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
            const statsdata = await RNFS.stat(img.uri);
            const sizeInMBData = Number(statsdata.size) / (1024 * 1024);

            console.log(`Real size: ${sizeInMBData.toFixed(2)} MB`);
            // Mark as uploading
            setAssets(prev =>
              prev.map(item =>
                item.id === img.id ? {...item, status: 'uploading'} : item,
              ),
            );

            // Compress image
            const compressedUri = await compressImage(img.uri);
            const stats = await RNFS.stat(compressedUri);
            const sizeInMB = Number(stats.size) / (1024 * 1024);

            console.log(`Compressed size: ${sizeInMB.toFixed(2)} MB`);
            if (!compressedUri) {
              throw new Error('Compression failed');
            }

            // Note: File size is already checked at picker level (30MB limit)
            // This compression is for optimization during upload

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
            setAssets(prev =>
              prev.map(item =>
                item.id === img.id ? {...item, status: 'failed'} : item,
              ),
            );
            return {id: img.id, success: false, error: err};
          } finally {
            // Hide loader for this image
            setLoadingState(prev => ({...prev, [img.id]: false}));
            // Don't set imageUploadLoading to false here - let the main function handle it
          }
        }),
      );

      console.log('All upload results:', uploadResults);

      // Set image upload loading to false after ALL image uploads are complete
      setIsUploadingImages(false);
    } catch (error) {
      console.error('Upload error:', error);
      setIsProcessingImages(false);
      setIsUploadingImages(false); // Use separate state for images
      Toast.show({
        type: 'error',
        text1: 'Upload failed',
        text2: 'Please try again',
        position: 'bottom',
      });
    }
  };

  const uploadFloorPlanLocal = async (plans: any[]) => {
    if (!plans || plans.length === 0) {
      setIsProcessingFloorPlan(false);
      setProcessingFloorPlanCount(0);
      return;
    }

    // Show skeleton immediately when upload function is called
    setIsProcessingFloorPlan(true);
    setProcessingFloorPlanCount(plans.length);
    setIsUploadingFloorPlans(true); // Use separate state for floor plans

    // Small delay to ensure skeleton is visible
    await new Promise(resolve => setTimeout(resolve, 300));

    // Add selected images to state immediately for preview
    const assetsWithId = plans.map(img => ({
      ...img,
      id: img.uri,
      uploadedUrl: null,
      status: 'queued', // status: queued | uploading | success | failed
    }));

    setIsProcessingFloorPlan(false);
    setFloorPlan(prev => [...prev, ...assetsWithId]);

    // Show loader for all images immediately
    const initialLoading: {[key: string]: boolean} = {};
    assetsWithId.forEach(img => (initialLoading[img.id] = true));
    setLoadingState(prev => ({...prev, ...initialLoading}));

    const uploadParams = {token, clientId, bearerToken};

    // Upload all images in parallel
    const uploadPromises = assetsWithId.map(async img => {
      try {
        // Mark as uploading
        setFloorPlan(prev =>
          prev.map(item =>
            item.id === img.id ? {...item, status: 'uploading'} : item,
          ),
        );

        // Compress
        const compressedUri = await compressImage(img.uri);

        if (!compressedUri) {
          // Mark as failed
          setFloorPlan(prev =>
            prev.map(item =>
              item.id === img.id ? {...item, status: 'failed'} : item,
            ),
          );
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
          // Update asset with uploaded URL and mark as success
          setFloorPlan(prev =>
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
        } else {
          // Mark as failed if no URL returned
          setFloorPlan(prev =>
            prev.map(item =>
              item.id === img.id ? {...item, status: 'failed'} : item,
            ),
          );
        }
      } catch (err) {
        console.log('Upload failed for', img.uri, err);
        // Mark as failed
        setFloorPlan(prev =>
          prev.map(item =>
            item.id === img.id ? {...item, status: 'failed'} : item,
          ),
        );
      } finally {
        // Hide loader for this image
        setLoadingState(prev => ({...prev, [img.id]: false}));
      }
    });

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    setIsUploadingFloorPlans(false); // Use separate state for floor plans
    setIsProcessingFloorPlan(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const retryUpload = async (img: any) => {
  //   await uploadImagesLocal([img]);
  // };

  const previewsFloorPlan = useMemo(
    () => (
      <FlatList
        data={floorPlan}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItemFloor}
        contentContainerStyle={styles.previewRow}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: 92, // 80 + 12 gap
          offset: 92 * index,
          index,
        })}
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
          onPickerOpen={handlePickerOpen}
          onPickerClose={handlePickerClose}
          limit={assets.length >= 15 ? 0 : 15 - assets.length}
          totalLimit={15}
          maxFileSize={30}
          label="Upload Property Images (Max 30MB each)"
        />
        {touched?.imageUrls && errors?.imageUrls && (
          <Text style={styles.error}>{errors?.imageUrls}</Text>
        )}
        {isProcessingImages ? (
          <ImageUploadSkeleton
            count={Math.min(processingImageCount, 5)}
            horizontal
          />
        ) : (
          previews
        )}
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
            label="Upload Floor Plan (Max 30MB each)"
            onUpload={uploadFloorPlanLocal}
            onPickerOpen={() => {
              setIsProcessingFloorPlan(true);
              setProcessingFloorPlanCount(3);
            }}
            onPickerClose={() => {
              setIsProcessingFloorPlan(false);
              setProcessingFloorPlanCount(0);
            }}
            maxFileSize={30}
            limit={floorPlan.length >= 10 ? 0 : 10 - floorPlan.length}
          />
          {isProcessingFloorPlan ? (
            <ImageUploadSkeleton
              count={Math.min(processingFloorPlanCount, 3)}
              horizontal
            />
          ) : (
            previewsFloorPlan
          )}
        </View>
      )}

      {!items?._id && (
        <View style={[styles.inputContainer, styles.featuredContainer]}>
          <View style={styles.featuredToggleContainer}>
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
            style={styles.infoButton}>
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
              style={styles.benefitsScrollView}>
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
  // New styles for better organization
  featuredContainer: {
    flexDirection: 'row',
  },
  featuredToggleContainer: {
    width: '90%',
  },
  infoButton: {
    justifyContent: 'center',
    alignContent: 'center',
    margin: 10,
  },
  benefitsScrollView: {
    maxHeight: 200,
    padding: 10,
  },
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
  errorOverlay: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
  },
  retryText: {
    color: '#ff4444',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  successBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 2,
  },
  continueButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

export default React.memo(Step5MediaUpload);
