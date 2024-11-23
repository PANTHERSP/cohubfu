import React, { useContext, useEffect, useState, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { Linking, ScrollView, ActivityIndicator, FlatList, TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, Alert, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, Pressable, Modal } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons, Entypo, FontAwesome, FontAwesome5, AntDesign, MaterialIcons, FontAwesome6, Fontisto  } from '@expo/vector-icons';
import { UserLocationContext } from '../contexts/UserLocationContext';
import {createNativeStackNavigator, TransitionPresets} from '@react-navigation/native-stack';
import { auth, db } from '../config/firebase';

import MessageScreen from './MessageScreen';
import ProfileScreen from './ProfileScreen';
import LoadingScreen from './LoadingScreen';

import * as Location from 'expo-location';
import { AuthContext } from '../contexts/AuthContext';
import { NewFavoriteContext } from '../contexts/NewFavoriteContext';
import { GetPostsContext } from '../contexts/FilteredPostContext';
import { EditPostContext } from '../contexts/EditPostContext';
import { ShowImageDetailsContext } from '../contexts/ShowImageDetailsContext';

import { collection, addDoc, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
// import Animate from 'react-native-reanimated';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';



const ShowImageDetailsScreen = ({route, navigation}) => {

const [currentImageIndex, setCurrentImageIndex] = useContext(ShowImageDetailsContext);
const [currentImageIndexInShowImageDetailsScreen, setCurrentImageIndexInShowImageDetailsScreen] = useState(0);
;
useLayoutEffect(() => {
    setCurrentImageIndexInShowImageDetailsScreen(currentImageIndex);
}, [currentImageIndex])
    return (
        <>
<TouchableOpacity onPress={() => {navigation.goBack()}} style={{backgroundColor: 'white',
aspectRatio: 1,
height: h(5.5),
borderRadius: h(100),
justifyContent: 'center',
alignItems: 'center',
opacity: 0.4,
position:'absolute',
zIndex: 1,
marginTop: h(6),
marginLeft: w(6),
zIndex: 4
}}>
        <Ionicons name="arrow-back" size={h(3.5)} color="black" />
      </TouchableOpacity>
       
        <View style={{zIndex: 3,width:'100%',height:'100%',justifyContent:'center',alignItems:'center',backgroundColor: 'black'}}>




        

                


  
  

  <FlatList onViewableItemsChanged={(info) => setCurrentImageIndexInShowImageDetailsScreen(info.viewableItems[0].index)} initialScrollIndex={currentImageIndex} getItemLayout={(item, index) => ({length: w(100), offset: w(100) * index,})} pagingEnabled={true} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{}} keyExtractor={(item, index) => index} data={route.params} renderItem={({item}) => {
          return (
            
            
             <View style={{width: w(100),height: h(100),justifyContent:'center',}}>
            
                <Image source={{ uri: item  }} blurRadius={50} style={{width: '100%',height: '100%',}} />
            
                
                
                
                <View style={{position:'absolute',width: w(100),aspectRatio: 1,borderColor: 'white'}}>
               
                
                
                    <Image source={{ uri: item  }} style={{width: '100%',height: '100%',}} />
                
               
                </View>



            </View>

               

            
          )
        }} />

                <View style={{position: 'absolute',bottom: h(15),backgroundColor: 'rgba(255,255,255,0.6)',paddingHorizontal: h(1),borderRadius: h(2.5)}}>
                        <Text style={{fontSize:h(2.5),fontFamily:'PatrickHand-Regular',fontWeight:'bold',color: 'black'}}>{currentImageIndexInShowImageDetailsScreen + 1}/{route.params.length}</Text>
                    </View>

  
  


            
            
</View>      
            
            </>
            )
}

export default ShowImageDetailsScreen

const styles = StyleSheet.create({})





// import React, { useState, useContext, useLayoutEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, FlatList, Dimensions, StyleSheet, Animated } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { PinchGestureHandler, State, } from 'react-native-gesture-handler';
// // import Animated from 'react-native-reanimated';


// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// const ShowImageDetailsScreen = ({ route, navigation }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useContext(ShowImageDetailsContext);
//   const [currentImageIndexInShowImageDetailsScreen, setCurrentImageIndexInShowImageDetailsScreen] = useState(0);
//   const [baseScale, setBaseScale] = useState(1);
//   const [pinchScale, setPinchScale] = useState(new Animated.Value(1));
//   const [lastScale, setLastScale] = useState(1);

//   useLayoutEffect(() => {
//     setCurrentImageIndexInShowImageDetailsScreen(currentImageIndex);
//   }, []);

//   const onPinchGestureEvent = Animated.event(
//     [{ nativeEvent: { scale: pinchScale } }],
//     { useNativeDriver: true }
//   );

//   const onPinchHandlerStateChange = (event) => {
//     if (event.nativeEvent.oldState === State.ACTIVE) {
//       setBaseScale(baseScale * pinchScale);
//       setLastScale(baseScale * pinchScale);
//       pinchScale.setValue(1);
//     }
//   };

//   const onDoubleTap = () => {
//     const newScale = lastScale === 1 ? 2 : 1;
//     setLastScale(newScale);
//     Animated.timing(pinchScale, {
//       toValue: newScale,
//       duration: 200,
//       useNativeDriver: true,
//     }).start();
//   };

//   return (
//     <>
//       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Ionicons name="arrow-back" size={24} color="black" />
//       </TouchableOpacity>

//       <View style={styles.container}>
//         <FlatList
//           onViewableItemsChanged={(info) => setCurrentImageIndexInShowImageDetailsScreen(info.viewableItems[0].index)}
//           initialScrollIndex={currentImageIndex}
//           getItemLayout={(item, index) => ({ length: screenWidth, offset: screenWidth * index })}
//           pagingEnabled={true}
//           horizontal={true}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.flatListContentContainer}
//           keyExtractor={(item, index) => index.toString()}
//           data={route.params}
//           renderItem={({ item }) => (
//             <PinchGestureHandler
//               onGestureEvent={onPinchGestureEvent}
//               onHandlerStateChange={onPinchHandlerStateChange}
//               onHandlerActivated={onDoubleTap}
//             >
//               <Animated.Image source={{ uri: item }} style={[styles.image, { transform: [{ scale: pinchScale }] }]} resizeMode="contain" />
//             </PinchGestureHandler>
//           )}
//         />

//         <View style={styles.imageIndexContainer}>
//           <Text style={styles.imageIndexText}>
//             {currentImageIndexInShowImageDetailsScreen + 1}/{route.params.length}
//           </Text>
//         </View>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   backButton: {
//     backgroundColor: 'white',
//     aspectRatio: 1,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     opacity: 0.4,
//     position: 'absolute',
//     zIndex: 1,
//     marginTop: h(6),
//     marginLeft: w(6),
//     zIndex: 4,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'black',
//   },
//   flatListContentContainer: {
//     flexGrow: 1,
//   },
//   image: {
//     width: screenWidth,
//     height: screenHeight,
//   },
//   imageIndexContainer: {
//     position: 'absolute',
//     bottom: 60,
//     backgroundColor: 'rgba(255, 255, 255, 0.6)',
//     paddingHorizontal: 10,
//     borderRadius: 12.5,
//   },
//   imageIndexText: {
//     fontSize: 20,
//     fontFamily: 'PatrickHand-Regular',
//     fontWeight: 'bold',
//     color: 'black',
//   },
// });

// export default ShowImageDetailsScreen;
