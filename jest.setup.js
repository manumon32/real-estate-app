/* eslint-disable no-undef */
// jest.setup.js
import 'react-native-gesture-handler/jestSetup';
import React from 'react';
import {View} from 'react-native';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// ------------------------
// Firebase
// ------------------------

jest.mock('@react-native-firebase/auth', () => () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));
// Mock @react-native-firebase/app
jest.mock('@react-native-firebase/app', () => {
  return {
    initializeApp: jest.fn(),
    getApp: jest.fn(() => ({})), // returns a mock app object
    app: jest.fn(() => ({})),
  };
});

// Mock @react-native-firebase/messaging
jest.mock('@react-native-firebase/messaging', () => {
  const AuthorizationStatus = {
    NOT_DETERMINED: 'not-determined',
    DENIED: 'denied',
    AUTHORIZED: 'authorized',
    PROVISIONAL: 'provisional',
  };

  const onMessage = jest.fn((messagingInstance, callback) => {
    // return unsubscribe function
    return jest.fn();
  });

  const getMessaging = jest.fn(() => ({
    onMessage: jest.fn((callback) => jest.fn()), // instance-level onMessage
    getToken: jest.fn(() => Promise.resolve('mock-token')),
    subscribeToTopic: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve(AuthorizationStatus.AUTHORIZED)),
  }));

  const requestPermission = jest.fn(() => Promise.resolve(AuthorizationStatus.AUTHORIZED));

  return {
    getMessaging,
    onMessage,
    requestPermission,
    AuthorizationStatus,
  };
});


// ------------------------
// Navigation
// ------------------------
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({navigate: jest.fn()}),
    useRoute: () => ({params: {}}),
  };
});
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn(() => ({
    Navigator: 'Navigator',
    Screen: 'Screen',
  })),
}));
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: jest.fn(() => ({
    Navigator: 'Navigator',
    Screen: 'Screen',
  })),
}));

// ------------------------
// Reanimated & Gesture Handler
// ------------------------
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
jest.mock('react-native-gesture-handler', () =>
  require('react-native-gesture-handler/jestSetup'),
);

// ------------------------
// Vector Icons
// ------------------------
jest.mock('react-native-vector-icons', () => ({
  createIconSet: () => 'Icon',
}));

// ------------------------
// Async Storage
// ------------------------
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// ------------------------
// NetInfo
// ------------------------
jest.mock('@react-native-community/netinfo', () => {
  const listeners = [];
  return {
    fetch: jest.fn(() => Promise.resolve({isConnected: true})),
    addEventListener: jest.fn(callback => {
      listeners.push(callback);
      return {remove: jest.fn()};
    }),
    removeEventListener: jest.fn(),
    useNetInfo: jest.fn(() => ({isConnected: true})),
  };
});

// ------------------------
// Geolocation
// ------------------------
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}));

// ------------------------
// Splash Screen
// ------------------------
jest.mock('react-native-splash-screen', () => ({
  hide: jest.fn(),
  show: jest.fn(),
}));

// ------------------------
// MMKV
// ------------------------
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
  })),
}));

// ------------------------
// FBSdk
// ------------------------
jest.mock('react-native-fbsdk-next', () => ({
  LoginManager: {logInWithPermissions: jest.fn()},
  AccessToken: {getCurrentAccessToken: jest.fn()},
}));

// ------------------------
// Razorpay
// ------------------------
jest.mock('react-native-razorpay', () => jest.fn(() => ({open: jest.fn()})));

// ------------------------
// Share
// ------------------------
jest.mock('react-native-share', () => ({open: jest.fn()}));

// ------------------------
// WebView
// ------------------------
jest.mock('react-native-webview', () => 'WebView');

// ------------------------
// Image Picker / Crop Picker
// ------------------------
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn(() =>
    Promise.resolve([
      {
        path: 'mock/path/to/image.jpg',
        width: 100,
        height: 100,
        mime: 'image/jpeg',
      },
    ]),
  ),
  openCamera: jest.fn(() =>
    Promise.resolve({
      path: 'mock/path/to/camera.jpg',
      width: 100,
      height: 100,
      mime: 'image/jpeg',
    }),
  ),
  openCropper: jest.fn(() =>
    Promise.resolve({
      path: 'mock/path/to/cropped.jpg',
      width: 100,
      height: 100,
      mime: 'image/jpeg',
    }),
  ),
  clean: jest.fn(),
}));

// ------------------------
// Audio Recorder Player
// ------------------------
jest.mock('react-native-audio-recorder-player', () => {
  return jest.fn().mockImplementation(() => ({
    startRecorder: jest.fn(() => Promise.resolve('file://mocked-path')),
    stopRecorder: jest.fn(() => Promise.resolve('file://mocked-path')),
    startPlayer: jest.fn(() => Promise.resolve()),
    stopPlayer: jest.fn(() => Promise.resolve()),
    pausePlayer: jest.fn(() => Promise.resolve()),
    resumePlayer: jest.fn(() => Promise.resolve()),
    addRecordBackListener: jest.fn(),
    removeRecordBackListener: jest.fn(),
    addPlayBackListener: jest.fn(),
    removePlayBackListener: jest.fn(),
    seekToPlayer: jest.fn(() => Promise.resolve()),
    setVolume: jest.fn(),
  }));
});

// ------------------------
// Image Zoom Viewer
// ------------------------
jest.mock('react-native-image-zoom-viewer', () => {
  const React = require('react');
  const {View} = require('react-native');
  return props => <View testID="mockImageZoomViewer" {...props} />;
});

// ------------------------
// Maps
// ------------------------
jest.mock('react-native-maps', () => {
  const React = require('react');
  const {View} = require('react-native');
  const MockMapView = props => <View {...props} testID="mockMapView" />;
  const MockMarker = props => <View {...props} testID="mockMarker" />;
  const MockCallout = props => <View {...props} testID="mockCallout" />;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Callout: MockCallout,
    PROVIDER_GOOGLE: 'google',
  };
});

// ------------------------
// Compressor
// ------------------------
jest.mock('react-native-compressor', () => ({
  Image: {compress: jest.fn(async uri => uri)},
  Video: {compress: jest.fn(async uri => uri)},
  Audio: {compress: jest.fn(async uri => uri)},
}));

// ------------------------
// Toast
// ------------------------
jest.mock('react-native-toast-message', () => {
  return (() => {
    const React = require('react');
    const {View} = require('react-native');

    const Toast = props => <View {...props} />;
    Toast.show = jest.fn();
    Toast.hide = jest.fn();
    Toast.setRef = jest.fn();

    return Toast;
  })();
});

// ------------------------
// Linear Gradient
// ------------------------
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// ------------------------
// SVG
// ------------------------
jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Circle: 'Circle',
  Path: 'Path',
}));

// ------------------------
// Pager View
// ------------------------
jest.mock('react-native-pager-view', () => 'PagerView');

// ------------------------
// Slider
// ------------------------
jest.mock('@react-native-community/slider', () => 'Slider');

// ------------------------
// DateTime Picker
// ------------------------
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// ------------------------
// Blur
// ------------------------
jest.mock('@react-native-community/blur', () => 'BlurView');

// ------------------------
// Apple Authentication
// ------------------------
jest.mock('@invertase/react-native-apple-authentication', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  performRequest: jest.fn(),
}));

// ------------------------
// Multi Slider
// ------------------------
jest.mock('@ptomasroos/react-native-multi-slider', () => 'MultiSlider');

// ------------------------
// Documents Picker / Viewer
// ------------------------
jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
}));
jest.mock('@react-native-documents/viewer', () => ({
  open: jest.fn(),
}));

// ------------------------
// Payments
// ------------------------
jest.mock('@rnw-community/react-native-payments', () => ({
  PaymentRequest: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    abort: jest.fn(),
    complete: jest.fn(),
  })),
}));

// ------------------------
// Other modules (fast-image, draggable-flatlist, etc.) can be mocked as simple components
// ------------------------
jest.mock('react-native-fast-image', () => 'FastImage');
jest.mock('react-native-draggable-flatlist', () => 'DraggableFlatList');
jest.mock('react-native-modal', () => 'Modal');
jest.mock(
  'react-native-keyboard-aware-scroll-view',
  () => 'KeyboardAwareScrollView',
);
jest.mock('react-native-paper', () => 'Paper');
jest.mock('react-native-swipe-list-view', () => 'SwipeListView');
jest.mock('react-native-tab-view', () => 'TabView');
jest.mock('react-native-version-check', () => ({getCurrentVersion: jest.fn()}));
jest.mock('react-native-walkthrough-tooltip', () => 'Tooltip');
jest.mock('rn-fetch-blob', () => ({fetch: jest.fn()}));
jest.mock('react-native-uuid', () => ({v4: jest.fn(() => 'mock-uuid')}));
jest.mock('react-native-permissions', () => ({
  check: jest.fn(() => Promise.resolve('granted')),
  request: jest.fn(() => Promise.resolve('granted')),
  openSettings: jest.fn(() => Promise.resolve()),
  PERMISSIONS: {
    IOS: {
      CAMERA: 'camera',
      PHOTO_LIBRARY: 'photo_library',
      LOCATION_WHEN_IN_USE: 'location_when_in_use',
    },
    ANDROID: {
      CAMERA: 'camera',
      READ_EXTERNAL_STORAGE: 'read_external_storage',
      WRITE_EXTERNAL_STORAGE: 'write_external_storage',
      ACCESS_FINE_LOCATION: 'access_fine_location',
    },
  },
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    BLOCKED: 'blocked',
    GRANTED: 'granted',
  },
}));
jest.mock('@react-native-camera-roll/camera-roll', () => ({
  getPhotos: jest.fn(() =>
    Promise.resolve({
      edges: [
        {
          node: {
            type: 'image/jpeg',
            image: {
              uri: 'mock/path/to/photo.jpg',
              width: 100,
              height: 100,
            },
          },
        },
      ],
      page_info: {
        has_next_page: false,
        end_cursor: 'mock_cursor',
      },
    }),
  ),
  save: jest.fn(() => Promise.resolve('mock/path/to/photo.jpg')),
}));
jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mock/document',
  ExternalDirectoryPath: '/mock/external',
  MainBundlePath: '/mock/bundle',
  readFile: jest.fn(() => Promise.resolve('mock file content')),
  writeFile: jest.fn(() => Promise.resolve()),
  unlink: jest.fn(() => Promise.resolve()),
  exists: jest.fn(() => Promise.resolve(true)),
  mkdir: jest.fn(() => Promise.resolve()),
  downloadFile: jest.fn(() => ({promise: Promise.resolve({statusCode: 200})})),
  uploadFiles: jest.fn(() => ({promise: Promise.resolve({statusCode: 200})})),
  moveFile: jest.fn(() => Promise.resolve()),
  copyFile: jest.fn(() => Promise.resolve()),
  readDir: jest.fn(() => Promise.resolve([])),
  // any other fs methods you use can be added here
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

jest.mock('react-native-uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn(() => 'mock-unique-id'),
  getDeviceId: jest.fn(() => 'mock-device-id'),
  getSystemName: jest.fn(() => 'mock-system-name'),
  getSystemVersion: jest.fn(() => '1.0'),
  getVersion: jest.fn(() => '1.0.0'),
  getBuildNumber: jest.fn(() => '1'),
  isEmulator: jest.fn(() => false),
  isTablet: jest.fn(() => false),
  getBrand: jest.fn(() => 'mock-brand'),
  getManufacturer: jest.fn(() => 'mock-manufacturer'),
  getModel: jest.fn(() => 'mock-model'),
  // Add any other methods you use
}));
jest.mock('react-native-otp-verify', () => ({
  getOtp: jest.fn(() => Promise.resolve('123456')),
  getHash: jest.fn(() => Promise.resolve('mock-hash')),
  getAppHash: jest.fn(() => Promise.resolve('mock-app-hash')),
  addListener: jest.fn(() => ({remove: jest.fn()})),
  removeListener: jest.fn(),
}));
jest.mock('react-native-file-viewer', () => ({
  open: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-pie-chart', () => {
  const React = require('react');
  const {View} = require('react-native');
  return props => <View testID="mockPieChart" {...props} />;
});

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() =>
      Promise.resolve({
        idToken: 'mock-id-token',
        user: {
          name: 'Mock User',
          email: 'mockuser@example.com',
          photo: 'mock/photo/url',
        },
      }),
    ),
    signOut: jest.fn(() => Promise.resolve()),
    isSignedIn: jest.fn(() => Promise.resolve(false)),
    getCurrentUser: jest.fn(() =>
      Promise.resolve({
        user: {
          name: 'Mock User',
          email: 'mockuser@example.com',
          photo: 'mock/photo/url',
        },
      }),
    ),
  },
}));
jest.mock('react-native-navigation-mode', () => ({
  enable: jest.fn(),
  disable: jest.fn(),
  isEnabled: jest.fn(() => true),
  setMode: jest.fn(),
  getMode: jest.fn(() => 'mock-mode'),
  getNavigationMode: jest.fn(() => Promise.resolve('mock-navigation-mode')),
}));


jest.mock('@api/services', () => ({
  fetchUserDetailsAPI: jest.fn(() => Promise.resolve({ id: 1, name: 'Test User' })),
  login: jest.fn(() => Promise.resolve({ token: 'mock-token', userInfo: { id: 1 } })),
  logoutAPI: jest.fn(() => Promise.resolve(true)),
  logoutFromallDevicesAPI: jest.fn(() => Promise.resolve(true)),
  sendEmailOTP: jest.fn(() => Promise.resolve(true)),
  verifyEmailOTP: jest.fn(() => Promise.resolve(true)),
  sendPhoneOTP: jest.fn(() => Promise.resolve(true)),
  verifyPhoneOTP: jest.fn(() => Promise.resolve(true)),
  verifyOTP: jest.fn(() => Promise.resolve({ token: 'mock-token', userInfo: { id: 1 } })),
  updateContact: jest.fn(() => Promise.resolve(true)),
  updateUser: jest.fn(() => Promise.resolve({ id: 1, name: 'Updated User' })),
  submitRequestAPI: jest.fn(() => Promise.resolve(true)),
}));