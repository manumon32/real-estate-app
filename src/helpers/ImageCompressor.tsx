import {Image} from 'react-native-compressor';
import RNFS from 'react-native-fs';

/**
 * Compress an image without losing visible quality
 * @param uri - Local file path or remote URL of the image
 * @returns Compressed image path (string)
 */
export const compressImage = async (uri: string): Promise<string> => {
  try {
    // 1️⃣ Get original size
    const fileInfo = await RNFS.stat(uri);
    const sizeInMB = fileInfo.size / (1024 * 1024);

    console.log('Original image size:', sizeInMB.toFixed(2), 'MB');

    // 2️⃣ Set compression parameters dynamically
    let compressionOptions: any = {
      compressionMethod: 'auto',
      maxWidth: 1280,
      quality: 0.7,
    };

    if (sizeInMB > 20) {
      compressionOptions = {maxWidth: 800, quality: 0.3};
    } else if (sizeInMB > 15) {
      compressionOptions = {maxWidth: 900, quality: 0.4};
    } else if (sizeInMB > 10) {
      compressionOptions = {maxWidth: 1000, quality: 0.5};
    } else if (sizeInMB > 5) {
      compressionOptions = {maxWidth: 1200, quality: 0.6};
    }

    // 3️⃣ Compress
    const compressedUri = await Image.compress(
      uri,
      compressionOptions,
    );

    // 4️⃣ Log new size
    const compressedInfo = await RNFS.stat(compressedUri);
    console.log(
      'Compressed image size:',
      (compressedInfo.size / (1024 * 1024)).toFixed(2),
      'MB',
    );

    return compressedUri;
  } catch (error) {
    console.error('Image compression failed:', error);
    return uri; // fallback to original if compression fails
  }
};
