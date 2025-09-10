/* eslint-disable react-native/no-inline-styles */
import {Fonts} from '@constants/font';
import {JSX} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  // BaseToast,
  BaseToastProps,
  // ErrorToast,
} from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const ToastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <View
      style={{
        backgroundColor: '#388E3C',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        margin: 10,
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        flexDirection: 'row',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}>
      <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
      <Text
        style={{
          color: '#fff',
          fontSize: 16,
          flex: 1,
          fontFamily: Fonts.MEDIUM,
        }}>
        {props.text1}
      </Text>
    </View>
    // <BaseToast
    //   {...props}
    //   style={{borderLeftColor: 'pink'}}
    //   contentContainerStyle={{paddingHorizontal: 15}}
    //   text1Style={{
    //     fontSize: 15,
    //     fontWeight: '400',
    //   }}
    // />
  ),
  newMessage: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <View
      style={{
        backgroundColor: '#388E3C',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        margin: 10,
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        flexDirection: 'row',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}>
      <MaterialCommunityIcons name="message" size={20} color="#fff" />
      <Text
        style={{
          color: '#fff',
          fontSize: 16,
          flex: 1,
          fontFamily: Fonts.MEDIUM,
        }}>
        {props.text1}
      </Text>
    </View>
    // <BaseToast
    //   {...props}
    //   style={{borderLeftColor: 'pink'}}
    //   contentContainerStyle={{paddingHorizontal: 15}}
    //   text1Style={{
    //     fontSize: 15,
    //     fontWeight: '400',
    //   }}
    // />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <View
      style={{
        backgroundColor: '#D32F2F',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        margin: 10,
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        flexDirection: 'row',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}>
      <MaterialCommunityIcons name="alert-circle" size={20} color="#fff" />
      <Text
        style={{
          color: '#fff',
          fontSize: 16,
          flex: 1,
          fontFamily: Fonts.MEDIUM,
        }}>
        {props.text1}
      </Text>
    </View>
    // <ErrorToast
    //   {...props}
    //   text1Style={{
    //     color: '#fff',
    //     fontSize: 14,
    //     flex: 1,
    //   }}
    //   text2Style={{
    //     color: '#fff',
    //     fontSize: 14,
    //     flex: 1,
    //   }}
    //   contentContainerStyle={{
    //     // backgroundColor: '#fe3232',
    //     backgroundColor: '#D32F2F',
    //     borderRadius: 8,
    //     paddingVertical: 12,
    //     paddingHorizontal: 16,
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     gap: 10,
    //     shadowColor: '#000',
    //     shadowOpacity: 0.1,
    //     shadowRadius: 8,
    //     elevation: 5,
    //   }}
    // />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({text1, props}: any) => (
    <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),

 info: (props: BaseToastProps & { onPress?: () => void }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={props.onPress} // <-- handle toast press
      style={{
        backgroundColor: '#1976D2',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 10,
        marginTop: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        gap: 4,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: props.text2 ? 4 : 0,
          width:'100%',
        }}>
        <MaterialCommunityIcons name="information" size={20} color="#fff" />
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            flex: 1,
            fontFamily: Fonts.MEDIUM,
            marginLeft: 8,
          }}>
          {props.text1}
        </Text>
      </View>
      {props.text2 ? (
        <Text
          style={{
            color: '#fff',
            fontSize: 12,
            flex: 1,
            fontFamily: Fonts.MEDIUM,
            marginLeft: 28,
          }}>
          {props.text2}
        </Text>
      ) : null}
    </TouchableOpacity>
  ),
};
