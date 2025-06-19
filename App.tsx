import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from '@theme/ThemeProvider';
import RootNavigator from '@navigation/RootNavigator';
import CommonLocationModal from '@components/Modal/LocationSearchModal';
import useBoundStore from '@stores/index';
import Toast from 'react-native-toast-message';
import { ToastConfig } from './src/config/ToastConfig';

export default function App() {
  const {
    locationModalvisible,
    setlocationModalVisible,
    setLocation,
    locationHistory,
  } = useBoundStore();
  return (
    <ThemeProvider>
      <NavigationContainer>
        <RootNavigator />

        <CommonLocationModal
          visible={locationModalvisible}
          onClose={() => setlocationModalVisible()}
          onSelectLocation={setLocation}
          locationHistory={locationHistory}
        />
        <Toast config={ToastConfig}/>
      </NavigationContainer>
    </ThemeProvider>
  );
}
