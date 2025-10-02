import React, {useCallback, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Image from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '@theme/ThemeProvider';
import {Fonts} from '@constants/font';
import useBoundStore from '@stores/index';
// import {compressImage} from '../../helpers/ImageCompressor';
// import {uploadImages} from '@api/services';
// import Toast from 'react-native-toast-message';

interface Props {
  values: any;
  errors: any;
  touched: any;
  setFieldValue: any;
  currentStep: number;
  images: any[];
  floorPlans: any[];
  retryUpload: (item: any) => void;
  retryFloorPlanUpload: (item: any) => void;
  removeAsset: (uri: string) => void;
  removeFloor: (uri: string) => void;
  updateImageStatus: any;
  loadingStates: any;
}

const Step5MediaPreview: React.FC<Props> = ({
  values,
  setFieldValue,
  // updateImageStatus,
}) => {
  // let images = values.imageUrls;
  const {
    // token,
    // clientId,
    // bearerToken,
    // setIsUploadingFloorPlans,
    setImageUploadLoading,
    loadingStates,
    loadingStatesfloor,
    // setLoadingState,
    // removeLoadingState,
    isProcessingImages,
    isProcessingFloorPlan,
    isUploadingImages,
    // updateFloorPlanStatus,
    // setIsUploadingImages,
    isUploadingFloorPlans,
  } = useBoundStore();
  const {theme} = useTheme();

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

  // const retryUpload = useCallback(
  //   async (failedItem: any) => {
  //     // Set individual loading state
  //     setLoadingState(failedItem.id, true);

  //     // Check if this is the only upload in progress, if so enable global loading
  //     const hasOtherUploading = images.some(
  //       (item: {id: string | number; status: string}) =>
  //         item.id !== failedItem.id &&
  //         (item.status === 'uploading' ||
  //           (loadingStates[item.id]
  //             ? // @ts-ignore
  //               loadingStates[item.id].loading === false
  //               ? false
  //               : true
  //             : false)),
  //     );

  //     if (!hasOtherUploading && !isUploadingFloorPlans) {
  //       setIsUploadingImages(true);
  //     }

  //     try {
  //       const compressedUri = await compressImage(failedItem.uri);
  //       if (!compressedUri) {
  //         throw new Error('Compression failed');
  //       }

  //       const formData = new FormData();
  //       formData.append('images', {
  //         uri: compressedUri,
  //         name: `image_${failedItem.id}.jpg`,
  //         type: 'image/jpeg',
  //       } as any);

  //       const uploadParams = {token, clientId, bearerToken};
  //       const uploadedUrl: any = await uploadImages(formData, uploadParams);

  //       if (uploadedUrl?.length) {
  //         // Update asset with uploaded URL and mark as success
  //         // setAssets(prev =>
  //         //   prev.map(item =>
  //         //     item.id === failedItem.id
  //         //       ? {
  //         //           ...item,
  //         //           uploadedUrl: uploadedUrl[0],
  //         //           status: 'success',
  //         //         }
  //         //       : item,
  //         //   ),
  //         // );

  //         // Also update global store immediately
  //         // updateImageStatus(failedItem.id, 'success', uploadedUrl[0]);

  //         removeLoadingState(failedItem.id);
  //       } else {
  //         throw new Error('Empty upload response');
  //       }
  //     } catch (err) {
  //       console.log('Retry upload failed:', err);
  //       // Mark as failed
  //       // setAssets(prev =>
  //       //   prev.map(item =>
  //       //     item.id === failedItem.id ? {...item, status: 'failed'} : item,
  //       //   ),
  //       // );

  //       // Also update global store immediately
  //       updateImageStatus(failedItem.id, 'failed');

  //       removeLoadingState(failedItem.id);
  //     } finally {
  //       // Check if this was the last upload in progress
  //       const stillUploading = images.some(
  //         (item: {id: string | number; status: string}) =>
  //           item.id !== failedItem.id &&
  //           (item.status === 'uploading' ||
  //             // @ts-ignore
  //             !(loadingStates[item.id]?.success ?? false)),
  //       );

  //       if (!stillUploading) {
  //         setIsUploadingImages(false);
  //       }
  //     }
  //   },
  //   [
  //     setLoadingState,
  //     images,
  //     isUploadingFloorPlans,
  //     loadingStates,
  //     setIsUploadingImages,
  //     token,
  //     clientId,
  //     bearerToken,
  //     updateImageStatus,
  //     removeLoadingState,
  //   ],
  // );

  // // Retry function for failed floor plan uploads
  // const retryFloorPlanUpload = useCallback(
  //   async (failedItem: any) => {
  //     setLoadingState(failedItem.id, true);

  //     // Check if this is the only floor plan upload in progress
  //     const hasOtherUploading = floorPlans.some(
  //       item =>
  //         item.id !== failedItem.id &&
  //         (item.status === 'uploading' || loadingStates[item.id]),
  //     );

  //     if (!hasOtherUploading && !isUploadingImages) {
  //       setIsUploadingFloorPlans(true);
  //     }

  //     try {
  //       // Mark as uploading
  //       // setFloorPlan(prev =>
  //       //   prev.map(item =>
  //       //     item.id === failedItem.id ? {...item, status: 'uploading'} : item,
  //       //   ),
  //       // );

  //       const compressedUri = await compressImage(failedItem.uri);
  //       if (!compressedUri) {
  //         throw new Error('Compression failed');
  //       }

  //       const formData = new FormData();
  //       formData.append('images', {
  //         uri: compressedUri,
  //         name: `floor_${failedItem.id}.jpg`,
  //         type: 'image/jpeg',
  //       } as any);

  //       const uploadParams = {token, clientId, bearerToken};
  //       const uploadedUrl: any = await uploadImages(formData, uploadParams);

  //       if (uploadedUrl?.length) {
  //         updateFloorPlanStatus(failedItem.id, 'success', uploadedUrl[0]);
  //         // triggerUpdate();
  //       } else {
  //         throw new Error('Upload failed - no URL returned');
  //       }
  //     } catch (error) {
  //       console.error('Retry upload failed:', error);
  //       // Mark as failed again
  //       // setFloorPlan(prev =>
  //       //   prev.map(item =>
  //       //     item.id === failedItem.id ? {...item, status: 'failed'} : item,
  //       //   ),
  //       // );

  //       // Also update global store immediately
  //       updateFloorPlanStatus(failedItem.id, 'failed');

  //       // Trigger UI update to show error state immediately
  //       // triggerUpdate();

  //       Toast.show({
  //         type: 'error',
  //         text1: 'Retry failed',
  //         text2: 'Please try again',
  //         position: 'bottom',
  //       });
  //     } finally {
  //       removeLoadingState(failedItem.id);

  //       // Check if all floor plan uploads are complete
  //       const stillUploading = floorPlans.some(
  //         item =>
  //           item.id !== failedItem.id &&
  //           (item.status === 'uploading' || loadingStates[item.id]),
  //       );

  //       if (!stillUploading) {
  //         setIsUploadingFloorPlans(false);
  //       }
  //     }
  //   },
  //   [
  //     setLoadingState,
  //     floorPlans,
  //     isUploadingImages,
  //     loadingStates,
  //     setIsUploadingFloorPlans,
  //     token,
  //     clientId,
  //     bearerToken,
  //     updateFloorPlanStatus,
  //     removeLoadingState,
  //   ],
  // );

  const renderMediaItem = useCallback(
    (item: any, isFloorPlan = false) => {
      const key = item.id || item.uri || item;
      const stateData = isFloorPlan ? loadingStatesfloor : loadingStates;
      // const isLoading = loadingStates[key];
      // const hasError = item.status === 'failed';
      // const isSuccess = item.status === 'success';
      // @ts-ignore
      const isLoading = stateData[key]?.loading || false;
      // Treat undefined as false for hasError
      // @ts-ignore
      const hasError = item.id
        ? // @ts-ignore
          !stateData[item.id]?.success && !isLoading
        : false;

      // Treat undefined as false for isSuccess (safer)
      // @ts-ignore
      const isSuccess = stateData[item.id]?.success && !isLoading;

      return (
        <Pressable
          key={key}
          style={styles.previewContainer}
          // onPress={
          //   hasError
          //     ? () =>
          //         isFloorPlan ? retryFloorPlanUpload(item) : retryUpload(item)
          //     : undefined
          // }
        >
          <Image
            source={{uri: item?.uri || item}}
            style={styles.previewImage}
            resizeMode="cover"
          />
          {isLoading && (
            <View style={styles.overlay}>
              <ActivityIndicator color="#fff" size="small" />
            </View>
          )}
          {hasError && (
            <View style={[styles.overlay, styles.errorOverlay]}>
              <MaterialCommunityIcons
                name="information"
                size={24}
                color="#ff4444"
              />
              <Text style={styles.retryText}>Failed to upload</Text>
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
              onPress={() =>
                isFloorPlan
                  ? removeFloor(item?.uri || item)
                  : removeAsset(item?.uri || item)
              }>
              <Text style={styles.removeText}>✕</Text>
            </Pressable>
          )}
        </Pressable>
      );
    },
    [loadingStates, loadingStatesfloor, removeAsset, removeFloor],
  );

  useEffect(() => {
    const isAnyUploading =
      isUploadingImages ||
      isUploadingFloorPlans ||
      isProcessingImages ||
      isProcessingFloorPlan;
    setImageUploadLoading(isAnyUploading);
  }, [
    isUploadingImages,
    isUploadingFloorPlans,
    isProcessingImages,
    isProcessingFloorPlan,
    setImageUploadLoading,
  ]);

  useEffect(() => {
    console.log('plans loadingStates', loadingStatesfloor);
  }, [loadingStatesfloor]);

  const mediaList = useMemo(
    () => (
      <FlatList
        data={values.imageUrls}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => renderMediaItem(item)}
        keyExtractor={(item, idx) => item.id || item.uri || idx.toString()}
        contentContainerStyle={{gap: 12}}
      />
    ),
    [renderMediaItem, values],
  );

  const floorPlanList = useMemo(
    () => (
      <FlatList
        data={values.floorPlanUrl}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => renderMediaItem(item, true)}
        keyExtractor={(item, idx) => item.id || item.uri || idx.toString()}
        contentContainerStyle={{gap: 12}}
      />
    ),
    [renderMediaItem, values.floorPlanUrl],
  );

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          shadowColor: theme.colors.text,
        },
      ]}>
      <View style={[styles.card, {backgroundColor: theme.colors.background}]}>
        <Text style={[styles.cardLabel, {color: theme.colors.text}]}>
          Ad Title
        </Text>
        <Text style={[styles.cardValue, {color: theme.colors.text}]}>
          {values.title}
        </Text>
      </View>

      <View style={[styles.card, {backgroundColor: theme.colors.background}]}>
        <Text style={[styles.cardLabel, {color: theme.colors.text}]}>
          Description
        </Text>
        <Text style={[styles.cardValue, {color: theme.colors.text}]}>
          {values.description}
        </Text>
      </View>

      <View style={[styles.card, {backgroundColor: theme.colors.background}]}>
        <Text style={[styles.cardLabel, {color: theme.colors.text}]}>
          Images ({values?.imageUrls?.length})
        </Text>

        <>{mediaList}</>
      </View>

      {values?.floorPlanUrl?.length > 0 && (
        <View style={[styles.card, {backgroundColor: theme.colors.background}]}>
          <Text style={styles.cardLabel}>Floor Plans</Text>
          {floorPlanList}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 8},
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 16,
    textAlign: 'center',
  },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 6,
  },
  cardValue: {fontSize: 16, fontFamily: Fonts.MEDIUM},

  previewContainer: {
    position: 'relative',
    width: 90,
    height: 90,
    borderRadius: 12,
  },

  total: {
    marginBottom: 2,
    marginTop: 3,
    // left: 10,
    fontSize: 12,
    fontFamily: Fonts.BOLD,
    padding: 2,
  },
  previewImage: {width: '100%', height: '100%', borderRadius: 12},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  errorOverlay: {backgroundColor: 'rgba(255,68,68,0.2)'},
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 2,
  },
  removeBtn: {
    position: 'absolute',
    top: 1,
    right: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {color: '#fff', fontWeight: 'bold', fontSize: 14},
  videoLink: {fontSize: 14, textDecorationLine: 'underline'},
});

export default React.memo(Step5MediaPreview);
