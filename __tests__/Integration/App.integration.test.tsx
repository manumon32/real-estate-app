import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../src/screens/home/HomeScreen';
import useBoundStore from '@stores/index';

const Stack = createNativeStackNavigator();

// ---- Mock Zustand Store ----
jest.mock('@stores/index', () => {
  return jest.fn(() => ({
    listings: [{ id: 1, title: 'Test Property' }],
    fetchListings: jest.fn(),
    hasMore: true,
    loading: false,
    triggerRefresh: false,
    setTriggerRefresh: jest.fn(),
    location: null,
    setTriggerRelaod: jest.fn(),
    bearerToken: 'abc123',
    fetchChatListings: jest.fn(),
  }));
});

// ---- Mock Lazy Components ----
jest.mock('../../src/screens/home/Header/Header', () => 'Header');
jest.mock('@components/PropertyCard', () => 'PropertyCard');
jest.mock('@components/SkeltonLoader/HomepageSkelton', () => 'HomepageSkelton');
jest.mock('@components/NoChatFound', () => 'NoChats');

// ---- Firebase & Socket mocks ----
jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({})),
  onMessage: jest.fn(() => jest.fn()),
  onNotificationOpenedApp: jest.fn(() => jest.fn()),
  getInitialNotification: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('../../src/firebase/notificationService', () => ({
  navigateByNotification: jest.fn(),
  requestUserPermission: jest.fn(),
}));

jest.mock('../../src/soket', () => ({
  connectSocket: jest.fn(),
  disconnectSocket: jest.fn(),
}));

// ---- AppState mock ----
jest.mock('react-native/Libraries/AppState/AppState', () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
}));

// ---- BackHandler mock ----
jest.mock('react-native/Libraries/Utilities/BackHandler', () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
}));


// ---- Linking mock ----
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
}));

// ---- Toast mock ----
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));


// Helper to wrap HomeScreen inside actual navigator (required for useFocusEffect)
const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );


describe('HomeScreen Integration Test (Simple)', () => {

  it('renders HomeScreen with FlatList and Header', () => {
    const screen = renderWithNavigation();

    // FlatList exists
    expect(screen.UNSAFE_getByType(require('react-native').FlatList)).toBeTruthy();

    // Header component
    expect(screen.getByText('Header')).toBeTruthy();

    // PropertyCard appears
    expect(screen.getByText('PropertyCard')).toBeTruthy();
  });


  // it('loads more items when onEndReached triggers', () => {
  //   const mockStore = useBoundStore();
  //   const fetchListings = mockStore.fetchListings;

  //   const screen = renderWithNavigation();

  //   const flatList = screen.UNSAFE_getByType(require('react-native').FlatList);

  //   fireEvent(flatList, 'onEndReached');

  //   expect(fetchListings).toHaveBeenCalled();
  // });

});
