import {Image} from 'react-native-compressor';

/**
 * Compress an image without losing visible quality
 * @param uri - Local file path or remote URL of the image
 * @returns Compressed image path (string)
 */
export const compressImage = async (uri: string): Promise<string> => {
  try {
    const compressedUri = await Image.compress(uri, {
      compressionMethod: 'auto', // smart compression
      quality: 1, // keep max quality
    //   maxWidth: 1920, // optional, keeps original size if smaller
    //   maxHeight: 1920,
    });

    return compressedUri;
  } catch (error) {
    console.error('Image compression failed:', error);
    return uri; // fallback to original if compression fails
  }
};
