/* eslint-disable react-native/no-inline-styles */
import Stepper from '@components/stepper';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Step1BasicInfo from './step1BasicInfo';
import Step2 from './step2PriceDetails';
import Step3LocationDetails from './step3LocationDetails';
import Step4PropertyDetails from './step4PropertyDetails';
import Step5MediaUpload from './step5MediaUpload';
import CommonHeader from '@components/Header/CommonHeader';
import CommonSuccessModal from '@components/Modal/CommonSuccessModal';
import useBoundStore from '@stores/index';

interface FooterProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  onCancel?: () => void;
  onNext?: () => void;
}

const Footer: React.FC<FooterProps> = ({
  currentStep,
  setCurrentStep,
  isFirstStep = false,
  isLastStep = false,
  onCancel,
  onNext,
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      currentStep !== 1 && setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  };

  const handleNext = () => {
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
        <Text style={styles.buyText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const PostAdContainer = (props: any) => {
  const {handleSubmit,errors, touched, setTouched} = props;
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [visible, setVisible] = useState(false);
  const [fields, setFields] = useState<{}>({});
  const prevCountRef = useRef<number | null>(null);
  const {setPostAd, postAd} = useBoundStore();

  useEffect(() => {
    prevCountRef.current = currentStep;
    if (currentStep == 5) {
      handleSubmit();
    } else {
      setVisible(false);
    }
  }, [currentStep, handleSubmit]);

  const prevStep = prevCountRef.current;

  const getMergedFields = useCallback(
    (id: any, argFields: string[]) => {
      setFields((prev: any) => {
        const newMap: any = {...prev};
        if (newMap[id]) {
          delete newMap[id];
        } else {
          newMap[id] = argFields;
        }
        console.log(newMap);
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
        } else {
          postAd[name] = [item];
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
    [postAd, setPostAd],
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
    const requiredFields = ['title', 'description'];
    setTouched(
      requiredFields.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as {[key: string]: boolean}),
      true, // validate after touching
    );
    if (
      currentStep === 1 &&
      requiredFields.some(field => !!errors[field] || !touched[field])
    ) {
      return false;
    } else {
      setCurrentStep(prev => prev + 1);
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
          />
        );
      case 4:
        return (
          <Step4PropertyDetails
            currentStep={prevStep}
            isStringInEitherArray={isStringInEitherArray}
            getMergedFields={getMergedFields}
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <CommonHeader title="Add Property" textColor="#171717" />
      <View style={styles.stepperContainer}>
        <Stepper totalSteps={5} currentStep={currentStep} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{height: Platform.OS === 'ios' ? '85%' : '80%'}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollContainerStyle}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>{renderStepContent()}</View>
        </ScrollView>
        <Footer
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onNext={checkErrors}
        />
      </KeyboardAvoidingView>
      <CommonSuccessModal visible={visible} onClose={() => setVisible(false)} />
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 5,
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

export default PostAdContainer;
