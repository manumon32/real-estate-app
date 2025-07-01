import React, {useMemo, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface StepperProps {
  totalSteps: number;
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({totalSteps, currentStep}) => {
  // Memoize step rendering to avoid recalculating on unrelated re-renders
  const steps = useMemo(() => {
    return Array.from({length: totalSteps}, (_, index) => index + 1);
  }, [totalSteps]);

  // Callback for rendering each step
  const renderStep = useCallback(
    (step: number) => {
      const isCompleted = step < currentStep;
      const isActive = step === currentStep;

      return (
        <React.Fragment key={step}>
          <View
            style={[
              styles.circle,
              isCompleted && styles.completed,
              isActive && styles.active,
            ]}>
            <Text
              style={[
                styles.stepText,
                (isCompleted || isActive) && styles.textActive,
              ]}>
              {step}
            </Text>
          </View>

          {step < totalSteps && (
            <View
              style={[
                styles.line,
                step < currentStep ? styles.lineActive : styles.lineInactive,
              ]}
            />
          )}
        </React.Fragment>
      );
    },
    [currentStep, totalSteps],
  );

  return <View style={styles.container}>{steps.map(renderStep)}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 25,
    backgroundColor: '#E3FFF8', // default inactive
    borderColor:'#88E4CF', 
    borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#2F8D79',
    borderWidth:0,
  },
  completed: {
    backgroundColor: '#2F8D79',
    borderWidth:0,
  },
  stepText: {
    fontSize: 12,
    color: '#2F8D79',
  },
  textActive: {
    color: '#FFFFFF',
  },
  line: {
    height: 2,
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#E0E0E0',
  },
  lineActive: {
    backgroundColor: '#1A8E78',
  },
  lineInactive: {
    backgroundColor: '#E0E0E0',
  },
});

export default React.memo(Stepper);
