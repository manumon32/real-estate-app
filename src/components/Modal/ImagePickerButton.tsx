import React, { useCallback } from 'react';
import { Button } from 'react-native';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

type Props = {
  onPicked: (assets: Asset[]) => void;
  title?: string;
};

const ImagePickerButton: React.FC<Props> = ({ onPicked, title = 'Add images' }) => {
  const pick = useCallback(() => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0, // 0 = unlimited
        quality: 0.8,
      },
      response => {
        if (response.didCancel || response.errorCode) return;
        onPicked(response.assets ?? []);
      },
    );
  }, [onPicked]);

  return <Button title={title} onPress={pick} />;
};

export default ImagePickerButton;
