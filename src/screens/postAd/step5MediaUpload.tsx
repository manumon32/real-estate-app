import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Image from 'react-native-fast-image';
import {Fonts} from '@constants/font';
import SlideInView from '../../components/AnimatedView';
import TextInput from '@components/Input/textInput';
import CommonImageUploader from '@components/Input/ImageUploader';
import ImagePickerModal from '@components/Modal/ImagePickerModal';
import useBoundStore from '@stores/index';
import CommonAmenityToggle from '@components/Input/amenityToggle';
import {useTheme} from '@theme/ThemeProvider';
import {useRoute} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Step5MediaUpload = (props: any) => {
  const route = useRoute();
  // @ts-ignore
  const items = route?.params?.items || null;
  const {setImages, setFloorPlans, images, floorPlans, managePlansList} =
    useBoundStore();
  const [assets, setAssets] = useState<any[]>(images || []);
  const [floorPlan, setFloorPlan] = useState<any[]>(floorPlans || []);
  const [showBoostPopup, setShowBoostPopup] = useState(false);

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

  const [price, setPrice] = useState(null);
  console.log('managePlansList', managePlansList);

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

  useEffect(() => {
    // @ts-ignore
    if (managePlansList?.[0].price) {
      // @ts-ignore
      setPrice(managePlansList?.[0].price);
    }
  }, [managePlansList]);

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

  const {theme} = useTheme();

  return (
    <SlideInView direction={currentStep === 4 ? 'right' : 'left'}>
      <Text style={[styles.headingText, {color: theme.colors.text}]}>
        Image Upload
      </Text>
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

      {!items?._id && (
        <View style={[styles.inputContainer, {flexDirection: 'row'}]}>
          <View style={{width: '90%'}}>
            <CommonAmenityToggle
              label={
                // @ts-ignore
                String(price)
                  ? // @ts-ignore
                    'Featured Property (₹' + String(price) + ')'
                  : 'Featured Property '
              }
              selected={values.featured}
              onToggle={() => setFieldValue('featured', !values.featured)}
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowBoostPopup(true)}
            style={{
              justifyContent: 'center',
              alignContent: 'center',
              margin: 10,
            }}>
            <MaterialCommunityIcons
              name="information"
              size={30}
              color="#3d94ffff"
            />
          </TouchableOpacity>
        </View>
      )}

      {showBoostPopup && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Feature Your Ad</Text>
            <Text style={styles.popupAmount}>Amount: ₹{price ?? 'N/A'}</Text>
            <Text style={styles.popupBenefits}>
              Benefits:
              {'\n'}• Get more visibility
              {'\n'}• Reach more buyers
              {'\n'}• Highlight your ad at the top
            </Text>
            <View style={styles.popupActions}>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  setShowBoostPopup(false);
                  // makePayment(selectedAd._id);
                }}>
                <Text style={styles.continueButtonText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

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

  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    zIndex: 999,
    borderRadius: 20,
  },
  popupContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  popupAmount: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  popupBenefits: {
    fontSize: 13,
    color: '#555',
    marginBottom: 16,
  },
  popupActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#333',
  },
  continueButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2A9D8F',
    borderRadius: 8,
  },
  continueButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

export default React.memo(Step5MediaUpload);
