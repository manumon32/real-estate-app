module.exports = {
  preset: 'react-native',

  testEnvironment: require.resolve('detox/jest/testEnvironment'),
  setupFilesAfterEnv: [require.resolve('detox/jest/adapter')],

  globalSetup: require.resolve('detox/jest/globalSetup'),
  globalTeardown: require.resolve('detox/jest/globalTeardown'),

  testRunner: 'jest-circus/runner',
  testTimeout: 120000,
};