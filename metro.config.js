// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
// const path = require('path');
// const {
//   wrapWithReanimatedMetroConfig,
// } = require('react-native-reanimated/metro-config');

// const defaultConfig = getDefaultConfig(__dirname);
// const { resolver: { sourceExts, assetExts } } = defaultConfig;

// const config = {
//   transformer: {
//     babelTransformerPath: require.resolve('react-native-svg-transformer'),
//   },
//   resolver: {
//     assetExts: assetExts.filter(ext => ext !== 'svg'),
//     sourceExts: [...sourceExts, 'svg'],
//     resolverMainFields: ['sbmodern', 'react-native', 'browser', 'main'],
//     extraNodeModules: {
//       '@theme': path.resolve(__dirname, 'src/theme'),
//       '@components': path.resolve(__dirname, 'src/components'),
//       '@screens': path.resolve(__dirname, 'src/screens'),
//       '@navigation': path.resolve(__dirname, 'src/navigation'),
//       '@assets': path.resolve(__dirname, 'src/assets'),
//       '@constants': path.resolve(__dirname, 'src/constants'),
//       '@api': path.resolve(__dirname, 'src/api'),
//       '@stores': path.resolve(__dirname, 'src/stores'),
//       '@soket': path.resolve(__dirname, 'src/soket'),
//     },
//   },
//   watchFolders: [path.resolve(__dirname, 'src')],
// };

// module.exports = wrapWithReanimatedMetroConfig(mergeConfig(defaultConfig, config));




const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const { resolver: { sourceExts, assetExts } } = defaultConfig;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    resolverMainFields: ['sbmodern', 'react-native', 'browser', 'main'],
     extraNodeModules: {
      '@theme': path.resolve(__dirname, 'src/theme'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@screens': path.resolve(__dirname, 'src/screens'),
      '@navigation': path.resolve(__dirname, 'src/navigation'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@soket': path.resolve(__dirname, 'src/soket'),
    },
  },
  watchFolders: [path.resolve(__dirname, '../')],
};

module.exports = wrapWithReanimatedMetroConfig(mergeConfig(getDefaultConfig(__dirname), config));


// // module.exports = {
// //   transformer: {
// //     getTransformOptions: async () => ({
// //       transform: {
// //         experimentalImportSupport: false,
// //         inlineRequires: true,
// //       },
// //     }),
// //   },
// // };