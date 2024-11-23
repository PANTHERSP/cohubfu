import React, { useContext, useEffect, useState, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { Linking, ScrollView, ActivityIndicator, FlatList, TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, Alert, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, Pressable, Modal, Platform } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, MarkerAnimated, MapPolyline, } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Ionicons, MaterialCommunityIcons, Entypo, FontAwesome, FontAwesome5, MaterialIcons, Fontisto, FontAwesome6, Feather  } from '@expo/vector-icons';
import { UserLocationContext } from '../contexts/UserLocationContext';
import {createNativeStackNavigator, TransitionPresets} from '@react-navigation/native-stack';
import { auth, db } from '../config/firebase';

import MessageScreen from './MessageScreen';
import ProfileScreen from './ProfileScreen';
import LoadingScreen from './LoadingScreen';
import ShowDetailsScreen from './ShowDetailsScreen';
import * as Location from 'expo-location';
import { AuthContext } from '../contexts/AuthContext';
import { NewFavoriteContext } from '../contexts/NewFavoriteContext';
import { NewPostContext } from '../contexts/NewPostContext';
import { EditPostContext } from '../contexts/EditPostContext';
import { FilteredPostContext } from '../contexts/FilteredPostContext';
import { FilteredAmenitiesContext } from '../contexts/FilteredAmenitiesContext';
import { FilteredAvailableSpacesContext } from '../contexts/FilteredAvailableSpacesContext';
import { FilteredNameContext } from '../contexts/FilteredNameContext';
import { FilteredOpenContext } from '../contexts/FilteredOpenContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { collection, addDoc, query, where, getDocs, doc, setDoc, getDoc, onSnapshot, deleteDoc, orderBy } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import Animate from 'react-native-reanimated';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
// import BottomSheet from 'reanimated-bottom-sheet';
// const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const HomeScreen = ({navigation, route}) => {


    // console.log(route.name, 'route name');

    const [isDarkTheme, setIsDarkTheme] = useContext(ThemeContext);

    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useContext(FilteredPostContext);
    const [filteredAmenities, setFilteredAmenities] = useContext(FilteredAmenitiesContext);
    const [filteredAvailableSpaces, setFilteredAvailableSpaces] = useContext(FilteredAvailableSpacesContext);
    const [filteredName, setFilteredName] = useContext(FilteredNameContext);
    const [filteredOpen, setFilteredOpen] = useContext(FilteredOpenContext);

    const [ mockAuth, setMockAuth ] = useContext(AuthContext);
    const [newFavorite, setNewFavorite] = useContext(NewFavoriteContext);
    const [newPost, setNewPost] = useContext(NewPostContext);
    const [editPost, setEditPost] = useContext(EditPostContext);
    const [reload, setReload] = useState(false);
    const [newMarker, setNewMarker] = useState(null);

    const [showInfo, setShowInfo] = useState(false);

    const [showDetails, setShowDetails] = useState(null);

    const favRef = useRef(false);
    // const [fav, setFav] = useState(false);

    const [isOpen, setIsOpen] = useState('open');
    const [openTimeOfThisDay, setOpenTimeOfThisDay] = useState('');
    
    
    // console.log(mockAuth, 'mockAuth');
    const mapRef = useRef(null);
    // const user = auth.currentUser;
    // console.log(auth.currentUser)
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingCurrentLocation, setIsFetchingCurrentLocation] = useState(false);
    const [allowLocation, setAllowLocation] = useState(false);
    // const {location,setLocation} = useContext(UserLocationContext);

    // const [location, setLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [currentRegion, setCurrentRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const bottomSheetModalRef = useRef(null);


    // useEffect(() => {
    //     setNewMarker(route.params?.markerCoordinate);
    // }, [route.params?.markerCoordinate]);


// useFocusEffect(
//     useCallback(() => {
        
//       getData(); 
        
//     }, [])
//   );

const getPosts = async () => {
    setIsLoading(true);
    const q = query(collection(db, "posts"), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q); 
    const postsSnapshot = querySnapshot.docs.map((doc) => ({postId: doc.id, ...doc.data()}) );
    // console.log(postsSnapshot)

    setPosts(postsSnapshot);

    setTimeout(() => {
        
        setIsLoading(false);
    }, 100)
}
const getData = async () => {

    setIsLoading(true);
        
      
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Lowest,});
    setCurrentLocation(location);
    // setCurrentRegion(location.coords);
  
    // console.log(location)

    const q = query(collection(db, "posts"), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q); 
    const postsSnapshot = querySnapshot.docs.map((doc) => ({postId: doc.id, ...doc.data()}) );
    // console.log(postsSnapshot, 'this is postsSnapshot')

    
   

    const editedPosts = await Promise.all(postsSnapshot.map( async (data) => {
        
        
        
    
    let isOpen;
    let openTimeOfThisDay;
      
     
       
    
        const thisDay = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date());
    
        const openTime = thisDay === 'Mon' ? data.openTime.mondayOpenTime : thisDay === 'Tue' ? data.openTime.tuesdayOpenTime : thisDay === 'Wed' ? data.openTime.wednesdayOpenTime : thisDay === 'Thu' ? data.openTime.thursdayOpenTime : thisDay === 'Fri' ? data.openTime.fridayOpenTime : thisDay === 'Sat' ? data.openTime.saturdayOpenTime : thisDay === 'Sun' ? data.openTime.sundayOpenTime : '';
        const closeTime = thisDay === 'Mon' ? data.openTime.mondayCloseTime : thisDay === 'Tue' ? data.openTime.tuesdayCloseTime : thisDay === 'Wed' ? data.openTime.wednesdayCloseTime : thisDay === 'Thu' ? data.openTime.thursdayCloseTime : thisDay === 'Fri' ? data.openTime.fridayCloseTime : thisDay === 'Sat' ? data.openTime.saturdayCloseTime : thisDay === 'Sun' ? data.openTime.sundayCloseTime : '';
        
        const formattedTime = openTime.time === 'Open 24 hours'|| closeTime.time === 'Open 24 hours' ? 'Open 24 hours' : openTime.time === 'Closed' || closeTime.time === 'Closed' ? 'Closed' : `${openTime.time} to ${closeTime.time}`;
        
        openTimeOfThisDay = formattedTime
        
    
        
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const thisTimeFromMidnight = currentHour * 60 + currentMinute;
    
    
        if (openTime.time === 'Open 24 hours' || closeTime.time === 'Open 24 hours') {
            isOpen = 'open';
    
        }
        else if (openTime.time === 'Closed' || closeTime.time === 'Closed') {
            isOpen = 'closed';
        }
        else if (openTime.timeFromMidnight < closeTime.timeFromMidnight) {
            if (thisTimeFromMidnight >= openTime.timeFromMidnight && thisTimeFromMidnight <= closeTime.timeFromMidnight) {
                isOpen = 'open';
            } else {
                isOpen = 'closed';
            }
        }
        else if (openTime.timeFromMidnight > closeTime.timeFromMidnight) {
            if (thisTimeFromMidnight >= openTime.timeFromMidnight || thisTimeFromMidnight <= closeTime.timeFromMidnight) {
                isOpen = 'open';
            } else {
                isOpen = 'closed';
            }
        }

        delete data.isOpen;
        delete data.openTimeOfThisDay;

        const formattedPost = {isOpen: isOpen, openTimeOfThisDay: openTimeOfThisDay, ...data};

        const docRefP = doc(db, "posts", formattedPost.postId);
        await setDoc(docRefP, {
            ...formattedPost
        })

        return formattedPost
        
        
    }))

    setFilteredOpen('');
    setFilteredAmenities([]);
    setFilteredAvailableSpaces([]);
        
    setPosts(editedPosts);
    // console.log(editedPosts, 'this is editedPosts')

   

    // moveToMyLatestPost();

    // setTimeout(() => {
        
    //     mapRef.current.animateToRegion({
    //       latitude: newPost[0].markerCoordinate?.latitude,
    //       longitude: newPost[0].markerCoordinate?.longitude,
    //       latitudeDelta: 0.001,
    //       longitudeDelta: 0.001,
    //     })
    // },500)

    




    setTimeout(() => {
        
        setIsLoading(false);

        
    },100)
// setTimeout(() => {
    
//     console.log( 'newMarker',newMarker)
//     if(newMarker) {
//         mapRef.current.animateToRegion({
//             latitude: newMarker.latitude,
//             longitude: newMarker.longitude,
//             latitudeDelta: 0.005,
//             longitudeDelta: 0.005,
//             // duration: 10000
//           },1500)
//     }
// },300)
  }


  useLayoutEffect(() => {
      setPosts(filteredPosts)
  }, [filteredPosts])

  useLayoutEffect(() => {

    
    
    getData();
    // console.log( 'newMarker',newMarker)
    // if(newMarker) {
    //     mapRef.current.animateToRegion({
    //         latitude: newMarker.latitude,
    //         longitude: newMarker.longitude,
    //         latitudeDelta: 0.01,
    //         longitudeDelta: 0.01,
    //       })
    // }

  }, [mockAuth, route.params]);

  useEffect(() => {
      getData();
    //   setShowInfo(false);
    //   moveToMyLatestEditPost();
  }, [editPost])

  const moveToMyLatestEditPost = async () => {

    if (editPost.length === 0) {
        return;
    }
    setTimeout(() => {
        
        mapRef.current.animateToRegion({
          latitude: editPost.markerCoordinate.coordinate.latitude,
          longitude: editPost.markerCoordinate.coordinate.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        },0)
    },3000)
  }
  
  
  useEffect(() => {

    getData();
    moveToMyFilteredNamePost();
    
      
  }, [filteredName])

  const moveToMyFilteredNamePost = async () => {

    if (!filteredName) {
        return;
    }

    

    let isOpen;
    let openTimeOfThisDay;
      
      const docRef = doc(db, "posts", filteredName.postId);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        // setPost(data);
    
        const thisDay = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date());
    
        const openTime = thisDay === 'Mon' ? data.openTime.mondayOpenTime : thisDay === 'Tue' ? data.openTime.tuesdayOpenTime : thisDay === 'Wed' ? data.openTime.wednesdayOpenTime : thisDay === 'Thu' ? data.openTime.thursdayOpenTime : thisDay === 'Fri' ? data.openTime.fridayOpenTime : thisDay === 'Sat' ? data.openTime.saturdayOpenTime : thisDay === 'Sun' ? data.openTime.sundayOpenTime : '';
        const closeTime = thisDay === 'Mon' ? data.openTime.mondayCloseTime : thisDay === 'Tue' ? data.openTime.tuesdayCloseTime : thisDay === 'Wed' ? data.openTime.wednesdayCloseTime : thisDay === 'Thu' ? data.openTime.thursdayCloseTime : thisDay === 'Fri' ? data.openTime.fridayCloseTime : thisDay === 'Sat' ? data.openTime.saturdayCloseTime : thisDay === 'Sun' ? data.openTime.sundayCloseTime : '';
        
        const formattedTime = openTime.time === 'Open 24 hours'|| closeTime.time === 'Open 24 hours' ? 'Open 24 hours' : openTime.time === 'Closed' || closeTime.time === 'Closed' ? 'Closed' : `${openTime.time} to ${closeTime.time}`;
        
        openTimeOfThisDay = formattedTime
        
    
        
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const thisTimeFromMidnight = currentHour * 60 + currentMinute;
    
    
        if (openTime.time === 'Open 24 hours' || closeTime.time === 'Open 24 hours') {
            isOpen = 'open';
    
        }
        else if (openTime.time === 'Closed' || closeTime.time === 'Closed') {
            isOpen = 'closed';
        }
        else if (openTime.timeFromMidnight < closeTime.timeFromMidnight) {
            if (thisTimeFromMidnight >= openTime.timeFromMidnight && thisTimeFromMidnight <= closeTime.timeFromMidnight) {
                isOpen = 'open';
            } else {
                isOpen = 'closed';
            }
        }
        else if (openTime.timeFromMidnight > closeTime.timeFromMidnight) {
            if (thisTimeFromMidnight >= openTime.timeFromMidnight || thisTimeFromMidnight <= closeTime.timeFromMidnight) {
                isOpen = 'open';
            } else {
                isOpen = 'closed';
            }
        }

        delete filteredName.isOpen;
        delete filteredName.openTimeOfThisDay;
        delete data.isOpen;
        delete data.openTimeOfThisDay;


        const formattedPost = {isOpen: isOpen, openTimeOfThisDay: openTimeOfThisDay, ...filteredName};

        setTimeout(() => {
        
            mapRef.current.animateToRegion({
              latitude: filteredName.markerCoordinate.coordinate.latitude,
              longitude: filteredName.markerCoordinate.coordinate.longitude,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            })
        }, 1500)
        
        setTimeout(() => {
              
            
              handleShowInfo(formattedPost)
          },0)
}


      
  






  useEffect(() => {

    getData();
    moveToMyLatestPost();
    
      
  }, [newPost])




  const moveToMyLatestPost = async () => {


    if (newPost.length === 0) {
        return;
    }
    


    let isOpen;
            let openTimeOfThisDay;
              
              const docRef = doc(db, "posts", newPost[0].postId);
                const docSnap = await getDoc(docRef);
                const data = docSnap.data();
                // setPost(data);
            
                const thisDay = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date());
            
                const openTime = thisDay === 'Mon' ? data.openTime.mondayOpenTime : thisDay === 'Tue' ? data.openTime.tuesdayOpenTime : thisDay === 'Wed' ? data.openTime.wednesdayOpenTime : thisDay === 'Thu' ? data.openTime.thursdayOpenTime : thisDay === 'Fri' ? data.openTime.fridayOpenTime : thisDay === 'Sat' ? data.openTime.saturdayOpenTime : thisDay === 'Sun' ? data.openTime.sundayOpenTime : '';
                const closeTime = thisDay === 'Mon' ? data.openTime.mondayCloseTime : thisDay === 'Tue' ? data.openTime.tuesdayCloseTime : thisDay === 'Wed' ? data.openTime.wednesdayCloseTime : thisDay === 'Thu' ? data.openTime.thursdayCloseTime : thisDay === 'Fri' ? data.openTime.fridayCloseTime : thisDay === 'Sat' ? data.openTime.saturdayCloseTime : thisDay === 'Sun' ? data.openTime.sundayCloseTime : '';
                
                const formattedTime = openTime.time === 'Open 24 hours'|| closeTime.time === 'Open 24 hours' ? 'Open 24 hours' : openTime.time === 'Closed' || closeTime.time === 'Closed' ? 'Closed' : `${openTime.time} to ${closeTime.time}`;
                
                openTimeOfThisDay = formattedTime
                
            
                
                const currentTime = new Date();
                const currentHour = currentTime.getHours();
                const currentMinute = currentTime.getMinutes();
                const thisTimeFromMidnight = currentHour * 60 + currentMinute;
            
            
                if (openTime.time === 'Open 24 hours' || closeTime.time === 'Open 24 hours') {
                    isOpen = 'open';
            
                }
                else if (openTime.time === 'Closed' || closeTime.time === 'Closed') {
                    isOpen = 'closed';
                }
                else if (openTime.timeFromMidnight < closeTime.timeFromMidnight) {
                    if (thisTimeFromMidnight >= openTime.timeFromMidnight && thisTimeFromMidnight <= closeTime.timeFromMidnight) {
                        isOpen = 'open';
                    } else {
                        isOpen = 'closed';
                    }
                }
                else if (openTime.timeFromMidnight > closeTime.timeFromMidnight) {
                    if (thisTimeFromMidnight >= openTime.timeFromMidnight || thisTimeFromMidnight <= closeTime.timeFromMidnight) {
                        isOpen = 'open';
                    } else {
                        isOpen = 'closed';
                    }
                }

                const formattedPost = {isOpen: isOpen, openTimeOfThisDay: openTimeOfThisDay, ...newPost[0]};

                setTimeout(() => {
        
                    mapRef.current.animateToRegion({
                      latitude: newPost[0].markerCoordinate.coordinate.latitude,
                      longitude: newPost[0].markerCoordinate.coordinate.longitude,
                      latitudeDelta: 0.001,
                      longitudeDelta: 0.001,
                    })
                }, 1500)
                
                setTimeout(() => {
                      
                    
                      handleShowInfo(formattedPost)
                  },0)
  }

//   let text = 'Waiting..';
//   if (errorMsg) {
//     text = errorMsg;
//   } else if (location) {
//     text = JSON.stringify(location);
    
//   }

  const handleSetCurrentLocation = async () => {
    // if(isFetchingCurrentLocation) {
    //     console.log('fetching')
    //     return;
    // }
    // setIsFetchingCurrentLocation(true);
    // try {
      let _currentLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Lowest});
    //   setCurrentLocation(_currentLocation);
    //   console.log(_currentLocation)
      mapRef.current.animateToRegion({
        latitude: _currentLocation.coords.latitude,
        longitude: _currentLocation.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      })
      

    
}

    const handleShowInfo = (post) => {
        
       
        
        setShowInfo(post);
    }


    const renderContent = () => (
        <View
          style={{
            backgroundColor: 'white',
            padding: 16,
            height: 450,
          }}
        >
          <Text>Swipe down to close</Text>
        </View>
      );

    
        const handleOpenMap = (post) => {
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${post.markerCoordinate.coordinate.latitude},${post.markerCoordinate.coordinate.longitude}`);
        }
        
        


    const Info = useMemo(() => ({ post }) => {
       

        // const [isLoadingImage, setIsLoadingImage] = useState(true);
        // setTimeout(() => {
        //     setIsLoadingImage(false);
        // }, 250)

        const snapPoints = Platform.OS === 'ios' ? ['47%',] : Platform.OS === 'android' ? ['49.7%'] : null//['40%','85%']

        return (
            
            
       <BottomSheet
         ref={bottomSheetModalRef}
         onChange={handleSheetChanges}
         snapPoints={snapPoints}
         enablePanDownToClose
         animateOnMount={true}
         enableContentPanningGesture={true}
         
        //  onAnimate={( ) => console.log('animating')}
         
         backgroundStyle={{
           backgroundColor: 'rgba(255,255,255,0.9)',
        
           alignItems: 'center',
           justifyContent: 'center',
           borderRadius: h(6)
           , shadowRadius: 5,shadowOffset: { width: 0, height:  0},shadowOpacity: 0.8



         }}
       >
        
         {/* <BottomSheetView style={{flex: 1,flexDirection: 'column',marginHorizontal: w(4),}}> */}
            
            {/* <Text style={{fontSize: h(2),color: 'black',fontFamily: 'PatrickHand-Regular',}}><Text style={{fontWeight: 'bold'}}>Posted by: </Text>{post.username}</Text> */}
            
         <BottomSheetViewInfo post={post}/>
         {/* </BottomSheetView> */}
         
       </BottomSheet>
       
     
        )
    }, [showInfo])


    const BottomSheetViewInfo = ({post}) => {


        const [isLoadingImage, setIsLoadingImage] = useState(true);
        setTimeout(() => {
            setIsLoadingImage(false);
        }, 250)

        return (
            <BottomSheetView style={{flex: 1,flexDirection: 'column',marginHorizontal: w(4),}}>

                
            <TouchableOpacity style={{width: '100%',height: '100%'}} onPress={() => {navigation.navigate('ShowDetailsScreen', post)}}>
            <View style={{width: '100%',aspectRatio: 2.4,backgroundColor: 'rgba(0,0,0,0.11)',marginTop: h(0),borderRadius: h(3)}}>
            <Image source={ !isLoadingImage ? {uri: post.imageList[0]} : null} style={{width: '100%',height: '100%',borderRadius: h(3),}}/>
            </View>
<View style={{marginTop: h(1.2),gap: h(0.5),paddingHorizontal: w(2)}}>

    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height: h(3.8)}}>
            <Text numberOfLines={1} style={{width: w(75),fontSize: h(2.7),color: 'black',fontFamily: 'PatrickHand-Regular',fontWeight: 'bold',}}>{post.nameOfCoWorkingSpace}</Text>
           <LikeButton post={post}/>
        </View>
            <View style={{flexDirection:'row',alignItems:'center',}}>
                <FontAwesome5 name="map-marker-alt" size={h(2)} color="#505050" />
                <Text numberOfLines={1} style={{width: w(75),fontSize: h(2),color: '#505050',fontFamily: 'PatrickHand-Regular',}}>  {post.addressOfCoWorkingSpace}</Text>
            </View>
            
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',}}>
        <Text style={{fontSize:h(2),fontFamily:'PatrickHand-Regular',fontWeight:'bold',}}>{post.openTimeOfThisDay}</Text>
        <Text style={{paddingRight: w(2),fontSize:h(2.2),fontFamily:'PatrickHand-Regular',fontWeight:'bold',color: post.isOpen === 'closed' ? 'red' : 'green'}}>{post.isOpen}</Text>
        </View>



        <View style={{marginTop: h(0),width: '100%',height: h(5),flexDirection: 'row',gap: w(2),alignItems: 'center',}}>



        <TouchableOpacity onPress={() => handleOpenMap(post)} style={{backgroundColor: '#014F8E',
    // width: w(),
    height: h(3.8),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.6,
    flexDirection: 'row',
    // alignSelf: 'flex-start',
    // marginTop: h(8)
    }}>
        <LinearGradient colors={[ '#A9CDF5','#00192E', '#014F8E',]} style={{height: h(3.8),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.6,
    flexDirection: 'row',}}>
                <Ionicons name="navigate-circle-sharp" size={h(2.6)} color="#e5e5e5" style={{paddingLeft: w(2)}} />
                <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(1.95),color: '#e5e5e5',paddingRight: w(2)}}> Directions</Text>
        </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
          Linking.openURL(`tel:${post.phoneNumber}`)
        }} style={{
    // width: w(),
    height: h(3.8),
    borderRadius: h(100),
    borderWidth: h(0.2),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.6,
    flexDirection: 'row',
    // alignSelf: 'flex-start',
    // marginTop: h(8)
    }}>
                <Feather name="phone" size={h(2.6)} color="black" style={{paddingLeft: w(2)}} />
                <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(1.95),color: 'black',paddingRight: w(2)}}> Call</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
        //   Linking.openURL(`tel:${post.phoneNumber}`)
        }} style={{
    // width: w(),
    height: h(3.8),
    borderRadius: h(100),
    borderWidth: h(0.2),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.6,
    flexDirection: 'row',
    // alignSelf: 'flex-start',
    // marginTop: h(8)
    }}>
                <Ionicons name="share-social-outline" size={h(2.6)} color="black" style={{paddingLeft: w(2)}} />
                <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(1.95),color: 'black',paddingRight: w(2)}}> Share</Text>
              </TouchableOpacity>
                

        </View>
        </View>
            
            



              </TouchableOpacity>
              </BottomSheetView>
        )
        
    }



    const LikeButton = ({post}) => {

        if (!mockAuth) {
            
            return;
        }

        const [fav, setFav] = useState(false);
        const [isLoadingLikeButton, setIsLoadingLikeButton] = useState(true);

        const getUserData = async (post) => {
            
            
            
            
            const docRef = doc(db, "users", mockAuth.currentUser.uid); 
            const querySnapshot = await getDoc(docRef); 
            const dataSnapshot = querySnapshot.data();
            
            if (dataSnapshot.favorites.some((item) => item.postId === post.postId)) {
                setFav(true);
            } else {
                setFav(false);
            }
            
            console.log(fav)
            setIsLoadingLikeButton(false);
        }

        getUserData(post)
        
        const handleFavorite = async (post) => {
            try {
                const docRef = doc(db, "users", mockAuth.currentUser.uid); 
                const querySnapshot = await getDoc(docRef); 
                const dataSnapshot = querySnapshot.data();
    
                    
                if (fav === false) {
                
                await setDoc(docRef, {
                    uid: dataSnapshot.uid,
                    username: dataSnapshot.username,
                    email: dataSnapshot.email,
                    phoneNumber: dataSnapshot.phoneNumber,
                    address: dataSnapshot.address,
                    favorites: [post, ...dataSnapshot.favorites],
                    myPosts: dataSnapshot.myPosts,
                    
                    
                })
                setFav(true);
                setNewFavorite([post, ...dataSnapshot.favorites])
            
            } else {
    
                await setDoc(docRef, {
                    uid: dataSnapshot.uid,
                    username: dataSnapshot.username,
                    email: dataSnapshot.email,
                    phoneNumber: dataSnapshot.phoneNumber,
                    address: dataSnapshot.address,
                    favorites: dataSnapshot.favorites.filter((item) => item.postId !== post.postId),
                    myPosts: dataSnapshot.myPosts,
                    
                    
                })
                setFav(false);
                setNewFavorite(dataSnapshot.favorites.filter((item) => item.postId !== post.postId))
            }
    
            } catch (e) {
                
                console.error("Error adding document: ", e);
            }
        }
        
        
        
        return (
            
            <TouchableOpacity style={{paddingRight: w(2)}} onPress={() => handleFavorite(post)}>
        
        { !isLoadingLikeButton && ( fav ? <Ionicons name="heart" size={h(3.5)} color="#ff2060"  style={{}} /> :
        <Ionicons name="heart-outline" size={h(3.5)} color="black"  style={{}} /> )
        }
        </TouchableOpacity>
        )
    }


    const handleSheetChanges = (index) => {
        if (index === -1) {
          setShowInfo(null)
        }
      };


  return (
    // <View>
    <>
{ isLoading ? <LoadingScreen /> :
    
    <View style={{flex:1,}}>
    {/* <> */}
    <MapView 
    ref={mapRef}
    showsUserLocation={true}
    style={styles.map}
    // onRegionChange={(region) => {
        
    // }}
    onPress={(Event) => {
        //   const {coordinate} = Event.nativeEvent;
        //   setMarkerCoordinate(coordinate);
        }}
        
        provider={PROVIDER_GOOGLE}
        customMapStyle={isDarkTheme ? customMapStyle3 : customMapStyle5}
        initialRegion={{
          latitude: currentLocation?.coords.latitude,
          longitude: currentLocation?.coords.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        // region={{
        //   latitude: currentLocation.coords.latitude,
        //   longitude: currentLocation.coords.longitude,
        //   latitudeDelta: 0.01,
        //   longitudeDelta: 0.01,
        // }}
        // onRegionChange={(region) => {
        //     bottomSheetModalRef.current?.snapToIndex(0);
            
        // }}
        // onRegionChangeComplete={(region) => {
        //     setCurrentRegion(region)
        //     // console.log(region)
        // }}
        showsCompass={false}
        showsMyLocationButton={false}
        showsBuildings={false}
        showsIndoors={false}
        showsPointsOfInterest={false}
        // showsTraffic={true}
        // showsScale={true}
        // showsUserLocation={true}
        mapType='standard'
        >
        {posts.map((post) => (
          <Marker key={post.postId} coordinate={{latitude: post.markerCoordinate.coordinate.latitude, longitude: post.markerCoordinate.coordinate.longitude}} onPress={ async () => {
            

            mapRef.current.animateToRegion({
                latitude: post.markerCoordinate.coordinate.latitude,
                longitude: post.markerCoordinate.coordinate.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              },400)

            let isOpen;
            let openTimeOfThisDay;
              
              const docRef = doc(db, "posts", post.postId);
                const docSnap = await getDoc(docRef);
                const data = docSnap.data();
                // setPost(data);
            
                const thisDay = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date());
            
                const openTime = thisDay === 'Mon' ? data.openTime.mondayOpenTime : thisDay === 'Tue' ? data.openTime.tuesdayOpenTime : thisDay === 'Wed' ? data.openTime.wednesdayOpenTime : thisDay === 'Thu' ? data.openTime.thursdayOpenTime : thisDay === 'Fri' ? data.openTime.fridayOpenTime : thisDay === 'Sat' ? data.openTime.saturdayOpenTime : thisDay === 'Sun' ? data.openTime.sundayOpenTime : '';
                const closeTime = thisDay === 'Mon' ? data.openTime.mondayCloseTime : thisDay === 'Tue' ? data.openTime.tuesdayCloseTime : thisDay === 'Wed' ? data.openTime.wednesdayCloseTime : thisDay === 'Thu' ? data.openTime.thursdayCloseTime : thisDay === 'Fri' ? data.openTime.fridayCloseTime : thisDay === 'Sat' ? data.openTime.saturdayCloseTime : thisDay === 'Sun' ? data.openTime.sundayCloseTime : '';
                
                const formattedTime = openTime.time === 'Open 24 hours'|| closeTime.time === 'Open 24 hours' ? 'Open 24 hours' : openTime.time === 'Closed' || closeTime.time === 'Closed' ? 'Closed' : `${openTime.time} to ${closeTime.time}`;
                
                openTimeOfThisDay = formattedTime
                
            
            
                const currentTime = new Date();
                const currentHour = currentTime.getHours();
                const currentMinute = currentTime.getMinutes();
                const thisTimeFromMidnight = currentHour * 60 + currentMinute;
            
            
                if (openTime.time === 'Open 24 hours' || closeTime.time === 'Open 24 hours') {
                    isOpen = 'open';
            
                }
                else if (openTime.time === 'Closed' || closeTime.time === 'Closed') {
                    isOpen = 'closed';
                }
                else if (openTime.timeFromMidnight < closeTime.timeFromMidnight) {
                    if (thisTimeFromMidnight >= openTime.timeFromMidnight && thisTimeFromMidnight <= closeTime.timeFromMidnight) {
                        isOpen = 'open';
                    } else {
                        isOpen = 'closed';
                    }
                }
                else if (openTime.timeFromMidnight > closeTime.timeFromMidnight) {
                    if (thisTimeFromMidnight >= openTime.timeFromMidnight || thisTimeFromMidnight <= closeTime.timeFromMidnight) {
                        isOpen = 'open';
                    } else {
                        isOpen = 'closed';
                    }
                }

                const formattedPost = {isOpen: isOpen, openTimeOfThisDay: openTimeOfThisDay, ...post}

                
                
                setTimeout(() => {
                      
                    
                      handleShowInfo(formattedPost)
                  },0)
                
                
                
                
                
                
            

              
                


        
        }
        }
          >
            <Image source={require('../assets/marker.png')} style={{aspectRatio: 0.7, height: 50}} />

                <Callout tooltip={true} style={{height: h(5),aspectRatio: 4}} onPress={() => {}}>
                  <View borderRadius={h(2)} style={{ paddingHorizontal: w(2),backgroundColor: 'white', width: '100%', height: '100%',flexDirection: 'column',alignItems: 'center',justifyContent: 'center',display: 'flex',}}>
                    {/* {setTimeout(() => {
                        return (
                            
                            <Image source={{uri: post.image}} style={{aspectRatio: 1, height: '100%',borderRadius: h(2) }}/>
                        )
                    },500)} */}
                    <Text numberOfLines={1} style={{fontSize: h(2),color: 'black',fontFamily: 'PatrickHand-Regular',fontWeight: 'bold'}}>{post.nameOfCoWorkingSpace}</Text>
                    {/* <Text style={{fontSize: h(1.8),color: 'black',fontFamily: 'PatrickHand-Regular',}}><Text style={{fontWeight: 'bold'}}>Posted by: </Text>{post.username}</Text> */}
                  </View>
                </Callout>
          </Marker>
        ))}

        {/* <MapViewDirections origin={{latitude: currentLocation?.coords.latitude, longitude: currentLocation?.coords.longitude}} destination={{latitude: 13.726567172852496, longitude: 100.7753174006939}} apikey={'AIzaSyBZdHmnOqUzC85ZsCPz1IX89JDeoCpyfPY'} strokeWidth={5} strokeColor='red'/> */}
                        
        {/* latitude
13.726567172852496


longitude
100.7753174006939 */}

        
        
          
          </MapView>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}

        <View style={{width: w(16), height: h(7),position: 'absolute',top: h(4.7),left: w(4.7)}}>
            <Image source={require('../assets/logo.png')} style={{height: '100%',width: '100%'}} />
            </View>
        
          <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')} style={{position:'absolute',opacity: 0.8,alignSelf: 'center',backgroundColor: isDarkTheme ? 'black' : 'white',borderRadius: h(100),width: w(55),height: h(6),flexDirection: 'row',marginTop: h(5.2),alignItems: 'center',justifyContent: 'space-between',}}>
            <View style={{fontSize: h(2.4),fontFamily: 'PatrickHand-Regular',paddingLeft: w(5),width: '77%',height: '100%',backgroundColor: isDarkTheme ? 'black' : 'white',borderRadius: h(100),justifyContent: 'center'}} >
                <Text style={{fontSize: h(2.4),fontFamily: 'PatrickHand-Regular',color: isDarkTheme ? 'white' : 'black'}}>Search</Text>
                </View>
              
                <View>
                  <Ionicons name="search-circle" size={h(5.5)} color={isDarkTheme ? 'white' : 'black'} style={{paddingRight: w(10)}}/>
                </View>
              
            
          </TouchableOpacity>        
            {/* <View style={{position:'absolute',right:20,marginTop:52}}> */}
              
              
              
              <View style={{marginTop: h(5.2),marginRight: w(3),width: h(6),height: h(28),justifyContent: 'space-between',alignSelf: 'flex-end',}}>
              
              <TouchableOpacity onPress={() => {navigation.navigate('FilterScreen')}} style={{backgroundColor: isDarkTheme ? 'black' : 'white',
    aspectRatio: 1,
    height: h(6),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8}}>
                <MaterialCommunityIcons name={'filter-outline'} size={h(3.5)} color={isDarkTheme ? 'white' : 'black'} style={{}} />
              </TouchableOpacity>
            {/* </View> */}
          
          {/* <View style={{position:'absolute',right:20,marginTop:112,}}> */}
          <TouchableOpacity onPress={() => {setIsDarkTheme(!isDarkTheme)}} style={{backgroundColor: isDarkTheme ? 'black' : 'white',
      aspectRatio: 1,
      height: h(6),
      borderRadius: h(100),
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.8}}>
            <Ionicons name={isDarkTheme ? 'invert-mode-outline' : 'invert-mode-outline'} size={h(3.5)} color={isDarkTheme ? 'white' : 'black'} />
            
          </TouchableOpacity>
            <TouchableOpacity onPress={handleSetCurrentLocation} style={{backgroundColor: isDarkTheme ? 'black' : 'white',
    aspectRatio: 1,
    height: h(6),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8}}>
              <MaterialCommunityIcons name="crosshairs-gps" size={h(3.5)} color={isDarkTheme ? 'white' : 'black'} />
            </TouchableOpacity>
          {/* </View> */}

          {/* <View style={{position:'absolute',right:20,marginTop:172,}}> */}
          {/* </View> */}

          {/* <View style={{position:'absolute',right:20,marginTop:232,}}> */}
            {/* <TouchableOpacity onPress={() => {navigation.navigate('PinMarkerScreen')}} style={{backgroundColor: 'white',
    aspectRatio: 1,
    height: h(6),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6}}>
              <Entypo name="pin" size={h(3.5)} color="black" />
            </TouchableOpacity> */}
          {/* </View> */}
          
          {/* <View style={{position:'absolute',right:20,marginTop:292,}}> */}
            <TouchableOpacity onPress={getData} style={{backgroundColor: isDarkTheme ? 'black' : 'white',
    aspectRatio: 1,
    height: h(6),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8}}>
            <Ionicons name="refresh" size={h(3.5)} color={isDarkTheme ? 'white' : 'black'} />
            </TouchableOpacity>
            
            
            </View>
          {/* </View> */}


            { showInfo && <Info post={showInfo} /> }
            {/* { true && <ShowDetailsScreen post={showDetails} /> } */}
        {/* </TouchableWithoutFeedback> */}
          </View>
    }
           </>      
    );
};

const styles = StyleSheet.create({
  map: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  
  searchBox: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    borderRadius: 30,
    paddingLeft: 20,
    fontSize: 20,
    fontWeight: '300',
    opacity: 0.8,
    fontFamily: 'PatrickHand-Regular'
  },
  iconStyle: {
    backgroundColor: '#ffffff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6
    
  }
  });

  const customMapStyle1 = [
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#202c3e"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "gamma": 0.01
            },
            {
                "lightness": 20
            },
            {
                "weight": "1.39"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "weight": "0.96"
            },
            {
                "saturation": "9"
            },
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 30
            },
            {
                "saturation": "9"
            },
            {
                "color": "black"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "saturation": 20
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 20
            },
            {
                "saturation": -20
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 10
            },
            {
                "saturation": -30
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#193a55"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "saturation": 25
            },
            {
                "lightness": 25
            },
            {
                "weight": "0.01"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "lightness": -20
            }
        ]
    }
]

const customMapStyle2 = [
  {
      "featureType": "all",
      "elementType": "all",
      "stylers": [
          {
              "invert_lightness": true
          },
          {
              "saturation": "-9"
          },
          {
              "lightness": "0"
          },
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "administrative.country",
      "elementType": "labels.text",
      "stylers": [
          {
              "color": "#18ff00"
          }
      ]
  },
  {
      "featureType": "administrative.province",
      "elementType": "labels.text",
      "stylers": [
          {
              "color": "#ff0000"
          }
      ]
  },
  {
      "featureType": "administrative.locality",
      "elementType": "labels.text",
      "stylers": [
          {
              "color": "#00b2ff"
          }
      ]
  },
  {
      "featureType": "administrative.neighborhood",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text",
      "stylers": [
          {
              "color": "#ff0000"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "all",
      "stylers": [
          {
              "weight": "1.00"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "landscape.natural.landcover",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "poi.attraction",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.business",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "poi.place_of_worship",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "poi.school",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
          {
              "weight": "0.49"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#fefffc"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#ffffff"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#0020ff"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "weight": "0.01"
          },
          {
              "lightness": "-7"
          },
          {
              "saturation": "-35"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels.text",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#62ffd0"
          },
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#ff2d2d"
          }
      ]
  },
  {
      "featureType": "road.highway.controlled_access",
      "elementType": "labels.text",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
          {
              "hue": "#ff0000"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#777777"
          },
          {
              "visibility": "simplified"
          },
          {
              "saturation": "8"
          },
          {
              "lightness": "-57"
          },
          {
              "gamma": "1.68"
          },
          {
              "weight": "1.17"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "labels.text",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  }
]




const customMapStyle3 =
[
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "saturation": 10
            },
            {
                "hue": "#ddddee"
            },
            {
                "lightness": 20
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 13
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#144b53"
            },
            {
                "lightness": 14
            },
            {
                "weight": 1.4
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#021525"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0c4152"
            },
            {
                "lightness": 5
            },
            {
                "visibility": 'on'
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#0b434f"
            },
            {
                "lightness": 25
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#0b3d51"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "color": "#146474"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    }
]

const customMapStyle4 = [
    {
        "featureType": "all",
        "stylers": [
            {
                "saturation": 0
            },
            {
                "hue": "#e7ecf0"
            }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            {
                "saturation": -70
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "saturation": -20
            }
        ]
    }
]

const customMapStyle5 = [
    {
        "featureType": "road",
        "stylers": [
            {
                "hue": "#5e00ff"
            },
            {
                "saturation": -79
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "saturation": 10
            },
            {
                "hue": "#6066ff"
            },
            {
                "lightness": 20
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "lightness": 22
            }
        ]
    },
    {
        "featureType": "landscape",
        // "elementType": "geometry",
        "stylers": [
            {
                "hue": "#9000cc"
            },
            {
                "saturation": -11
            },
            // {
            //     "color": "#ff00ff",
            //     // "lightness": 90
            // }
            
        ]
    },
    {},
    {},
    {
        "featureType": "water",
        "stylers": [
            {
                "saturation": -65
            },
            {
                "hue": "#1900ff"
            },
            {
                "lightness": 8
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "weight": 1.3
            },
            {
                "lightness": 30
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "hue": "#5e00ff"
            },
            {
                "saturation": -16
            }
        ]
    },
    {
        "featureType": "transit.line",
        "stylers": [
            {
                "saturation": -72
            }
        ]
    },
    {}
]
    


export default HomeScreen;
// export {Theme}

