import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, Text, FlatList, Pressable} from 'react-native';

import Image from 'react-native-fast-image';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import CommonImageUploader from '@components/Input/ImageUploader';
import ImagePickerModal from '@components/Modal/ImagePickerModal';
import ImageUploadSkeleton from '@components/SkeltonLoader/ImageUploadSkeleton';
import useBoundStore from '@stores/index';
import {useTheme} from '@theme/ThemeProvider';

const Step5MediaUpload = (props: any) => {
  const {values} = props;
  const {
    setImages,
    isProcessingImages,
    setIsProcessingImages,
    isProcessingFloorPlan,
    setIsProcessingFloorPlan,
    setIsUploadingImages,
    setIsUploadingFloorPlans,
  } = useBoundStore();

  const [modalVisible, setModalVisible] = useState(false);
  const {
    currentStep,
    // handleSubmit,
    errors,
    touched,
    // setTouched,
    setFieldValue,
    isStringInEitherArray,
  } = props;
  // Use global loading states from store instead of local state


  const removeAsset = useCallback(
    (uri: string | undefined) => {
      if (!uri) {
        return;
      }
      setFieldValue(
        'imageUrls',
        values.imageUrls.filter((item: any) =>
          item.uri ? item.uri !== uri : item !== uri,
        ),
      );
      // setImages(
      //   images.filter(item => (item.uri ? item.uri !== uri : item !== uri)),
      // );
    },
    [setFieldValue, values.imageUrls],
  );

  const removeFloor = useCallback(
    (uri: string | undefined) => {
      if (!uri) {
        return;
      }
       setFieldValue(
        'floorPlanUrl',
        values.floorPlanUrl.filter((item: any) =>
          item.uri ? item.uri !== uri : item !== uri,
        ),
      );
    },
    [setFieldValue, values.floorPlanUrl],
  );

  const renderItem = useCallback(
    ({item}: {item: any}) => {
      return (
        <Pressable style={styles.previewContainer}>
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
          <Pressable
            style={styles.removeBtn}
            onPress={() => removeAsset(item?.uri || item)}>
            <Text style={styles.removeText}>✕</Text>
          </Pressable>
        </Pressable>
      );
    },
    [removeAsset],
  );

  const renderItemFloor = useCallback(
    ({item}: {item: any}) => {
      return (
        <Pressable style={styles.previewContainer}>
          <Image
            source={{
              uri: item?.uri || item,
              cache: Image.cacheControl.immutable,
            }}
            style={styles.preview}
            resizeMode="cover"
          />
          <Pressable
            style={styles.removeBtn}
            onPress={() => removeFloor(item?.uri || item)}>
            <Text style={styles.removeText}>✕</Text>
          </Pressable>
          {/* )} */}
        </Pressable>
      );
    },
    [removeFloor],
  );

  const keyExtractor = useCallback(
    (item: any, index: number) =>
      item.uri ?? item.fileName ?? `${item.id || index}`,
    [],
  );
  useEffect(() => {
    setFieldValue('showLoanOffers', isStringInEitherArray('loanEligible'));
    setFieldValue('showEmiCalculator', isStringInEitherArray('loanEligible'));
  }, [isStringInEitherArray, setFieldValue]);

  // Handle picker opening - show skeleton immediately
  const handlePickerOpen = useCallback(() => {
    setIsProcessingImages(true);
  }, [setIsProcessingImages]);

  // Handle picker closing without selection
  const handlePickerClose = useCallback(() => {
    setIsProcessingImages(false);
  }, [setIsProcessingImages]);

  const previews = useMemo(
    () => (
      <FlatList
        data={values.imageUrls}
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
    [keyExtractor, renderItem, values],
  );

  const uploadImagesLocal = async (imgs: any[]) => {
    if (!imgs || imgs.length === 0) {
      setIsProcessingImages(false);
      return;
    }
    // Update processing count to actual number of images
    setIsUploadingImages(true); // Use separate state for images
    const assetsWithId = imgs.map(img => ({
      ...img,
      id: img.uri,
      uploadedUrl: null,
      status: 'queued', // status: queued | uploading | success | failed
    }));
    setIsProcessingImages(false);
    setFieldValue('imageUrls', [...values.imageUrls, ...assetsWithId]);
    setIsUploadingImages(false);
  };

  const uploadFloorPlanLocal = async (plans: any[]) => {
      setIsProcessingFloorPlan(false);
    if (!plans || plans.length === 0) {
      return;
    }
    setIsUploadingFloorPlans(true);
    const assetsWithId = plans.map(img => ({
      ...img,
      id: img.uri,
      uploadedUrl: null,
      status: 'queued', // status: queued | uploading | success | failed
    }));

    setIsUploadingFloorPlans(false);
    setFieldValue('floorPlanUrl', [...values.floorPlanUrl, ...assetsWithId]);
  };

  const previewsFloorPlan = useMemo(
    () => (
      <FlatList
        data={values.floorPlanUrl}
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
    [keyExtractor, renderItemFloor, values.floorPlanUrl],
  );

  const {theme} = useTheme();

  return (
    <SlideInView direction={currentStep === 1 ? 'right' : 'left'}>
      <Text style={[styles.headingText, {color: theme.colors.text}]}>
        Image Upload
      </Text>
      <View style={styles.inputContainer}>
        <CommonImageUploader
          onUpload={uploadImagesLocal}
          // handleOnpress={()=>setModalVisible(true)}
          onPickerOpen={handlePickerOpen}
          onPickerClose={handlePickerClose}
          limit={
            values.imageUrls.length >= 15 ? 0 : 15 - values.imageUrls.length
          }
          totalLimit={15}
          maxFileSize={30}
          label="Upload Property Images"
        />
        {!isProcessingImages && touched?.imageUrls && errors?.imageUrls && (
          <Text style={styles.error}>{errors?.imageUrls}</Text>
        )}
        {isProcessingImages && values.imageUrls.length <= 0 ? (
          <ImageUploadSkeleton count={4} horizontal />
        ) : (
          <>
            {values?.imageUrls?.length > 0 && (
              <Text style={[styles.total, {color: theme.colors.text}]}>
                Total Images ({values?.imageUrls?.length})
              </Text>
            )}
            {previews}
          </>
        )}
      </View>

      {isStringInEitherArray('floorPlanUrls') && (
        <>
          <Text style={[styles.headingText, {color: theme.colors.text}]}>
            Floor plan Upload
          </Text>
          <View style={styles.inputContainer}>
            <CommonImageUploader
              label="Upload Floor Plan"
              onUpload={uploadFloorPlanLocal}
              onPickerOpen={() => {
                setIsProcessingFloorPlan(true);
              }}
              totalLimit={10}
              onPickerClose={() => {
                setIsProcessingFloorPlan(false);
              }}
              maxFileSize={30}
              limit={
                values?.floorPlanUrl.length >= 10
                  ? 0
                  : 10 - values?.floorPlanUrl.length
              }
            />
            {isProcessingFloorPlan && values?.floorPlanUrl.length <= 0 ? (
              <ImageUploadSkeleton count={4} horizontal />
            ) : (
              <>
                {values?.floorPlanUrl?.length > 0 && (
                  <Text style={[styles.total, {color: theme.colors.text}]}>
                    Floor plans ({values?.floorPlanUrl?.length})
                  </Text>
                )}
                {previewsFloorPlan}
              </>
            )}
          </View>
        </>
      )}

      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImagesSelected={setImages}
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
  total: {
    fontSize: 12,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 6,
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
