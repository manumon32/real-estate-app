import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import App from '../../App';

// Mock ThemeProvider (no-op)
jest.mock('@theme/ThemeProvider', () => {
  const React = require('react');
  const theme = {
    colors: {},
    spacing: {},
    typography: {},
  }; // dummy theme
  return {
    ThemeProvider: ({children}: any) => <>{children}</>,
    useTheme: () => ({theme, toggleTheme: jest.fn()}),
  };
});

// Mock Toast
jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: ({children}: any) => <>{children}</>,
  show: jest.fn(),
}));

// Mock Navigation
jest.mock('@navigation/RootNavigator', () => () => <></>);
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      // add any other methods your component calls
    }),
  };
});

// Mock device info
jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn(() => Promise.resolve('mock-id')),
  getVersion: jest.fn(() => '1.0.0'),
  getModel: jest.fn(() => 'mock-model'),
  getSystemVersion: jest.fn(() => '1.0.0'),
}));

// Mock your store
jest.mock('@stores/index', () => () => ({
  locationModalvisible: false,
  setlocationModalVisible: jest.fn(),
  globalModalvisible: false,
  setGlobalModalVisible: jest.fn(),
  setLocation: jest.fn(),
  locationHistory: [],
  visible: false,
  setVisible: jest.fn(),
  setNavigationMode: jest.fn(),
  token: null,
  clientId: null,
  bearerToken: null,
  gethandShakeToken: jest.fn(),
  handShakeError: false,
  getConfigData: jest.fn(),
  fetchSuggestions: jest.fn(),
  fetchFavouriteAds: jest.fn(),
  fetchInitialListings: jest.fn(),
}));

describe('App Launch', () => {
  it('renders App and shows Home page', async () => {
    const {queryByText} = render(<App />);

    await waitFor(() => {
      // Your Home page text or component
      expect(queryByText(/Retry/i)).toBeTruthy();
    });
  });
});
