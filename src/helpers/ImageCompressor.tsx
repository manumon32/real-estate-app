import {Image} from 'react-native-compressor';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';

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

    // 2️⃣ Set compression parameters dynamically
    let compressionOptions: any = {
      compressionMethod: 'auto',
      maxWidth: 1280,
      quality: 0.7,
    };

    if (sizeInMB > 20) {
      compressionOptions = {maxWidth: 800, maxHeight: 800, quality: 0.3};
    } else if (sizeInMB > 15) {
      compressionOptions = {maxWidth: 900, maxHeight: 900, quality: 0.4};
    } else if (sizeInMB > 10) {
      compressionOptions = {maxWidth: 1000, maxHeight: 1000, quality: 0.5};
    } else if (sizeInMB > 5) {
      compressionOptions = {maxWidth: 1200, maxHeight: 1200, quality: 0.6};
    }

    // 3️⃣ Compress
    const compressedUri = await Image.compress(uri, compressionOptions);

    // 4️⃣ Log new size
    // const compressedInfo = await RNFS.stat(compressedUri);
    // console.log(
    //   'Compressed image size:',
    //   (compressedInfo.size / (1024 * 1024)).toFixed(2),
    //   'MB',
    // );

    return compressedUri;
  } catch (error) {
    console.log('Image compression failed:', error);
    return uri; // fallback to original if compression fails
  }
};

export const checkImageValidation = async (assets: any[]) => {
  const MAX_FILE_SIZE_MB = 30;
  const TARGET_SIZE = 200 * 1024; // 200 KB
  var MAX_ATTEMPTS = 4;
  const validAssets: any[] = [];
  const skippedFiles: string[] = [];
  const oversizedFiles: string[] = [];

  for (const asset of assets) {
    const fileName = asset?.fileName || 'Unknown file';
    const mime = asset?.mime?.toLowerCase() ?? '';
    const ext = fileName.includes('.')
      ? fileName.split('.').pop()?.toLowerCase()
      : '';
    const sizeInMB = asset?.fileSize ? asset.fileSize / (1024 * 1024) : 0;

    // Type check
    const isValidType =
      ['image/jpeg', 'image/png'].includes(mime) ||
      ['jpg', 'jpeg', 'png'].includes(ext || '');
    if (!isValidType) {
      skippedFiles.push(fileName);
      continue;
    }

    // Size check
    if (sizeInMB > MAX_FILE_SIZE_MB) {
      oversizedFiles.push(`${fileName} (${sizeInMB.toFixed(1)}MB)`);
      continue;
    }

    // Compression
    let compressedUri = asset.uri;
    let quality = 0.8;
    let maxWidth = 1600;
    let attempt = 0;
    let initialSize = (await RNFS.stat(compressedUri)).size / (1024 * 1024);
    if (initialSize >= 20) {
      MAX_ATTEMPTS = 6;
    }

    try {
      while (attempt < MAX_ATTEMPTS) {
        const resultUri = await Image.compress(compressedUri, {
          compressionMethod: 'auto',
          quality,
          maxWidth,
          maxHeight: maxWidth,
        });

        const fileStat = await RNFS.stat(resultUri);
        if (fileStat.size <= TARGET_SIZE) {
          compressedUri = resultUri;
          break;
        }

        // Reduce quality & dimensions for next attempt
        quality -= 0.15;
        maxWidth = Math.floor(maxWidth * 0.8);
        compressedUri = resultUri;
        attempt += 1;
      }
    } catch (e) {
      console.warn('Compression failed for', fileName, e);
    }

    validAssets.push({
      ...asset,
      uri: compressedUri,
    });
  }

  // Show toasts
  if (skippedFiles.length > 0) {
    Toast.show({
      type: 'info',
      text1: 'Unsupported file(s) skipped',
      text2:
        skippedFiles.slice(0, 3).join(', ') +
        (skippedFiles.length > 3 ? ` +${skippedFiles.length - 3} more` : ''),
      position: 'bottom',
    });
  }

  if (oversizedFiles.length > 0) {
    Toast.show({
      type: 'warning',
      text1: `Images over ${MAX_FILE_SIZE_MB}MB were excluded`,
      text2:
        oversizedFiles.slice(0, 2).join(', ') +
        (oversizedFiles.length > 2
          ? ` +${oversizedFiles.length - 2} more`
          : ''),
      position: 'bottom',
    });
  }

  return validAssets;
};

export const checkImageValidationCrop = async (assets: any[]) => {
  const MAX_FILE_SIZE_MB = 30;
  const TARGET_SIZE = 200 * 1024; // 200 KB
  var MAX_ATTEMPTS = 4;
  const validAssets: any[] = [];
  const skippedFiles: string[] = [];
  const oversizedFiles: string[] = [];

  for (const asset of assets) {
    const fileName = asset?.fileName || 'Unknown file';
    const mime = asset?.mime?.toLowerCase() ?? '';
    const ext = fileName.includes('.')
      ? fileName.split('.').pop()?.toLowerCase()
      : '';
    const sizeInMB = asset?.size ? asset.size / (1024 * 1024) : 0;

    // Type check
    const isValidType =
      ['image/jpeg', 'image/png'].includes(mime) ||
      ['jpg', 'jpeg', 'png'].includes(ext || '');
    if (!isValidType) {
      skippedFiles.push(fileName);
      continue;
    }

    // Size check
    if (sizeInMB > MAX_FILE_SIZE_MB) {
      oversizedFiles.push(`${fileName} (${sizeInMB.toFixed(1)}MB)`);
      continue;
    }

    // Compression
    let compressedUri = asset.path;
    let quality = 0.8;
    let maxWidth = 1600;
    let attempt = 0;
    let initialSize = (await RNFS.stat(compressedUri)).size / (1024 * 1024);
    if (initialSize >= 20) {
      MAX_ATTEMPTS = 6;
    }

    try {
      while (attempt < MAX_ATTEMPTS) {
        const resultUri = await Image.compress(compressedUri, {
          compressionMethod: 'auto',
          quality,
          maxWidth,
          maxHeight: maxWidth,
        });

        const fileStat = await RNFS.stat(resultUri);
        if (fileStat.size <= TARGET_SIZE) {
          compressedUri = resultUri;
          break;
        }

        // Reduce quality & dimensions for next attempt
        quality -= 0.15;
        maxWidth = Math.floor(maxWidth * 0.8);
        compressedUri = resultUri;
        attempt += 1;
      }
    } catch (e) {
      console.warn('Compression failed for', fileName, e);
    }
    console.log('final', (await RNFS.stat(compressedUri)).size / (1024 * 1024));

    validAssets.push({
      ...asset,
      uri: compressedUri,
    });
  }

  // Show toasts
  if (skippedFiles.length > 0) {
    Toast.show({
      type: 'info',
      text1: 'Unsupported file(s) skipped',
      text2:
        skippedFiles.slice(0, 3).join(', ') +
        (skippedFiles.length > 3 ? ` +${skippedFiles.length - 3} more` : ''),
      position: 'bottom',
    });
  }

  if (oversizedFiles.length > 0) {
    Toast.show({
      type: 'warning',
      text1: `Images over ${MAX_FILE_SIZE_MB}MB were excluded`,
      text2:
        oversizedFiles.slice(0, 2).join(', ') +
        (oversizedFiles.length > 2
          ? ` +${oversizedFiles.length - 2} more`
          : ''),
      position: 'bottom',
    });
  }

  return validAssets;
};
