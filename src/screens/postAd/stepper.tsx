/* eslint-disable react-native/no-inline-styles */
import Stepper from '@components/stepper';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
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
import {useNavigation} from '@react-navigation/native';
import Step1BasicInfo from './step1BasicInfo';
import Step2 from './step2PriceDetails';
import Step3LocationDetails from './step3LocationDetails';
import Step4PropertyDetails from './step4PropertyDetails';
import Step5MediaUpload from './step5MediaUpload';
import CommonHeader from '@components/Header/CommonHeader';
import CommonSuccessModal from '@components/Modal/CommonSuccessModal';
import useBoundStore from '@stores/index';
import Preview from './preview';
import {postAdAPI, uploadImages} from '@api/services';
import {RequestMethod} from '@api/request';

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
}

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
    if (currentStep === 5) {
      submitPostAd();
    }
    if (onNext) {
      onNext();
    } else {
      currentStep !== 5 && setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={handleCancel}
        style={styles.chatButton}
        accessibilityRole="button"
        disabled={isFirstStep}>
        <Text style={styles.chatText}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleNext}
        style={styles.buyButton}
        accessibilityRole="button"
        disabled={isLastStep}>
        <Text style={styles.buyText}>
          {loading && <ActivityIndicator size={'small'} color={'#fff'} />}
          {!loading
            ? currentStep == 5
              ? values.id
                ? 'Update'
                : 'Post Now'
              : 'Next'
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
    touched,
    fields,
    setFields,
  } = props;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [visible, setVisible] = useState(false);
  const [preview, setPreview] = useState(false);
  const prevCountRef = useRef<number | null>(null);
  const {
    setPostAd,
    resetPostAd,
    images,
    postAd,
    token,
    clientId,
    bearerToken,
    location,
    locationForAdpost,
    floorPlans,
    setImages,
    setFloorPlans,
  } = useBoundStore();
  console.log('values', values);
  const prevStep = prevCountRef.current;

  const getMergedFields = useCallback(
    (id: any, argFields: string[]) => {
      setFields((prev: any) => {
        const newMap: any = {...prev};
        // if (newMap[id]) {
        //   delete newMap[id];
        // } else {
        newMap[id] = argFields;
        // }
        return newMap;
      });
    },
    [setFields],
  );

  const isStringInEitherArray = (value: string): boolean => {
    const mergedUnique = [...new Set(Object.values(fields).flat())];
    return mergedUnique.length <= 0 ? true : mergedUnique?.includes(value);
  };

  const toggleItem = useCallback(
    (name: string, item: any, setSelectedList?: any) => {
      if (name) {
        if (postAd[name] && postAd[name][0] === item) {
          delete postAd[name];
          setFieldValue(name, '');
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
                  newselected?.includes(item._id) && styles.chipSelected,
                ]}
                onPress={() => {
                  console.log(item.fields);
                  item.fields && getMergedFields(item.filterName, item.fields);
                  toggleItem(item.filterName, item._id, setSelected);
                }}>
                <Text
                  style={
                    newselected?.includes(item._id)
                      ? styles.chipTextSelected
                      : styles.chipText
                  }>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      );
    },
    [postAd, getMergedFields, toggleItem],
  );

  const checkErrors = () => {
    const requiredFields = {
      1: ['title', 'description', 'propertyTypeId', 'listingTypeId'],
      2: ['price'],
      3: ['areaSize'],
      4: [],
      5: [],
      // 3: imageUrls ['nearbyLandmarks'],
    };
    prevCountRef.current = currentStep;
    setTouched(
      // @ts-ignore
      requiredFields[currentStep]?.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as {[key: string]: boolean}),
      true, // validate after touching
    );
    if (
      // @ts-ignore
      requiredFields[currentStep]?.some(
        // @ts-ignore
        field =>
          currentStep === 1
            ? !!errors[field] || !touched[field]
            : !!errors[field],
      )
    ) {
      return false;
    } else {
      currentStep < 5 && setCurrentStep(prev => prev + 1);
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
          <Step2
            currentStep={prevStep}
            isStringInEitherArray={isStringInEitherArray}
            getMergedFields={getMergedFields}
            toggleItem={toggleItem}
            renderChips={renderChips}
            {...props}
          />
        );
      case 3:
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
      case 4:
        return (
          <Step4PropertyDetails
            currentStep={prevStep}
            isStringInEitherArray={isStringInEitherArray}
            getMergedFields={getMergedFields}
            {...props}
          />
        );
      case 5:
        return (
          <Step5MediaUpload
            currentStep={prevStep}
            isStringInEitherArray={isStringInEitherArray}
            getMergedFields={getMergedFields}
            toggleItem={toggleItem}
            renderChips={renderChips}
            {...props}
          />
        );
      default:
        return null;
    }
  };

  const onBackPress = () => {
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
        },
      },
    ]);
  };

  const submitPostAd = useCallback(async () => {
    if (Object.keys(errors).length == 0 && images.length > 0) {
      setLoading(true);
      let formData = new FormData();
      // @ts-ignore
      let newImages = images.filter(items => items?.uri);
      // @ts-ignore
      let newImagesWithurl = images.filter(items => !items.uri);
      newImages.map((items: any, index: any) => {
        formData.append('images', {
          uri: items.uri, // local path or blob URL
          name: `photo_${index}.jpg`, // ⬅ server sees this
          type: 'image/jpeg',
        } as any);
      });
      let formDataFloor = new FormData();
      // @ts-ignore
      let newformDataFloor = floorPlans.filter(items => items?.uri);
      // @ts-ignore
      let formDataFloorWithurl = floorPlans.filter(items => !items.uri);
      newformDataFloor.map((items: any, index: any) => {
        formDataFloor.append('images', {
          uri: items.uri, // local path or blob URL
          name: `photo_${index}.jpg`, // ⬅ server sees this
          type: 'image/jpeg',
        } as any);
      });
      try {
        /* 1. upload ------------------------------------------------------ */
        const imageUrls: any =
          newImages.length > 0
            ? await uploadImages(formData, {
                token: token,
                clientId: clientId,
                bearerToken: bearerToken,
              })
            : [];
        const floorUrls: any =
          newformDataFloor.length > 0
            ? await uploadImages(formDataFloor, {
                token: token,
                clientId: clientId,
                bearerToken: bearerToken,
              })
            : [];
        const paylod = {
          latitude: locationForAdpost.lat
            ? locationForAdpost.lat
            : location.lat,
          longitude: locationForAdpost.lng
            ? locationForAdpost.lng
            : location.lng,
          address: locationForAdpost.name
            ? locationForAdpost.name
            : location.name,
          imageUrls: [...imageUrls, ...newImagesWithurl],
          floorPlanUrl: [...floorUrls, ...formDataFloorWithurl],
        };
        let mergedPayload = {...values, ...paylod};
        console.log('postAd payload', mergedPayload);
        let method: RequestMethod = values.id ? 'put' : 'post';
        console.log('method', method);
        /* 2. post ad ----------------------------------------------------- */
        await postAdAPI(
          mergedPayload,
          {
            token: token,
            clientId: clientId,
            bearerToken: bearerToken,
          },
          method,
        );
        setVisible(true);
      } catch (err: any) {
        Alert.alert(
          'Something went wrong',
          'Failed to post ad, please try again later',
        );
      } finally {
        setImages([]);
        setFloorPlans([]);
        setLoading(false);
      }
    }
  }, [
    errors,
    images,
    floorPlans,
    token,
    clientId,
    bearerToken,
    locationForAdpost.lat,
    locationForAdpost.lng,
    locationForAdpost.name,
    location.lat,
    location.lng,
    location.name,
    values,
    setImages,
    setFloorPlans,
  ]);

  useEffect(() => {
    setVisible(false);
  }, []);

  return (
    <React.Fragment>
      <CommonHeader
        title="Add Property"
        textColor="#171717"
        onBackPress={onBackPress}
      />
      <View style={styles.stepperContainer}>
        <Stepper totalSteps={5} currentStep={currentStep} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{height: Platform.OS === 'ios' ? '85%' : '80%', flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollContainerStyle}
          keyboardShouldPersistTaps="never">
          <View style={styles.container}>{renderStepContent()}</View>
        </ScrollView>
        <Footer
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onNext={checkErrors}
          onBackPress={onBackPress}
          submitPostAd={submitPostAd}
          loading={loading}
          values={values}
        />
      </KeyboardAvoidingView>
      <CommonSuccessModal
        visible={visible}
        message={
          values.id
            ? 'Your Udaptes are saved.'
            : 'Your listing will go live after the review.'
        }
        onClose={() => {
          setVisible(false);
          resetPostAd();
          setFields([]);
          // @ts-ignore
          navigation.reset({index: 0, routes: [{name: 'Main'}]});
        }}
      />
      <Modal
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
});

export default React.memo(PostAdContainer);
