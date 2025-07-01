import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import CameraRoll, {
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';

type Props = {
  onSelect?: (photo: PhotoIdentifier) => void; // tap callback (optional)
  first?: number; // initial batch size
  numColumns?: number; // grid columns
};

const GalleryList: React.FC<Props> = ({
  onSelect,
  first = 60,
  numColumns = 3,
}) => {
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [pageInfo, setPageInfo] = useState<{
    endCursor: string;
    hasNextPage: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  /** --- permissions --------------------------------------------------- */
  const requestPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        // Android 13+ breaks out “images” separately
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ??
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handled by CameraRoll automatically
  }, []);

  /** --- fetchers ------------------------------------------------------- */
  const loadPhotos = useCallback(
    async (after?: string) => {
      if (loading) return;
      const ok = await requestPermission();
      if (!ok) return;

      setLoading(true);
      try {
        // @ts-ignore
        const {edges, page_info} = await CameraRoll.getPhotos({
          first,
          assetType: 'Photos',
          //   after,
        });
        console.log({edges, page_info});

        setPhotos(p => (after ? [...p, ...edges] : edges));
        setPageInfo({
          endCursor: page_info.end_cursor,
          hasNextPage: page_info.has_next_page,
        });
      } finally {
        setLoading(false);
      }
    },
    [first, loading, requestPermission],
  );

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  /** --- renderers ------------------------------------------------------ */
  const renderItem = useCallback(
    ({item}: {item: PhotoIdentifier}) => (
      <TouchableOpacity
        style={{flex: 1 / numColumns, aspectRatio: 1, margin: 2}}
        onPress={() => onSelect?.(item)}
        activeOpacity={0.8}>
        <Image
          source={{uri: item.node.image.uri}}
          resizeMode="cover"
          style={{flex: 1, borderRadius: 8}}
        />
      </TouchableOpacity>
    ),
    [onSelect, numColumns],
  );

  return (
    <FlatList
      data={photos}
      keyExtractor={(_, i) => String(i)}
      renderItem={renderItem}
      numColumns={numColumns}
      onEndReached={() =>
        pageInfo?.hasNextPage && loadPhotos(pageInfo.endCursor)
      }
      showsVerticalScrollIndicator={false}
      initialNumToRender={first}
    />
  );
};

export default GalleryList;
