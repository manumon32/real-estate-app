module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@theme': './src/theme',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@assets': './src/assets',
          '@constants': './src/constants',
          '@api': './src/api',
          '@stores': './src/stores',
        },
      },
    ],
  ],
};
