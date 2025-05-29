/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {useTheme} from '@theme/ThemeProvider';
import { Header } from 'react-native/Libraries/NewAppScreen';


function App(): React.JSX.Element {
  const {theme} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: theme.colors.background,
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        style={backgroundStyle}>
        <View style={{}}>
          <Header/>
        </View>
      </ScrollView>
    </View>
  );
}

export default App;
