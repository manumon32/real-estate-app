module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|react-native-vector-icons' +
      '|react-native-reanimated' +
      '|react-native-gesture-handler' +
      '|@react-native-community' +
      '|@react-native-async-storage' +
      '|@react-native-firebase' +
      ')/)',
  ],
};
