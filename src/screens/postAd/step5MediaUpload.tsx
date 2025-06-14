import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View, Text, FlatList, Image, Pressable} from 'react-native';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import TextInput from '@components/Input/textInput';
import CommonImageUploader from '@components/Input/ImageUploader';

const Step5MediaUpload = (props: any) => {
  const [assets, setAssets] = useState<any[]>([]);

  const {
    currentStep,
    // handleSubmit,
    // errors,
    // touched,
    // setTouched,
    // setFieldValue,
    isStringInEitherArray,
  } = props;

  const removeAsset = useCallback((uri: string | undefined) => {
    if (!uri) return;
    setAssets(prev => prev.filter(item => item.uri !== uri));
  }, []);

  const renderItem = useCallback(
    ({item}: {item: any}) => (
      <View style={styles.previewContainer}>
        <Image
          source={{uri: item.uri}}
          style={styles.preview}
          resizeMode="cover"
        />
        <Pressable
          style={styles.removeBtn}
          onPress={() => removeAsset(item.uri)}>
          <Text style={styles.removeText}>✕</Text>
        </Pressable>
      </View>
    ),
    [removeAsset],
  );

  const keyExtractor = useCallback(
    (item: any) => item.uri ?? item.fileName ?? Math.random().toString(),
    [],
  );
const dedupByUri = (arr: any[]) => {
  const seen = new Set<string>();
  return arr.filter(item => {
    if (!item?.uri || seen.has(item.uri)) return false;
    seen.add(item.uri);
    return true;
  });
};
  const previews = useMemo(
    () => (
      <FlatList
        data={assets}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={styles.previewRow}
      />
    ),
    [assets, keyExtractor, renderItem],
  );

  return (
    <SlideInView direction={currentStep === 4 ? 'right' : 'left'}>
      <Text style={styles.headingText}>Property Features</Text>
      <View style={styles.inputContainer}>
        <CommonImageUploader
          onUpload={uri => setAssets(prev => dedupByUri([...prev, ...(uri ?? [])]))}
          label="Upload Property Images"
        />

        {previews}
      </View>
      <View style={styles.inputContainer}>
        <TextInput onChangeText={() => {}} placeholder="Video URL (YouTube)" />
      </View>

      {isStringInEitherArray('floorPlanUrls') && (
        <View style={styles.inputContainer}>
          <TextInput onChangeText={() => {}} placeholder="Upload Floor Plan" />
        </View>
      )}

      {isStringInEitherArray('floorPlanUrls') && (
        <View style={styles.inputContainer}>
          <CommonImageUploader
            onUpload={uri => console.log('Uploaded image:', uri)}
            label="Upload Floor Plan"
          />
        </View>
      )}
    </SlideInView>
  );
};

const styles = StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
  },
  priceInputContainer: {
    padding: 5,
    width: '70%',
  },
  priceUnitContainer: {
    padding: 5,
    width: '30%',
  },
  inputContainer: {
    padding: 5,
  },
  headingText: {
    color: '#171717',
    fontFamily: Fonts.MEDIUM,
    fontSize: 20,
    margin: 10,
    marginTop: 20,
  },

  previewRow: {gap: 12},
  previewContainer: {
    position: 'relative',
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default React.memo(Step5MediaUpload);
