import IconButton from '@components/Buttons/IconButton';
import React from 'react';
import {View, StyleSheet, Pressable, } from 'react-native';
import {WebView} from 'react-native-webview';

// const deviceWidth = Dimensions.get('window').width;
const modelURL = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'; // Replace with your model URL

import {useNavigation} from '@react-navigation/native';

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
    <style>
      body { margin: 0; background: #000; }
      model-viewer { width: 100%; height: 100vh; }
    </style>
  </head>
  <body>
    <model-viewer 
      src="${modelURL}" 
      auto-rotate 
      camera-controls 
      ar 
      background-color="#000000">
    </model-viewer>
  </body>
</html>
`;

const ThreeDModelViewer = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.closeButton}>
        <IconButton
          iconSize={24}
          //red , heart
          iconColor={'#000'}
          iconName={'close'}
        />
      </Pressable>
      <WebView
        originWhitelist={['*']}
        source={{html: htmlContent}}
        javaScriptEnabled={true}
        allowsFullscreenVideo
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    flex:1
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
  },
});

export default React.memo(ThreeDModelViewer);
