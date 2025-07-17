import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, Text, FlatList, Pressable} from 'react-native';
import Image from 'react-native-fast-image';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import TextInput from '@components/Input/textInput';
import CommonImageUploader from '@components/Input/ImageUploader';
import ImagePickerModal from '@components/Modal/ImagePickerModal';
import useBoundStore from '@stores/index';
import CommonAmenityToggle from '@components/Input/amenityToggle';

const Step5MediaUpload = (props: any) => {
  const {setImages, setFloorPlans, images, floorPlans} = useBoundStore();
  const [assets, setAssets] = useState<any[]>(images || []);
  const [floorPlan, setFloorPlan] = useState<any[]>(floorPlans || []);

  const [modalVisible, setModalVisible] = useState(false);
  const {
    currentStep,
    // handleSubmit,
    errors,
    touched,
    values,
    // setTouched,
    setFieldValue,
    isStringInEitherArray,
  } = props;

  const removeAsset = useCallback((uri: string | undefined) => {
    if (!uri) return;
    setAssets(prev =>
      prev.filter(item => (item.uri ? item.uri !== uri : item !== uri)),
    );
  }, []);

  const removeFloor = useCallback((uri: string | undefined) => {
    if (!uri) return;
    setFloorPlan(prev =>
      prev.filter(item => (item.uri ? item.uri !== uri : item !== uri)),
    );
  }, []);

  const renderItem = useCallback(
    ({item}: {item: any}) => (
      <View style={styles.previewContainer}>
        <Image
          source={{uri: item?.uri || item, cache: Image.cacheControl.immutable}}
          style={styles.preview}
          resizeMode="cover"
        />
        <Pressable
          style={styles.removeBtn}
          onPress={() => removeAsset(item?.uri || item)}>
          <Text style={styles.removeText}>✕</Text>
        </Pressable>
      </View>
    ),
    [removeAsset],
  );
  const renderItemFloor = useCallback(
    ({item}: {item: any}) => (
      <View style={styles.previewContainer}>
        <Image
          source={{
            uri: item?.uri || item,
            cache: Image.cacheControl.immutable,
          }}
          style={styles.preview}
          resizeMode="cover"
        />
        <Pressable
          style={styles.removeBtn}
          onPress={() => removeFloor(item?.uri || item)}>
          <Text style={styles.removeText}>✕</Text>
        </Pressable>
      </View>
    ),
    [removeFloor],
  );
  useEffect(() => {
    setImages(assets);
    setFieldValue('imageUrls', assets);
  }, [assets, setFieldValue, setImages]);

  useEffect(() => {
    setFloorPlans(floorPlan);
    setFieldValue('floorPlanUrl', floorPlan);
  }, [assets, floorPlan, setFieldValue, setFloorPlans]);

  const keyExtractor = useCallback(
    (item: any) => item.uri ?? item.fileName ?? Math.random().toString(),
    [],
  );
  // const dedupByUri = (arr: any[]) => {
  //   const seen = new Set<string>();
  //   return arr.filter(item => {
  //     if (!item?.uri || seen.has(item.uri)) return false;
  //     seen.add(item.uri);
  //     return true;
  //   });
  // };
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

  const previewsFloorPlan = useMemo(
    () => (
      <FlatList
        data={floorPlan}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItemFloor}
        contentContainerStyle={styles.previewRow}
      />
    ),
    [floorPlan, keyExtractor, renderItemFloor],
  );

  return (
    <SlideInView direction={currentStep === 4 ? 'right' : 'left'}>
      <Text style={styles.headingText}>Image Upload</Text>
      <View style={styles.inputContainer}>
        <CommonImageUploader
          onUpload={uri => setAssets(prev => [...prev, ...(uri ?? [])])}
          label="Upload Property Images"
          // handleOnpress={()=> setModalVisible(true)}
        />
        {touched?.imageUrls && errors?.imageUrls && (
          <Text style={styles.error}>{errors?.imageUrls}</Text>
        )}
        {previews}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={values?.videoUrl}
          onChangeText={text => {
            setFieldValue('videoUrl', text);
          }}
          placeholder="Video URL (YouTube)"
        />
      </View>

      {isStringInEitherArray('floorPlanUrls') && (
        <View style={styles.inputContainer}>
          <CommonImageUploader
            label="Upload Floor Plan"
            onUpload={uri => setFloorPlan(prev => [...prev, ...(uri ?? [])])}
          />
          {previewsFloorPlan}
        </View>
      )}



      <View style={styles.inputContainer}>
        <CommonAmenityToggle
          label="Featured Property"
          selected={values.featured}
          onToggle={() => setFieldValue('featured', !values.featured)}
        />
      </View>

      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImagesSelected={setAssets}
      />
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
  error: {
    color: 'red',
    marginBottom: 2,
    marginTop: 3,
    left: 10,
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
  },
});

export default React.memo(Step5MediaUpload);
