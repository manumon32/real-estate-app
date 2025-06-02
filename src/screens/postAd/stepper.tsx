/* eslint-disable react-native/no-inline-styles */
import Stepper from '@components/stepper';
import React, {useEffect, useRef, useState} from 'react';
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

const PostAdContainer = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [visible, setVisible] = useState(false);

  const prevCountRef = useRef<number | null>(null);

  useEffect(() => {
    prevCountRef.current = currentStep;
    if (currentStep == 5) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [currentStep]);

  const prevStep = prevCountRef.current;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo currentStep={prevStep} />;
      case 2:
        return <Step2 currentStep={prevStep} />;
      case 3:
        return <Step3LocationDetails currentStep={prevStep} />;
      case 4:
        return <Step4PropertyDetails currentStep={prevStep} />;
      case 5:
        return <Step5MediaUpload currentStep={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <CommonHeader title="Add Property" textColor="#171717" />
      <View style={styles.container}>
        <View style={styles.stepperContainer}>
          <Stepper totalSteps={5} currentStep={currentStep} />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          style={{height: Platform.OS === 'ios' ? '90%' : '89.5%'}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              style={styles.scrollContainerStyle}
              keyboardShouldPersistTaps="handled">
              {renderStepContent()}
            </ScrollView>
            <Footer currentStep={currentStep} setCurrentStep={setCurrentStep} />
          </View>
        </KeyboardAvoidingView>
      </View>
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
  stepperContainer: {paddingHorizontal: 16},
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
    bottom: 20,
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
});

export default PostAdContainer;
