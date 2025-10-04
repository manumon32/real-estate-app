/* eslint-disable react-native/no-inline-styles */
import Stepper from '@components/stepper';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {postAdAPI, uploadImages} from '@api/services';
import {useTheme} from '@theme/ThemeProvider';
import CommonHeader from '@components/Header/CommonHeader';
import {RequestMethod} from '@api/request';
import {startCheckoutPromise} from '@screens/ManagePlan/checkout';
import SuccessModal from '@components/Modal/SuccessModal';
import useBoundStore from '@stores/index';
import Step1BasicInfo from './step1BasicInfo';
import Step2 from './step2PriceDetails';
import Step3LocationDetails from './step3LocationDetails';
import Step4PropertyDetails from './step4PropertyDetails';
import Step5MediaUpload from './step5MediaUpload';
import Preview from './preview';
import Step2MediaUpload from './step2MediaUpload';
import {compressImage} from '../../helpers/ImageCompressor';
import {uploadWithQueue} from '../../helpers/apiHelper';

interface FooterProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  onCancel?: () => void;
  onNext?: () => void;
  onBackPress: any;
  submitPostAd?: any;
  loading?: boolean;
  values: any;
  imageUploadLoading: boolean;
  isSkeletonLoading: boolean;
  isProcessingImages: boolean;
  isProcessingFloorPlan: boolean;
}

const LAST_STEP = 6;

const Footer: React.FC<FooterProps> = ({
  currentStep,
  setCurrentStep,
  isFirstStep = false,
  isLastStep = false,
  onCancel,
  onNext,
  onBackPress,
  submitPostAd,
  loading = false,
  values,
  imageUploadLoading,
  isSkeletonLoading,
  isProcessingImages,
  isProcessingFloorPlan,
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      if (currentStep == 1) {
        onBackPress();
      }
      currentStep !== 1 && setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  };

  const handleNext = () => {
    // Only prevent final submission if images are uploading, allow navigation between steps
    if (
      currentStep === LAST_STEP &&
      (imageUploadLoading || isSkeletonLoading)
    ) {
      return;
    }

    if (currentStep === LAST_STEP) {
      !imageUploadLoading &&
        setTimeout(() => {
          submitPostAd();
        }, 300);
    }
    if (onNext) {
      onNext();
    } else {
      currentStep !== LAST_STEP && setCurrentStep(prev => prev + 1);
    }
  };

  const {theme} = useTheme();
  return (
    <View style={[styles.footer, {backgroundColor: theme.colors.background}]}>
      <TouchableOpacity
        onPress={handleCancel}
        style={styles.chatButton}
        accessibilityRole="button"
        disabled={isFirstStep}>
        <Text style={styles.chatText}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleNext}
        style={[
          styles.buyButton,
          currentStep === LAST_STEP &&
            (imageUploadLoading || isSkeletonLoading) &&
            styles.buyButtonDisabled,
          currentStep === 2 &&
            (isProcessingImages || isProcessingFloorPlan) &&
            styles.buyButtonDisabled,
        ]}
        accessibilityRole="button"
        disabled={
          isLastStep ||
          (currentStep === LAST_STEP &&
            (imageUploadLoading || isSkeletonLoading)) ||
          (currentStep === 2 && (isProcessingImages || isProcessingFloorPlan))
        }>
        <Text style={styles.buyText}>
          {(loading ||
            (currentStep === LAST_STEP &&
              (imageUploadLoading || isSkeletonLoading))) && (
            <ActivityIndicator size={'small'} color={'#fff'} />
          )}
          {!loading && !(currentStep === LAST_STEP && imageUploadLoading)
            ? currentStep === LAST_STEP
              ? values.id
                ? 'Update'
                : 'Post Now'
              : currentStep === 2 &&
                (isProcessingImages || isProcessingFloorPlan)
              ? 'Loading..'
              : 'Next'
            : isSkeletonLoading
            ? 'Processing...'
            : imageUploadLoading
            ? 'Uploading'
            : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const PostAdContainer = (props: any) => {
  const {
    errors,
    setTouched,
    setFieldValue,
    values,
    fields,
    setFields,
    validateForm,
    resetForm,
  } = props;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [visible, setVisible] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(true);
  const [preview, setPreview] = useState(false);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(false);
  const [locationFlag, setLocationFlag] = useState(false);
  const prevCountRef = useRef<number | null>(null);

  const {
    setPostAd,
    resetPostAd,
    postAd,
    token,
    clientId,
    bearerToken,
    locationForAdpost,
    managePlansList,
    imageUploadLoading,
    loadingStates,
    loadingStatesfloor,
    fetchPlans,
    user,
    setImages,
    setadPostModal,
    setlocationModalVisible,
    setFloorPlans,
    setIsProcessingImages,
    setLoadingState,
    setLoadingStateFloor,
    setIsUploadingImages,
    clearAllLoadingStates,
    setIsProcessingFloorPlan,
    setIsUploadingFloorPlans,
    isUploadingImages,
    isUploadingFloorPlans,
    isProcessingImages,
    isProcessingFloorPlan,
    setImageUploadLoading,
  } = useBoundStore();
  const prevStep = prevCountRef.current;
  const {theme} = useTheme();
  const handleSkeletonStateChange = useCallback((isLoading: boolean) => {
    setIsSkeletonLoading(isLoading);
  }, []);

  const getMergedFields = useCallback(
    (id: any, argFields: string[]) => {
      setFields((prev: any) => {
        const newMap: any = {...prev};
        newMap[id] = argFields;
        return newMap;
      });
    },
    [setFields],
  );

  const isStringInEitherArray = (value: string): boolean => {
    const mergedUnique = [...new Set(Object.values(fields).flat())];
    return mergedUnique.length <= 0 ? true : mergedUnique?.includes(value);
  };

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
    setImageUploadLoading,
    isProcessingImages,
    isProcessingFloorPlan,
  ]);

  const toggleItem = useCallback(
    (name: string, item: any, setSelectedList?: any) => {
      if (name) {
        if (postAd[name] && postAd[name][0] === item) {
          delete postAd[name];
          setFieldValue(name, null);
        } else {
          postAd[name] = [item];
          setFieldValue(name, item);
        }
        setPostAd({...postAd});
      } else {
        setSelectedList((prev: any) => {
          return prev?.includes(item)
            ? prev.filter((i: any) => i !== item)
            : [...prev, item];
        });
      }
    },
    [postAd, setPostAd, setFieldValue],
  );
  const renderChips = useCallback(
    (items: any[], selected?: any, setSelected?: any) => {
      return (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          ref={ref => {
            if (ref) {
              // scrollRefs.current[] = ref;
            }
          }}
          showsHorizontalScrollIndicator={false}
          horizontal
          style={styles.chipContainer}>
          {items.map((item: any, index: any) => {
            const newselected = item.filterName
              ? postAd?.[item.filterName]
              : selected;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chip,
                  newselected?.includes(String(item._id)) &&
                    styles.chipSelected,
                ]}
                onPress={() => {
                  item.fields && getMergedFields(item.filterName, item.fields);
                  toggleItem(item.filterName, item._id, setSelected);
                }}>
                <Text
                  style={
                    newselected?.includes(item._id)
                      ? styles.chipTextSelected
                      : [styles.chipText, {color: theme.colors.text}]
                  }>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      );
    },
    [postAd, theme, getMergedFields, toggleItem],
  );

  const checkErrors = async () => {
    const requiredFields = {
      1: ['title', 'description', 'propertyTypeId', 'listingTypeId'],
      2: ['imageUrls'],
      3: ['price'],
      4: ['areaSize'],
      5: [],
      6: [],
    };

    // Mark fields as touched
    await setTouched(
      // @ts-ignore
      requiredFields[currentStep]?.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as {[key: string]: boolean}),
      false, // don't validate immediately
    );

    // Force validation to get fresh errors
    const validationErrors = await validateForm();
    prevCountRef.current = currentStep;

    // Check if current step has any errors
    // @ts-ignore
    const hasErrors = requiredFields[currentStep]?.some(
      (field: any) => !!validationErrors[field],
    );

    if (!hasErrors) {
      if (currentStep === 4 && !locationFlag) {
        Alert.alert(
          'Selected Location is',
          locationForAdpost?.name ?? values.address,
          [
            {
              text: 'Change',
              onPress: () => {
                setLocationFlag(true);
                setadPostModal();
                setTimeout(() => {
                  setlocationModalVisible();
                }, 300);
              },
            },
            {
              text: 'Continue',
              onPress: () => {
                setLocationFlag(true);
                currentStep < LAST_STEP && setCurrentStep(prev => prev + 1);
                return false;
              },
            },
          ],
        );
      } else {
        currentStep === 2 && uploadImagesLocal(values.imageUrls);
        currentStep === 2 && uploadFloorPlanLocal(values.floorPlanUrl);
        currentStep < LAST_STEP && setCurrentStep(prev => prev + 1);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            currentStep={prevStep}
            isStringInEitherArray={isStringInEitherArray}
            getMergedFields={getMergedFields}
            toggleItem={toggleItem}
            renderChips={renderChips}
            {...props}
          />
        );

      case 2:
        return (
          <Step2MediaUpload
            currentStep={prevStep}
            isStringInEitherArray={isStringInEitherArray}
            getMergedFields={getMergedFields}
            toggleItem={toggleItem}
            renderChips={renderChips}
            onSkeletonStateChange={handleSkeletonStateChange}
            {...props}
          />
        );
      case 3:
        return (
          <Step2
            currentStep={prevStep}
            isStringInEitherArray={isStringInEitherArray}
            getMergedFields={getMergedFields}
            toggleItem={toggleItem}
            renderChips={renderChips}
            {...props}
          />
        );
      case 4:
        return (
          <Step3LocationDetails
            currentStep={prevStep}
            isStringInEitherArray={isStringInEitherArray}
            getMergedFields={getMergedFields}
            toggleItem={toggleItem}
            renderChips={renderChips}
            {...props}
          />
        );
      case 5:
        return (
          <Step4PropertyDetails
            currentStep={prevStep}
            isStringInEitherArray={isStringInEitherArray}
            getMergedFields={getMergedFields}
            {...props}
          />
        );
      case 6:
        return (
          <Step5MediaUpload
            currentStep={prevStep}
            isStringInEitherArray={isStringInEitherArray}
            getMergedFields={getMergedFields}
            toggleItem={toggleItem}
            renderChips={renderChips}
            onSkeletonStateChange={handleSkeletonStateChange}
            updateImageStatus={updateImageStatus}
            {...props}
          />
        );
      default:
        return null;
    }
  };

  const onBackPress: any = useCallback(() => {
    Alert.alert('Quit without saving?', 'You will lose your progress.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Quit',
        onPress: () => {
          resetPostAd();
          setFields([]);
          setImages([]);
          setFloorPlans([]);
          navigation.goBack();
          return false;
        },
      },
    ]);
    return true;
  }, [navigation, resetPostAd, setFields, setFloorPlans, setImages]);

  /** Double back press exit */
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => backHandler.remove();
    }, [onBackPress]),
  );

  const submitPostAd = useCallback(async () => {
    let mediaImages = values.imageUrls;
    let floorPlans = values.floorPlanUrl;
    if (
      Object.keys(errors).length > 0 ||
      mediaImages.length === 0 ||
      imageUploadLoading
    ) {
      if (mediaImages.length === 0 || mediaImages.length > 10) {
        Toast.show({
          type: 'error',
          text1:
            mediaImages.length === 0
              ? 'Please select at least one image.'
              : 'You can only select up to 10 images',
          position: 'bottom',
        });
      } else if (imageUploadLoading) {
        Toast.show({
          type: 'info',
          text1: 'Please wait images are being uploaded',
          position: 'bottom',
        });
      }
      return;
    }
    setLoading(true);

    try {
      const uploadParams = {token, clientId, bearerToken};

      const finalLocation = {
        latitude: locationForAdpost.lat,
        longitude: locationForAdpost.lng,
        address: locationForAdpost.name,
        state: locationForAdpost.state,
        country: locationForAdpost.country,
        district: locationForAdpost.district,
        city: locationForAdpost.city,
      };

      const imageURLs = mediaImages
        .map(
          (img: any) =>
            typeof img === 'string'
              ? img // already a URL string
              : // @ts-ignore
                loadingStates[img.id]?.uploadedUrl || null, // pick uploadedUrl if available
        )
        .filter((url: any): url is string => !!url);

      const floorPlansURL = floorPlans
        .map(
          (img: any) =>
            typeof img === 'string'
              ? img // already a URL string
              : // @ts-ignore
                loadingStatesfloor[img.id]?.uploadedUrl || null, // pick uploadedUrl if available
        )
        .filter((url: any): url is string => !!url);
      // Prepare full payload
      const payload = {
        ...values,
        ...finalLocation,
        imageUrls: imageURLs, //[...imageUrls, ...existingImageUrls],
        floorPlanUrl: floorPlansURL, //[...floorPlanUrls, ...existingFloorPlanUrls],
      };

      const method: RequestMethod = values.id ? 'put' : 'post';

      // API: Post Ad
      const postAdRes: any = await postAdAPI(payload, uploadParams, method);

      // Optional: Handle featured ad payment
      if (values.featured && !values.id) {
        try {
          // @ts-ignore
          const featuredPlan: any = managePlansList?.[0];

          if (featuredPlan) {
            const paymentPayload = {
              amountInRupees: featuredPlan.price,
              description: featuredPlan.description || '',
              purchasePlanId: featuredPlan._id,
              purchaseType: 'ads',
              purchaseTypeId: postAdRes?.id,
              ...uploadParams,
              phone: user?.phone ?? '',
              email: user?.email ?? '',
            };
            await startCheckoutPromise(paymentPayload);
          }
          setVisible(true);
          setPaymentStatus(true);
        } catch (error) {
          setPaymentStatus(false);
          setVisible(true);
        }
        // @ts-ignore
      } else {
        setVisible(true);
      }

      // Reset state only on success or cleanup
      resetForm();
      setImages([]);
      clearAllLoadingStates();
      setFloorPlans([]);
      setFields([]);
    } catch (error) {
      console.error('Post Ad Error:', error);
      setLoading(false);
    }
  }, [
    values,
    errors,
    imageUploadLoading,
    token,
    clientId,
    bearerToken,
    locationForAdpost.lat,
    locationForAdpost.lng,
    locationForAdpost.name,
    locationForAdpost.state,
    locationForAdpost.country,
    locationForAdpost.district,
    locationForAdpost.city,
    resetForm,
    setImages,
    clearAllLoadingStates,
    setFloorPlans,
    setFields,
    loadingStates,
    loadingStatesfloor,
    managePlansList,
    user?.phone,
    user?.email,
  ]);

  useEffect(() => {
    fetchPlans();
    setVisible(false);
    setPaymentStatus(true);
  }, [fetchPlans]);

  const updateImageStatus = (
    id: string,
    status: string,
    uploadedUrl?: string,
  ) => {
    setFieldValue('imageUrls', (prev: any[] = []) =>
      prev.map(img => {
        const imgId = typeof img === 'string' ? img : img.id ?? img.uri;
        if (imgId === id) {
          return {
            ...(typeof img === 'string' ? {uri: img} : img),
            status,
            ...(uploadedUrl ? {uploadedUrl} : {}),
          };
        }
        return img;
      }),
    );
  };

  const uploadImagesLocal = async (imgs: any[]) => {
    if (!imgs || imgs.length === 0) {
      setIsProcessingImages(false);
      return;
    }

    setIsUploadingImages(true);

    const assetsWithId = imgs.filter(img => img.id && !loadingStates[img.id]);
    assetsWithId.forEach(img =>
      setLoadingState(img.id, {...img, loading: true}),
    );

    const uploadParams = {token, clientId, bearerToken};

    const tasks = assetsWithId.map(img => async () => {
      try {
        const compressedUri = await compressImage(img.uri);

        if (!compressedUri) {
          setLoadingState(img.id, {...img, loading: false, success: false});
          return {id: img.id, success: false};
        }

        const formData = new FormData();
        formData.append('images', {
          uri: compressedUri,
          name: `image_${img.id}.jpg`,
          type: 'image/jpeg',
        } as any);

        const uploadedUrl: any = await uploadImages(formData, uploadParams);

        if (!uploadedUrl?.length) {
          throw new Error('Empty upload response');
        }

        setLoadingState(img.id, {
          ...img,
          loading: false,
          success: true,
          uploadedUrl: uploadedUrl[0],
        });

        return {id: img.id, success: true};
      } catch (err) {
        setLoadingState(img.id, {...img, loading: false, success: false});
        return {id: img.id, success: false, error: err};
      }
    });

    const results: any = await uploadWithQueue(tasks, 3); // 3 concurrent uploads
    console.log('All upload results:', results);

    setIsUploadingImages(false);
  };

  const uploadFloorPlanLocal = async (plans: any[]) => {
    if (!plans || plans.length === 0) {
      setIsProcessingFloorPlan(false);
      return;
    }

    const assetsWithId = plans.filter(
      img => img.id && !loadingStatesfloor[img.id],
    );
    assetsWithId.forEach(img =>
      setLoadingStateFloor(img.id, {...img, loading: true}),
    );

    setIsUploadingFloorPlans(true);
    const uploadParams = {token, clientId, bearerToken};

    // Convert each floor plan into a task
    const tasks = assetsWithId.map(img => async () => {
      try {
        const compressedUri = await compressImage(img.uri);

        if (!compressedUri) {
          setLoadingStateFloor(img.id, {
            ...img,
            loading: false,
            success: false,
          });
          return {id: img.id, success: false};
        }

        const formData = new FormData();
        formData.append('images', {
          uri: compressedUri,
          name: `floor_${img.id}.jpg`,
          type: 'image/jpeg',
        } as any);

        const uploadedUrl: any = await uploadImages(formData, uploadParams);

        if (!uploadedUrl?.length) {
          setLoadingStateFloor(img.id, {
            ...img,
            loading: false,
            success: false,
          });
          return {id: img.id, success: false};
        }

        setLoadingStateFloor(img.id, {
          ...img,
          loading: false,
          success: true,
          uploadedUrl: uploadedUrl[0],
        });

        return {id: img.id, success: true};
      } catch (err) {
        setLoadingStateFloor(img.id, {...img, loading: false, success: false});
        return {id: img.id, success: false, error: err};
      }
    });

    // Run with concurrency 3
    const results: any = await uploadWithQueue(tasks, 3);

    console.log('All floor plan upload results:', results);

    setIsUploadingFloorPlans(false);
    setIsProcessingFloorPlan(false);
  };

  return (
    <React.Fragment>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <CommonHeader
        title="Add Property"
        textColor="#171717"
        onBackPress={onBackPress}
      />
      <View
        style={[
          styles.stepperContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <Stepper totalSteps={6} currentStep={currentStep} />
      </View>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{height: Platform.OS === 'ios' ? '85%' : '80%', flex: 1}}> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <View style={{flex: 1}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            style={styles.scrollContainerStyle}
            keyboardShouldPersistTaps="handled">
            <View
              style={[
                styles.container,
                {backgroundColor: theme.colors.background},
              ]}>
              {renderStepContent()}
            </View>
          </ScrollView>
        </View>
        {/* </TouchableWithoutFeedback> */}
        <Footer
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onNext={checkErrors}
          onBackPress={onBackPress}
          submitPostAd={submitPostAd}
          imageUploadLoading={imageUploadLoading}
          isSkeletonLoading={isSkeletonLoading}
          loading={loading}
          values={values}
          isProcessingImages={isProcessingImages}
          isProcessingFloorPlan={isProcessingFloorPlan}
        />
      </KeyboardAvoidingView>
      <SuccessModal
        visible={visible}
        iconName={
          paymentStatus ? 'check-circle-outline' : 'alert-circle-outline'
        }
        iconColor={paymentStatus ? '#00C851' : 'orange'}
        message={
          values.id
            ? 'Your ad has been moved to pending status for review and will be reactivated once approved.'
            : paymentStatus
            ? 'Your ad has been submitted for review. Once approved, it will be visible on your profile. If any issues arise during the review process, we will notify you. You can also track the status of your ad directly from your profile.'
            : 'Payment Failed but still Your listing will go live after the review, you can try payment again later.'
        }
        onClose={() => {
          resetPostAd();
          setFields([]);
          setVisible(false);
          navigation.reset({
            index: 0,
            routes: [
              {
                // @ts-ignore
                name: 'Main',
                state: {
                  index: 3, // 'MyAds' is the 4th tab (0-based index)
                  routes: [
                    {name: 'Home'},
                    {name: 'Chat'},
                    {name: 'AddPost'},
                    {name: 'MyAds'},
                  ],
                },
              },
            ],
          });
        }}
      />
      <Modal
        statusBarTranslucent
        visible={preview}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setPreview(false);
        }}>
        <SafeAreaView>
          <TouchableOpacity onPress={() => setPreview(false)}>
            <Text>Colse</Text>
          </TouchableOpacity>
          <Preview items={values} />
        </SafeAreaView>
      </Modal>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 2,
    paddingHorizontal: 12,
  },
  stepperContainer: {
    padding: 16,
    paddingTop: 2,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 24,
    flexGrow: 1,
    // paddingVertical: 10,
    // flexGrow: 1,
  },
  scrollContainerStyle: {},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '40%',
    justifyContent: 'center',
  },
  chatText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  buyButton: {
    backgroundColor: '#2f8f72',
    alignItems: 'center',
    borderRadius: 10,
    width: '40%',
    justifyContent: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: '#c9ffefff',
    alignItems: 'center',
    borderRadius: 10,
    width: '40%',
    justifyContent: 'center',
  },
  buyText: {
    color: '#fff',
    fontSize: 16,
  },

  chipContainer: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 5,
    minWidth: 50,
    // marginBottom: 5,
  },
  chipSelected: {
    backgroundColor: '#2A9D8F',
    borderColor: '#2A9D8F',
  },
  chipText: {
    color: '#333',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject, // fills the screen
    backgroundColor: 'rgba(0, 0, 0, 0.78)', // transparent dark overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // ensure it's on top
  },
});

export default React.memo(PostAdContainer);
