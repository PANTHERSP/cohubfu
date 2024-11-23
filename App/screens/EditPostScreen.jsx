import React, { useState, useEffect, useRef, useCallback, useContext, useLayoutEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, Alert, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome, FontAwesome5, Entypo, FontAwesome6, Fontisto, AntDesign   } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../contexts/AuthContext';
import { PinMarkerContext } from '../contexts/PinMarkerContext';
import { NewPostContext } from '../contexts/NewPostContext';
import { EditPostContext } from '../contexts/EditPostContext';
import { auth, db, storage } from '../config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs, doc, setDoc, getDoc, orderBy } from 'firebase/firestore';
import LoadingScreen from './LoadingScreen';
import { ThemeContext } from '../contexts/ThemeContext';

const EditPostScreen = ({navigation, route}) => {

  // const [image, setImage] = useState(null); 

  const [imageList, setImageList] = useState([]);

  const [newPost, setNewPost] = useContext(NewPostContext);

  const [editPost, setEditPost] = useContext(EditPostContext);

  const [isDarkTheme, setIsDarkTheme] = useContext(ThemeContext);

  // const [imageListURL, setImageListURL] = useState([]);

  const [showSetOpenTimeInAndroid, setShowSetOpenTimeInAndroid] = useState(false);
  const [showSetCloseTimeInAndroid, setShowSetCloseTimeInAndroid] = useState(false);

  const [nameOfCoWorkingSpace, setNameOfCoWorkingSpace] = useState('');
  const [addressOfCoWorkingSpace, setAddressOfCoWorkingSpace] = useState('');
  const [emailOfCoWorkingSpace, setEmailOfCoWorkingSpace] = useState('');
  const [phoneNumberOfCoWorkingSpace, setPhoneNumberOfCoWorkingSpace] = useState('');
  const [instagramLinkOfCoWorkingSpace, setInstagramLinkOfCoWorkingSpace] = useState('');
  const [facebookLinkOfCoWorkingSpace, setFacebookLinkOfCoWorkingSpace] = useState('');
  const [xTwitterLinkOfCoWorkingSpace, setXTwitterLinkOfCoWorkingSpace] = useState('');
  const [lineLinkOfCoWorkingSpace, setLineLinkOfCoWorkingSpace] = useState('');
  // const [markerCoordinate, setMarkerCoordinate] = useState(null);

  const [mockAuth, setMockAuth ] = useContext(AuthContext);
  const [ markerCoordinate, setMarkerCoordinate ] = useContext(PinMarkerContext);

  const [isLoading, setIsLoading] = useState(false);

  const [ isPressAddPhotos, setIsPressAddPhotos ] = useState(false);

  const [ isPressAddContact, setIsPressAddContact ] = useState(false);

    useLayoutEffect(() => {
        setNameOfCoWorkingSpace(route.params.nameOfCoWorkingSpace)
        setAddressOfCoWorkingSpace(route.params.addressOfCoWorkingSpace)
        setDescription(route.params.description)
        setAmenities(route.params.amenities)
        setAvailableSpaces(route.params.availableSpaces)
        setEmailOfCoWorkingSpace(route.params.emailOfCoWorkingSpace)
        setPhoneNumberOfCoWorkingSpace(route.params.phoneNumberOfCoWorkingSpace)
        setInstagramLinkOfCoWorkingSpace(route.params.instagramLinkOfCoWorkingSpace)
        setFacebookLinkOfCoWorkingSpace(route.params.facebookLinkOfCoWorkingSpace)
        setXTwitterLinkOfCoWorkingSpace(route.params.xTwitterLinkOfCoWorkingSpace)
        setLineLinkOfCoWorkingSpace(route.params.lineLinkOfCoWorkingSpace)
        setMarkerCoordinate(route.params.markerCoordinate)
        setImageList(route.params.imageList)

        setMondayOpenTime(route.params.openTime.mondayOpenTime)
        setMondayCloseTime(route.params.openTime.mondayCloseTime)
        setTuesdayOpenTime(route.params.openTime.tuesdayOpenTime)
        setTuesdayCloseTime(route.params.openTime.tuesdayCloseTime)
        setWednesdayOpenTime(route.params.openTime.wednesdayOpenTime)
        setWednesdayCloseTime(route.params.openTime.wednesdayCloseTime)
        setThursdayOpenTime(route.params.openTime.thursdayOpenTime)
        setThursdayCloseTime(route.params.openTime.thursdayCloseTime)
        setFridayOpenTime(route.params.openTime.fridayOpenTime)
        setFridayCloseTime(route.params.openTime.fridayCloseTime)
        setSaturdayOpenTime(route.params.openTime.saturdayOpenTime)
        setSaturdayCloseTime(route.params.openTime.saturdayCloseTime)
        setSundayOpenTime(route.params.openTime.sundayOpenTime)
        setSundayCloseTime(route.params.openTime.sundayCloseTime)

            console.log(route.params, 'route.params')

    }, [])



  
  const pickImageCamera = async () => {

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: false,
    })

    if (!result.canceled) {
      setImageList([...imageList, result.assets[0].uri]);
      console.log([...imageList, result.assets[0].uri],'imageList')
    }
    
    // console.log(result);
  }

  // console.log(mockAuth.currentUser)

  const pickImage = async () => {

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      allowsMultipleSelection: false,
      
    });
    
    if (!result.canceled) {
      setImageList([...imageList, result.assets[0].uri]);
      console.log([...imageList, result.assets[0].uri],'imageList')
    }

    
    

  }

//   useEffect(() => {
//     setMarkerCoordinate(route.params?.markerCoordinate);
// }, [route.params?.markerCoordinate]);

  const handlePost = async () => {
    
    if (!markerCoordinate || !nameOfCoWorkingSpace || !addressOfCoWorkingSpace ) {
      Alert.alert('Please fill in all required fields');
      return;
    }



    try {
      setIsLoading(true);


      const imageListURL = []

      for (const image of imageList) {
        const response = await fetch(image);
        const blob = await response.blob();
  
        
        const storageRef = ref(storage, `postImages/${mockAuth.currentUser.uid}/${Date.now()}`);
        
        const snapshot = await uploadBytes(storageRef, blob);
        
        const downloadURL = await getDownloadURL(snapshot.ref);

        imageListURL.push(downloadURL)

      }



    
    // try {
    //     setIsLoading(true);
      
    //   // setIsLoading(true);


    //   const imageListURL = await Promise.all(imageList.map( async (image) => {

    //     // let imageListURL = [];

    //     const response = await fetch(image);
    //     const blob = await response.blob();
  
        
    //     const storageRef = ref(storage, `postImages/${mockAuth.currentUser.uid}/${Date.now()}`);
        
    //     const snapshot = await uploadBytes(storageRef, blob);
        
    //     const downloadURL = await getDownloadURL(snapshot.ref);
        
    //   // imageListURL = [...imageListURL, downloadURL];

    //   return downloadURL

    // }))

    
    
      const docRefU = doc(db, "users", mockAuth.currentUser.uid);
      const querySnapshotU = await getDoc(docRefU); 
      const dataSnapshotU = querySnapshotU.data();

      console.log('Helloooooooooooooooooooooooooooooooooooooooooo')

      const docRefP = doc(db, "posts", route.params.postId);
        await setDoc(docRefP, {
          imageList: imageListURL,
          markerCoordinate: markerCoordinate,
          nameOfCoWorkingSpace: nameOfCoWorkingSpace,
          addressOfCoWorkingSpace: addressOfCoWorkingSpace,
          description: description,
          amenities: amenities,
          availableSpaces: availableSpaces,
          emailOfCoWorkingSpace: emailOfCoWorkingSpace,
          phoneNumberOfCoWorkingSpace: phoneNumberOfCoWorkingSpace,
          facebookLinkOfCoWorkingSpace: facebookLinkOfCoWorkingSpace,
          instagramLinkOfCoWorkingSpace: instagramLinkOfCoWorkingSpace,
          xTwitterLinkOfCoWorkingSpace: xTwitterLinkOfCoWorkingSpace,
          lineLinkOfCoWorkingSpace: lineLinkOfCoWorkingSpace,
          username: dataSnapshotU.username,
          email: dataSnapshotU.email,
          phoneNumber: dataSnapshotU.phoneNumber,
          address: dataSnapshotU.address,
          userId: dataSnapshotU.uid,
          timestamp: Date.now(),
          openTime: {
              mondayOpenTime: mondayOpenTime,
            tuesdayOpenTime: tuesdayOpenTime,
            wednesdayOpenTime: wednesdayOpenTime,
            thursdayOpenTime: thursdayOpenTime,
            fridayOpenTime: fridayOpenTime,
            saturdayOpenTime: saturdayOpenTime,
            sundayOpenTime: sundayOpenTime,
            mondayCloseTime: mondayCloseTime,
            tuesdayCloseTime: tuesdayCloseTime,
            wednesdayCloseTime: wednesdayCloseTime,
            thursdayCloseTime: thursdayCloseTime,
            fridayCloseTime: fridayCloseTime,
            saturdayCloseTime: saturdayCloseTime,
            sundayCloseTime: sundayCloseTime,
          },
      })

      const filteredMyPosts = dataSnapshotU.myPosts.filter((post) => post.postId !== route.params.postId);

      console.log(markerCoordinate)

      await setDoc(docRefU, {
                    uid: dataSnapshotU.uid,
                    username: dataSnapshotU.username,
                    email: dataSnapshotU.email,
                    phoneNumber: dataSnapshotU.phoneNumber,
                    address: dataSnapshotU.address,
                    favorites: dataSnapshotU.favorites,
                    myPosts: [
                      {
                        imageList: imageListURL,
                        markerCoordinate: markerCoordinate,
                        nameOfCoWorkingSpace: nameOfCoWorkingSpace,
                        addressOfCoWorkingSpace: addressOfCoWorkingSpace,
                        description: description,
                        amenities: amenities,
                        availableSpaces: availableSpaces,
                        emailOfCoWorkingSpace: emailOfCoWorkingSpace,
                        phoneNumberOfCoWorkingSpace: phoneNumberOfCoWorkingSpace,
                        facebookLinkOfCoWorkingSpace: facebookLinkOfCoWorkingSpace,
                        instagramLinkOfCoWorkingSpace: instagramLinkOfCoWorkingSpace,
                        xTwitterLinkOfCoWorkingSpace: xTwitterLinkOfCoWorkingSpace,
                        lineLinkOfCoWorkingSpace: lineLinkOfCoWorkingSpace,
                        username: dataSnapshotU.username,
                        email: dataSnapshotU.email,
                        phoneNumber: dataSnapshotU.phoneNumber,
                        address: dataSnapshotU.address,
                        userId: dataSnapshotU.uid,
                        postId: route.params.postId,
                        timestamp: Date.now(),
                        openTime: {
                          mondayOpenTime: mondayOpenTime,
                          tuesdayOpenTime: tuesdayOpenTime,
                          wednesdayOpenTime: wednesdayOpenTime,
                          thursdayOpenTime: thursdayOpenTime,
                          fridayOpenTime: fridayOpenTime,
                          saturdayOpenTime: saturdayOpenTime,
                          sundayOpenTime: sundayOpenTime,
                          mondayCloseTime: mondayCloseTime,
                          tuesdayCloseTime: tuesdayCloseTime,
                          wednesdayCloseTime: wednesdayCloseTime,
                          thursdayCloseTime: thursdayCloseTime,
                          fridayCloseTime: fridayCloseTime,
                          saturdayCloseTime: saturdayCloseTime,
                          sundayCloseTime: sundayCloseTime,
                        },
                      }, ...filteredMyPosts
                    ]
                      
                    
                  })
                
                  
                  
            const querySnapshotP = await getDoc(docRefP)
            const dataSnapshotP = querySnapshotP.data()

            setEditPost(dataSnapshotP)

                 
                  navigation.goBack();
                 
                  setIsLoading(false);

                  // setImage(null);
                  // setMarkerCoordinate(null);
                  
                    
                
    
              } catch (error) {
      console.error(error);
    }


    
  }

  const [openTime, setOpenTime] = useState(new Date());
  const [closeTime, setCloseTime] = useState(new Date());
  
  const [isSelectedOpen24Hours, setIsSelectedOpen24Hours] = useState(false);
  const [isSelectedClosed, setIsSelectedClosed] = useState(false);

  const [isSelectedMonday, setIsSelectedMonday] = useState(false);
  const [isSelectedTuesday, setIsSelectedTuesday] = useState(false);
  const [isSelectedWednesday, setIsSelectedWednesday] = useState(false);
  const [isSelectedThursday, setIsSelectedThursday] = useState(false);
  const [isSelectedFriday, setIsSelectedFriday] = useState(false);
  const [isSelectedSaturday, setIsSelectedSaturday] = useState(false);
  const [isSelectedSunday, setIsSelectedSunday] = useState(false);

  const [isSlectEveryday, setIsSlectEveryday] = useState(false);

  const [formattedOpenTime, setFormattedOpenTime] = useState('');
  const [formattedCloseTime, setFormattedCloseTime] = useState('');

  const [mondayOpenTime, setMondayOpenTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
  const [tuesdayOpenTime, setTuesdayOpenTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
  const [wednesdayOpenTime, setWednesdayOpenTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
  const [thursdayOpenTime, setThursdayOpenTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
  const [fridayOpenTime, setFridayOpenTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
  const [saturdayOpenTime, setSaturdayOpenTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
  const [sundayOpenTime, setSundayOpenTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});

  const [mondayCloseTime, setMondayCloseTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
  const [tuesdayCloseTime, setTuesdayCloseTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
  const [wednesdayCloseTime, setWednesdayCloseTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
  const [thursdayCloseTime, setThursdayCloseTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
  const [fridayCloseTime, setFridayCloseTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
  const [saturdayCloseTime, setSaturdayCloseTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
  const [sundayCloseTime, setSundayCloseTime] = useState({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});

  const [amenities, setAmenities] = useState([]);

  const [availableSpaces, setAvailableSpaces] = useState([]);

  const [description, setDescription] = useState('');

  


  const handleSetFormattedOpenTime = () => {
    // setOpenTime(time);
    let hours = openTime.getHours();
    let minutes = openTime.getMinutes();
    // let FormattedHours = ( hours + 7 ) >= 24 ?  ( hours + 7 ) - 24  :  hours + 7 
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const timeFromMidnight = (hours * 60) + minutes; 
    // setFormattedOpenTime(formattedTime);
    console.log(formattedTime);
    console.log(timeFromMidnight);

    return {time: formattedTime, timeFromMidnight: timeFromMidnight}
    
    

  }

  const handleSetFormattedCloseTime = () => {
    // setCloseTime(time);
    let hours = closeTime.getHours();
    let minutes = closeTime.getMinutes();
    // let FormattedHours = ( hours + 7 ) >= 24 ?  ( hours + 7 ) - 24  :  hours + 7 
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const timeFromMidnight = (hours * 60) + minutes; 
    // setFormattedCloseTime(formattedTime);
    console.log(formattedTime);
    console.log(timeFromMidnight);

    return {time: formattedTime, timeFromMidnight: timeFromMidnight}
  }


  const handleSave = () => {

    // console.log(openTime, 'open time')
    // console.log(closeTime, 'close time')

    if ((openTime.getTime() == closeTime.getTime()) && (!isSelectedOpen24Hours && !isSelectedClosed)) {
      console.log(openTime.getTime(), 'open time')
    console.log(closeTime.getTime(), 'close time')
      Alert.alert('Open time cannot be the same as close time');
      return;
    }

      if (isSelectedMonday) {
        if(isSelectedOpen24Hours) {
          setMondayOpenTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          setMondayCloseTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          
        }
        else if(isSelectedClosed) {
          setMondayOpenTime({time: 'Closed', timeFromMidnight: 'Closed'});
          setMondayCloseTime({time: 'Closed', timeFromMidnight: 'Closed'});
          
        }
        else {
        setMondayOpenTime(handleSetFormattedOpenTime());
        setMondayCloseTime(handleSetFormattedCloseTime());
        }
      }

      if (isSelectedTuesday) {

        if(isSelectedOpen24Hours) {
          setTuesdayOpenTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          setTuesdayCloseTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          
        }
        else if(isSelectedClosed) {
          setTuesdayOpenTime({time: 'Closed', timeFromMidnight: 'Closed'});
          setTuesdayCloseTime({time: 'Closed', timeFromMidnight: 'Closed'});
          
        }
        else {
        setTuesdayOpenTime(handleSetFormattedOpenTime());
        setTuesdayCloseTime(handleSetFormattedCloseTime());
        }
        
      }

      if (isSelectedWednesday) {
        if(isSelectedOpen24Hours) {
          setWednesdayOpenTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          setWednesdayCloseTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          
        }
        else if(isSelectedClosed) {
          setWednesdayOpenTime({time: 'Closed', timeFromMidnight: 'Closed'});
          setWednesdayCloseTime({time: 'Closed', timeFromMidnight: 'Closed'});
          
        }
        else {
        setWednesdayOpenTime(handleSetFormattedOpenTime());
        setWednesdayCloseTime(handleSetFormattedCloseTime());
        }
        
      }

      if (isSelectedThursday) {
        if(isSelectedOpen24Hours) {
          setThursdayOpenTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          setThursdayCloseTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          
        }
        else if(isSelectedClosed) {
          setThursdayOpenTime({time: 'Closed', timeFromMidnight: 'Closed'});
          setThursdayCloseTime({time: 'Closed', timeFromMidnight: 'Closed'});
          
        }
        else {
        setThursdayOpenTime(handleSetFormattedOpenTime());
        setThursdayCloseTime(handleSetFormattedCloseTime());
        }
        
      }

      if (isSelectedFriday) {
        if(isSelectedOpen24Hours) {
          setFridayOpenTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          setFridayCloseTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          
        }
        else if(isSelectedClosed) {
          setFridayOpenTime({time: 'Closed', timeFromMidnight: 'Closed'});
          setFridayCloseTime({time: 'Closed', timeFromMidnight: 'Closed'});
          
        }
        else {
        setFridayOpenTime(handleSetFormattedOpenTime());
        setFridayCloseTime(handleSetFormattedCloseTime());
        }
        
      }

      if (isSelectedSaturday) {
        if(isSelectedOpen24Hours) {
          setSaturdayOpenTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          setSaturdayCloseTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          
        }
        else if(isSelectedClosed) {
          setSaturdayOpenTime({time: 'Closed', timeFromMidnight: 'Closed'});
          setSaturdayCloseTime({time: 'Closed', timeFromMidnight: 'Closed'});
          
        }
        else {
        setSaturdayOpenTime(handleSetFormattedOpenTime());
        setSaturdayCloseTime(handleSetFormattedCloseTime());
        }
        
      }

      if (isSelectedSunday) {
        if(isSelectedOpen24Hours) {
          setSundayOpenTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          setSundayCloseTime({time: 'Open 24 hours', timeFromMidnight: 'Open 24 hours'});
          
        }
        else if(isSelectedClosed) {
          setSundayOpenTime({time: 'Closed', timeFromMidnight: 'Closed'});
          setSundayCloseTime({time: 'Closed', timeFromMidnight: 'Closed'});
          
        }
        else {
        setSundayOpenTime(handleSetFormattedOpenTime());
        setSundayCloseTime(handleSetFormattedCloseTime());
        }
        
      }

      // if (isSelectedMonday && isSelectedTuesday && isSelectedWednesday && isSelectedThursday && isSelectedFriday && isSelectedSaturday && isSelectedSunday) {
      //   setIsSlectEveryday(true);
      // } else {
      //   setIsSlectEveryday(false);
      // }

      console.log('open time')

      console.log(mondayOpenTime, 'mon')
      console.log(tuesdayOpenTime, 'tue')
      console.log(wednesdayOpenTime, 'wed')
      console.log(thursdayOpenTime, 'thu')
      console.log(fridayOpenTime, 'fri')
      console.log(saturdayOpenTime, 'sat')
      console.log(sundayOpenTime, 'sun')

      console.log('close time')

      console.log(mondayCloseTime, 'mon')
      console.log(tuesdayCloseTime, 'tue')
      console.log(wednesdayCloseTime, 'wed')
      console.log(thursdayCloseTime, 'thu')
      console.log(fridayCloseTime, 'fri')
      console.log(saturdayCloseTime, 'sat')
      console.log(sundayCloseTime, 'sun')
  }



  const handleSetAmenities = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((item) => item !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }

    console.log(amenities)
  }


  const handleSetAvailableSpaces = (space) => {
    if (availableSpaces.includes(space)) {
      setAvailableSpaces(availableSpaces.filter((item) => item !== space));
    } else {
      setAvailableSpaces([...availableSpaces, space]);
    }
  }



  return (

<>{isLoading ? <LoadingScreen /> :
    <View style={{flex:1,backgroundColor: isDarkTheme ? '#150228' : '#ddddff'}}>

<TouchableOpacity onPress={() => {navigation.goBack()}} style={{backgroundColor: 'white',
    aspectRatio: 1,
    height: h(5.5),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
    position:'absolute',
    zIndex: 1,
    marginTop: h(5),
    marginLeft: w(5),
    }}>
            <Ionicons name="arrow-back" size={h(3.5)} color="black" />
          </TouchableOpacity>
    
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView bounces={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{alignItems: 'center',width: '100%',height: '100%',}}>



            

            <Text style={{fontSize: h(4),color: isDarkTheme ? 'white' : 'black',fontWeight: 'bold',fontFamily: 'Rockwell', paddingTop: h(8),shadowOffset: { width: 0, height:  0},shadowOpacity: 0,}}>Edit your post</Text>
       
      <View style={{width: '90%',}}>

        <View style={{width: '100%',paddingTop: h(4)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <FontAwesome6 name="pencil" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> Name  (required)*</Text>
                    </View>
                    <TextInput keyboardType='default' placeholder='Enter name of co-working space' placeholderTextColor='gray' onChangeText={(text) => setNameOfCoWorkingSpace(text)} value={nameOfCoWorkingSpace} style={{paddingHorizontal: '5%',fontFamily: 'PatrickHand-Regular',fontSize: h(2), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.1),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                    { false && <Text style={{ fontWeight: 'bold', alignSelf: 'center',paddingTop: h(1),fontFamily: 'PatrickHand-Regular',fontSize: h(1.7),color: '#df0000'}}>Please enter a valid email address</Text>}
                </View>
        
        <View style={{width: '100%',paddingTop: h(3)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <FontAwesome5 name="address-card" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> Address  (required)*</Text>
                    </View>
                    <TextInput keyboardType='default' placeholder='Enter address of co-working space' placeholderTextColor='gray' onChangeText={(text) => setAddressOfCoWorkingSpace(text)} value={addressOfCoWorkingSpace} style={{paddingHorizontal: '5%',fontFamily: 'PatrickHand-Regular',fontSize: h(2), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.1),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                    { false && <Text style={{ fontWeight: 'bold', alignSelf: 'center',paddingTop: h(1),fontFamily: 'PatrickHand-Regular',fontSize: h(1.7),color: '#df0000'}}>Please enter a valid email address</Text>}
                {/* <View style={{aspectRatio: 1.4,width: w(80),marginTop: h(2)}}> */}
                  {/* </View> */}
                </View>
                
        <View style={{width: '100%',paddingTop: h(3)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <MaterialIcons name="description" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> Description</Text>
                    </View>
                    <TextInput multiline={true} keyboardType='default' placeholder='Enter description' placeholderTextColor='gray' onChangeText={(text) => setDescription(text)} value={description} style={{paddingHorizontal: '5%',paddingTop: '4%',fontFamily: 'PatrickHand-Regular',fontSize: h(2), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.1),borderRadius: h(2),width: '100%',height: h(12),marginTop: h(0.2)}} />
                    { false && <Text style={{ fontWeight: 'bold', alignSelf: 'center',paddingTop: h(1),fontFamily: 'PatrickHand-Regular',fontSize: h(1.7),color: '#df0000'}}>Please enter a valid email address</Text>}
                {/* <View style={{aspectRatio: 1.4,width: w(80),marginTop: h(2)}}> */}
                  {/* </View> */}
                </View>

                


                <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',marginTop: h(5)}}>
                    <FontAwesome5 name="clock" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> Select days to edit the time</Text>
                    </View>

<View style={{width: '100%',marginTop: h(1),padding: h(1.5),backgroundColor: 'rgba(255, 255, 255, 1)',borderRadius: h(2),}}>

                { (mondayOpenTime.timeFromMidnight === tuesdayOpenTime.timeFromMidnight && mondayOpenTime.timeFromMidnight === wednesdayOpenTime.timeFromMidnight && mondayOpenTime.timeFromMidnight === thursdayOpenTime.timeFromMidnight && mondayOpenTime.timeFromMidnight === fridayOpenTime.timeFromMidnight && mondayOpenTime.timeFromMidnight === saturdayOpenTime.timeFromMidnight && mondayOpenTime.timeFromMidnight === sundayOpenTime.timeFromMidnight) && (mondayCloseTime.timeFromMidnight === tuesdayCloseTime.timeFromMidnight && mondayCloseTime.timeFromMidnight === wednesdayCloseTime.timeFromMidnight && mondayCloseTime.timeFromMidnight === thursdayCloseTime.timeFromMidnight && mondayCloseTime.timeFromMidnight === fridayCloseTime.timeFromMidnight && mondayCloseTime.timeFromMidnight === saturdayCloseTime.timeFromMidnight && mondayCloseTime.timeFromMidnight === sundayCloseTime.timeFromMidnight) ? 
 <View style={{display: 'flex',flexDirection: 'column',marginTop: h(0),backgroundColor: '#eeeeee',padding: h(2),borderRadius: h(2),gap: h(2)}}>
 <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
 <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Everyday</Text>
 { mondayOpenTime.time === 'Open 24 hours' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Open 24 hours</Text> :
     mondayOpenTime.time === 'Closed' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Closed</Text> :
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>{mondayOpenTime.time} - {mondayCloseTime.time}</Text>
    }
    </View>
    </View> :
 
 <View style={{display: 'flex',flexDirection: 'column',marginTop: h(0),backgroundColor: '#eeeeee',padding: h(2),borderRadius: h(2),gap: h(2)}}>
  <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Monday</Text>
   { mondayOpenTime.time === 'Open 24 hours' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Open 24 hours</Text> :
     mondayOpenTime.time === 'Closed' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Closed</Text> :
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>{mondayOpenTime.time} - {mondayCloseTime.time}</Text>
    }

  </View>
  <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Tuesday</Text>
    { tuesdayOpenTime.time === 'Open 24 hours' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Open 24 hours</Text> :
     tuesdayOpenTime.time === 'Closed' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Closed</Text> :
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>{tuesdayOpenTime.time} - {tuesdayCloseTime.time}</Text>}
    
  </View>

  <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Wednesday</Text>
    { wednesdayOpenTime.time === 'Open 24 hours' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Open 24 hours</Text> :
     wednesdayOpenTime.time === 'Closed' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Closed</Text> :
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>{wednesdayOpenTime.time} - {wednesdayCloseTime.time}</Text>
    }
    
  </View>

  <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Thursday</Text>
    { thursdayOpenTime.time === 'Open 24 hours' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Open 24 hours</Text> :
     thursdayOpenTime.time === 'Closed' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Closed</Text> :
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>{thursdayOpenTime.time} - {thursdayCloseTime.time}</Text>}
    </View>

  <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Friday</Text>
    { fridayOpenTime.time === 'Open 24 hours' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Open 24 hours</Text> :
     fridayOpenTime.time === 'Closed' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Closed</Text> :
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>{fridayOpenTime.time} - {fridayCloseTime.time}</Text>}
    </View>

  <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Saturday</Text>
    { saturdayOpenTime.time === 'Open 24 hours' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Open 24 hours</Text> :
     saturdayOpenTime.time === 'Closed' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Closed</Text> :
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>{saturdayOpenTime.time} - {saturdayCloseTime.time}</Text>}
    </View>

  <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Sunday</Text>
    { sundayOpenTime.time === 'Open 24 hours' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Open 24 hours</Text> :
     sundayOpenTime.time === 'Closed' ? <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>Closed</Text> :
    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',fontWeight : 'bold'}}>{sundayOpenTime.time} - {sundayCloseTime.time}</Text>}
    </View>
  </View>
}   




                <View style={{width: '100%',paddingTop: h(3),}}>
                  <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
                  <TouchableOpacity onPress={() => setIsSelectedMonday(!isSelectedMonday)} style={{backgroundColor: isSelectedMonday ? 'yellow' : '#dddddd',
    aspectRatio: 1,
    height: h(4.3),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.4.3
    }}>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.8),color: isSelectedMonday ? '#aaaaaa' : 'black'}}>M</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => setIsSelectedTuesday(!isSelectedTuesday)} style={{backgroundColor: isSelectedTuesday ? 'pink' : '#dddddd',
    aspectRatio: 1,
    height: h(4.3),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.4.3
    }}>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.8),color: isSelectedTuesday ? 'white' : 'black'}}>T</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => setIsSelectedWednesday(!isSelectedWednesday)} style={{backgroundColor: isSelectedWednesday ? 'green' : '#dddddd',
    aspectRatio: 1,
    height: h(4.3),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.4.3
    }}>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.8),color: isSelectedWednesday ? 'white' : 'black'}}>W</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => setIsSelectedThursday(!isSelectedThursday)} style={{backgroundColor: isSelectedThursday ? 'orange' : '#dddddd',
    aspectRatio: 1,
    height: h(4.3),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.4.3
    }}>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.8),color: isSelectedThursday ? 'white' : 'black'}}>T</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => setIsSelectedFriday(!isSelectedFriday)} style={{backgroundColor: isSelectedFriday ? 'blue' : '#dddddd',
    aspectRatio: 1,
    height: h(4.3),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.4.3
    }}>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.8),color: isSelectedFriday ? 'white' : 'black'}}>F</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => setIsSelectedSaturday(!isSelectedSaturday)} style={{backgroundColor: isSelectedSaturday ? 'purple' : '#dddddd',
    aspectRatio: 1,
    height: h(4.3),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.4.3
    }}>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.8),color: isSelectedSaturday ? 'white' : 'black'}}>S</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => setIsSelectedSunday(!isSelectedSunday)} style={{backgroundColor: isSelectedSunday ? 'red' : '#dddddd',
    aspectRatio: 1,
    height: h(4.3),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.4.3
    }}>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.8),color: isSelectedSunday ? 'white' : 'black'}}>S</Text>
            </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => {

                      
                      
                      setIsSelectedMonday(true)
                      setIsSelectedTuesday(true)
                      setIsSelectedWednesday(true)
                      setIsSelectedThursday(true)
                      setIsSelectedFriday(true)
                      setIsSelectedSaturday(true)
                      setIsSelectedSunday(true)
                    
                  }} style={{backgroundColor:'#dddddd',
  // width: w(),
  height: h(5),
  borderRadius: h(100),
  justifyContent: 'center',
  alignItems: 'center',
  // opacity: 0.6,
  flexDirection: 'row',
  alignSelf: 'center',
  paddingHorizontal: h(1.5),
  marginTop: h(1)
  }}>
    
              
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: 'black',}}> Select all days</Text>
            </TouchableOpacity>

          

{ ( isSelectedMonday || isSelectedTuesday || isSelectedWednesday || isSelectedThursday || isSelectedFriday || isSelectedSaturday || isSelectedSunday ) && <View style={{flexDirection: 'row', justifyContent: 'space-evenly',marginTop: h(3)}}>
                    <TouchableOpacity onPress={() => {
                      
                        setIsSelectedOpen24Hours(!isSelectedOpen24Hours)
                        setIsSelectedClosed(false)
                      
                    }} style={{backgroundColor: isSelectedOpen24Hours ? '#8888ff' : '#dddddd',
    // width: w(),
    height: h(5),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.6,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingHorizontal: h(1.5),
    // marginTop: h(8)
    }}>
      <MaterialCommunityIcons name='hours-24' size={h(3.5)} color="black" style={{color: isSelectedOpen24Hours ? 'white' : 'black',}} />
                
                <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: isSelectedOpen24Hours ? 'white' : 'black',}}> Open 24 hours</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {

                setIsSelectedClosed(!isSelectedClosed)
                setIsSelectedOpen24Hours(false)
              }} style={{backgroundColor: isSelectedClosed ? '#8888ff' : '#dddddd',
    // width: w(),
    height: h(5),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.6,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingHorizontal: h(1.5),
    // marginTop: h(8)
    }}>
      <FontAwesome6 name='window-close' size={h(3)} color="black" style={{color: isSelectedClosed ? 'white' : 'black',}} />
                
                <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.2),color: isSelectedClosed ? 'white' : 'black',}}> Closed</Text>
              </TouchableOpacity>
              </View>
}

 { ( isSelectedMonday || isSelectedTuesday || isSelectedWednesday || isSelectedThursday || isSelectedFriday || isSelectedSaturday || isSelectedSunday ) && (!isSelectedOpen24Hours && !isSelectedClosed ) && <View style={{width: '100%',paddingTop: h(3),display: 'flex',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
                  
 <View style={{alignItems: 'center',display: 'flex',flexDirection: 'row'}}>
                  <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(1.95),color: 'black'}}>Open time</Text>
                  { Platform.OS === 'android' ? 
                  <>
                  <TouchableOpacity style={{width: h(8),height: h(3),backgroundColor: '#bbbbbb',borderRadius: h(100)}} onPress={() => setShowSetOpenTimeInAndroid(true)}>
                    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(1.95),color: 'white',textAlign: 'center'}}>{openTime.getHours() < 10 ? '0' + openTime.getHours() : openTime.getHours() }:{openTime.getMinutes() < 10 ? '0' + openTime.getMinutes() : openTime.getMinutes()}</Text>
                  </TouchableOpacity>
                  <DateTimePickerModal isVisible={showSetOpenTimeInAndroid} mode='time' onConfirm={(time) => {setOpenTime(time); setShowSetOpenTimeInAndroid(false)}} onCancel={() => setShowSetOpenTimeInAndroid(false)} />
                  </>
                  
                  :
                  
                  <DateTimePicker mode='time' value={openTime} onChange={(event, time) => setOpenTime(time)} style={{}} />
                  }
                  </View>

                  

                  
                  
                  
                  <View style={{alignItems: 'center',display: 'flex',flexDirection: 'row',}}>
                    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(1.95),color: 'black'}}>Close time</Text>
                    { Platform.OS === 'android' ? 
                  <>
                  <TouchableOpacity style={{width: h(8),height: h(3),backgroundColor: '#bbbbbb',borderRadius: h(100)}} onPress={() => setShowSetCloseTimeInAndroid(true)}>
                    <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(1.95),color: 'white',textAlign: 'center'}}>{closeTime.getHours() < 10 ? '0' + closeTime.getHours() : closeTime.getHours() }:{closeTime.getMinutes() < 10 ? '0' + closeTime.getMinutes() : closeTime.getMinutes()}</Text>
                  </TouchableOpacity>
                  <DateTimePickerModal isVisible={showSetCloseTimeInAndroid} mode='time' onConfirm={(time) => {setCloseTime(time); setShowSetCloseTimeInAndroid(false)}} onCancel={() => setShowSetCloseTimeInAndroid(false)} />
                  </>
                  
                  :
                  
                  <DateTimePicker mode='time' value={closeTime} onChange={(event, time) => setCloseTime(time)} style={{}} />
                  }
                  
                  
                  </View>
                  
                  </View>
}
             </View>

          { (isSelectedMonday || isSelectedTuesday || isSelectedWednesday || isSelectedThursday || isSelectedFriday || isSelectedSaturday || isSelectedSunday) && <TouchableOpacity onPress={handleSave} style={{backgroundColor: 'lightblue',
width: '35%',
height: h(5),
borderRadius: h(100),
justifyContent: 'center',
alignItems: 'center',
// opacity: 0.6,
// flexDirection: 'row',
alignSelf: 'center',
paddingHorizontal: h(1.5),
marginTop: h(2.5)
}}>
{/* <FontAwesome6 name='window-close' size={h(3.5)} color="black" style={{color: isSelectedClosed ? 'white' : 'black',}} /> */}

<Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(3),color: 'black',}}>Save</Text>
</TouchableOpacity>
}

</View>





<View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',marginTop: h(7)}}>
                    <FontAwesome5 name="tag" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> Select available amenities</Text>
                    </View>


                    <View style={{flexDirection: 'row',gap: h(1),paddingTop: h(1),flexWrap: 'wrap',alignItems: 'center',}}>
                  <TouchableOpacity onPress={() => handleSetAmenities('Free wifi')} style={{backgroundColor: amenities.includes('Free wifi') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      <View style={{width: w(7), alignItems: 'center'}}>
      <FontAwesome6 name='wifi' size={h(2)} color="black" style={{color: amenities.includes('Free wifi') ? 'white' : 'black',}} />
      </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('Free wifi') ? 'white' : 'black'}}>Free wifi</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetAmenities('Kitchen')} style={{backgroundColor: amenities.includes('Kitchen') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      <View style={{width: w(7), alignItems: 'center'}}>
              <FontAwesome6 name='utensils' size={h(2)} color="black" style={{color: amenities.includes('Kitchen') ? 'white' : 'black',}} />
        </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('Kitchen') ? 'white' : 'black'}}>Kitchen</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetAmenities('Printing')} style={{backgroundColor: amenities.includes('Printing') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      <View style={{width: w(7), alignItems: 'center'}}>
            <Entypo name='print' size={h(2)} color="black" style={{color: amenities.includes('Printing') ? 'white' : 'black',}} />
            </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('Printing') ? 'white' : 'black'}}>Printing</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleSetAmenities('Laundry')} style={{backgroundColor: amenities.includes('Laundry') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          <View style={{width: w(7), alignItems: 'center'}}>
            <MaterialIcons name='local-laundry-service' size={h(2)} color="black" style={{color: amenities.includes('Laundry') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('Laundry') ? 'white' : 'black'}}>Laundry</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetAmenities('Lockers')} style={{backgroundColor: amenities.includes('Lockers') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          <View style={{width: w(7), alignItems: 'center'}}>
            <MaterialCommunityIcons name='locker-multiple' size={h(2)} color="black" style={{color: amenities.includes('Lockers') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('Lockers') ? 'white' : 'black'}}>Lockers</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetAmenities('CCTV')} style={{backgroundColor: amenities.includes('CCTV') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
  }}>
          <View style={{width: w(7), alignItems: 'center'}}>
            <MaterialCommunityIcons name='cctv' size={h(2)} color="black" style={{color: amenities.includes('CCTV') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('CCTV') ? 'white' : 'black'}}>CCTV</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleSetAmenities('Coffee bar')} style={{backgroundColor: amenities.includes('Coffee bar') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      <View style={{width: w(7), alignItems: 'center'}}>
          <Fontisto name='coffeescript' size={h(2)} color="black" style={{color: amenities.includes('Coffee bar') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('Coffee bar') ? 'white' : 'black'}}>Coffee bar</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetAmenities('Car parking')} style={{backgroundColor: amenities.includes('Car parking') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      <View style={{width: w(7), alignItems: 'center'}}>
          <FontAwesome6 name='car-side' size={h(2)} color="black" style={{color: amenities.includes('Car parking') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('Car parking') ? 'white' : 'black'}}>Car parking</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetAmenities('Customer service')} style={{backgroundColor: amenities.includes('Customer service') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          <View style={{width: w(7), alignItems: 'center'}}>
            <AntDesign name='customerservice' size={h(2)} color="black" style={{color: amenities.includes('Customer service') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('Customer service') ? 'white' : 'black'}}>Customer service</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleSetAmenities('Computers')} style={{backgroundColor: amenities.includes('Computers') ? '#8888ff' : 'white',
        // aspectRatio: 1,
        height: h(4),
        paddingHorizontal: h(1.2),
        borderRadius: h(100),
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // opacity: 0.5.5
        }}>
          <View style={{width: w(7), alignItems: 'center'}}>
            <FontAwesome6 name='computer' size={h(2)} color="black" style={{color: amenities.includes('Computers') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('Computers') ? 'white' : 'black'}}>Computers</Text>
            </TouchableOpacity>
            
      <TouchableOpacity onPress={() => handleSetAmenities('Air conditioner')} style={{backgroundColor: amenities.includes('Air conditioner') ? '#8888ff' : 'white',
  // aspectRatio: 1,
  height: h(4),
  paddingHorizontal: h(1.2),
  borderRadius: h(100),
  // justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  // opacity: 0.5.5
  }}>
    <View style={{width: w(7), alignItems: 'center'}}>
      <MaterialCommunityIcons name='air-conditioner' size={h(2)} color="black" style={{color: amenities.includes('Air conditioner') ? 'white' : 'black',}} />
    </View>
        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('Air conditioner') ? 'white' : 'black'}}>Air conditioner</Text>
      </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetAmenities('Vending machine')} style={{backgroundColor: amenities.includes('Vending machine') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          <View style={{width: w(7), alignItems: 'center'}}>
            <MaterialIcons name='fastfood' size={h(2)} color="black" style={{color: amenities.includes('Vending machine') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('Vending machine') ? 'white' : 'black'}}>Vending machine</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetAmenities('Board game')} style={{backgroundColor: amenities.includes('Board game') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          <View style={{width: w(7), alignItems: 'center'}}>
            <Entypo name='game-controller' size={h(2)} color="black" style={{color: amenities.includes('Board game') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('Board game') ? 'white' : 'black'}}>Board game</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetAmenities('Taobin')} style={{backgroundColor: amenities.includes('Taobin') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          <View style={{width: w(7), alignItems: 'center'}}>
          <Image source={{uri: 'https://cms.dmpcdn.com/trueyoumerchant/2023/06/26/5d097240-140b-11ee-95e2-6d745e0e1036_webp_original.webp'}} style={{width:h(3),height:h(3)}} />
            {/* <AntDesign name='customerservice' size={h(3)} color="black" style={{color: amenities.includes('Taobin') ? 'white' : 'black',}} /> */}
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: amenities.includes('Taobin') ? 'white' : 'black'}}>Taobin</Text>
            </TouchableOpacity>
                    </View>




                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',marginTop: h(7)}}>
                    <MaterialIcons name="workspaces" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black',}}> Select available spaces</Text>
                    </View>

                    <View style={{flexDirection: 'row',gap: h(1),paddingTop: h(1),flexWrap: 'wrap',alignItems: 'center',}}>
                  <TouchableOpacity onPress={() => handleSetAvailableSpaces('Working area')} style={{backgroundColor: availableSpaces.includes('Working area') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Working area') ? 'white' : 'black'}}>Working area</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetAvailableSpaces('Meeting room')} style={{backgroundColor: availableSpaces.includes('Meeting room') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Meeting room') ? 'white' : 'black'}}>Meeting room</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetAvailableSpaces('Private room')} style={{backgroundColor: availableSpaces.includes('Private room') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Private room') ? 'white' : 'black'}}>Private room</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetAvailableSpaces('Interview room')} style={{backgroundColor: availableSpaces.includes('Interview room') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Interview room') ? 'white' : 'black'}}>Interview room</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetAvailableSpaces('Breakout area')} style={{backgroundColor: availableSpaces.includes('Breakout area') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Breakout area') ? 'white' : 'black'}}>Breakout area</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetAvailableSpaces('Nap room')} style={{backgroundColor: availableSpaces.includes('Nap room') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
  }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Nap room') ? 'white' : 'black'}}>Nap room</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleSetAvailableSpaces('Training room')} style={{backgroundColor: availableSpaces.includes('Training room') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Training room') ? 'white' : 'black'}}>Training room</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleSetAvailableSpaces('Boardroom')} style={{backgroundColor: availableSpaces.includes('Boardroom') ? '#8888ff' : 'white',
        // aspectRatio: 1,
        height: h(4),
        paddingHorizontal: h(1.2),
        borderRadius: h(100),
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // opacity: 0.5.5
        }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Boardroom') ? 'white' : 'black'}}>Boardroom</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetAvailableSpaces('Relaxing area')} style={{backgroundColor: availableSpaces.includes('Relaxing area') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Relaxing area') ? 'white' : 'black'}}>Relaxing area</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetAvailableSpaces('Event space')} style={{backgroundColor: availableSpaces.includes('Event space') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Event space') ? 'white' : 'black'}}>Event space</Text>
            </TouchableOpacity>
           
      <TouchableOpacity onPress={() => handleSetAvailableSpaces('Library room')} style={{backgroundColor: availableSpaces.includes('Library room') ? '#8888ff' : 'white',
  // aspectRatio: 1,
  height: h(4),
  paddingHorizontal: h(1.2),
  borderRadius: h(100),
  // justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  // opacity: 0.5.5
  }}>
    
        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Library room') ? 'white' : 'black'}}>Library room</Text>
      </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetAvailableSpaces('Hot desk')} style={{backgroundColor: availableSpaces.includes('Hot desk') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
         
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Hot desk') ? 'white' : 'black'}}>Hot desk</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetAvailableSpaces('Virtual Office')} style={{backgroundColor: availableSpaces.includes('Virtual Office') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Virtual Office') ? 'white' : 'black'}}>Virtual Office</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetAvailableSpaces('Private office')} style={{backgroundColor: availableSpaces.includes('Private office') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Private office') ? 'white' : 'black'}}>Private office</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetAvailableSpaces('Custom office')} style={{backgroundColor: availableSpaces.includes('Custom office') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Custom office') ? 'white' : 'black'}}>Custom office</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetAvailableSpaces('Wellness room')} style={{backgroundColor: availableSpaces.includes('Wellness room') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Wellness room') ? 'white' : 'black'}}>Wellness room</Text>
            </TouchableOpacity>
           
            <TouchableOpacity onPress={() => handleSetAvailableSpaces('Shower')} style={{backgroundColor: availableSpaces.includes('Shower') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: availableSpaces.includes('Shower') ? 'white' : 'black'}}>Shower</Text>
            </TouchableOpacity>
            
                    </View>


                    </View>



                    <View style={{paddingLeft: w(5),alignSelf: 'flex-start',display: 'flex',flexDirection: 'row',alignItems: 'center',marginTop: h(8)}}>
                    <Entypo name="pin" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> Edit location on the map  (required)*</Text>
                    </View>

 
              
              <TouchableOpacity onPress={() => {navigation.navigate('PinMarkerScreen')}} style={{backgroundColor: 'white',
    // width: w(),
    height: h(6),
    borderRadius: h(100),
    marginLeft: w(5),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.6,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: h(1)}}>
                <Entypo name="pin" size={h(3.5)} color="black" style={{paddingLeft: w(3)}} />
                <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.6),color: 'black',paddingRight: w(3)}}> Edit location</Text>
              </TouchableOpacity>
            { markerCoordinate ? <Image source={  { uri: markerCoordinate.snapshot } } style={{aspectRatio: 1.4,width: w(80),marginTop: h(2),borderRadius: h(3),borderWidth: h(0.2),borderColor: 'white'}} /> : null }

            
            
            

           
            

          
            
            <View style={{paddingLeft: w(5),alignSelf: 'flex-start',display: 'flex',flexDirection: 'row',alignItems: 'center',marginTop: h(8)}}>
                    <MaterialCommunityIcons name="image-plus" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> Add photos of co-working space</Text>
                    </View>


        
            
            
            <View style={{display: 'flex',flexDirection: 'row',marginTop: h(1), gap: w(5),width: w(90)}}>


            <TouchableOpacity onPress={() => setIsPressAddPhotos(!isPressAddPhotos)} style={{backgroundColor: 'white',
    // width: w(40),
    height: h(6),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.6,
    flexDirection: 'row',
         }}>
          <MaterialCommunityIcons name="image-plus" size={h(3.5)} color="black" style={{paddingLeft: w(3)}} />
                
                <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.6),color: 'black',paddingRight: w(3)}}> Add photos</Text>
              </TouchableOpacity>

           { isPressAddPhotos && <TouchableOpacity onPress={pickImage} style={{backgroundColor: 'white',
    aspectRatio: 1,
    height: h(6),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.6
    }}>
                <MaterialCommunityIcons name="image" size={h(3.5)} color="black" />
            </TouchableOpacity>

  }
          
          { isPressAddPhotos &&   <TouchableOpacity onPress={pickImageCamera} style={{backgroundColor: 'white',
    aspectRatio: 1,
    height: h(6),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.6
    }}>
              <MaterialCommunityIcons name="camera" size={h(3.5)} color="black" />
            </TouchableOpacity>
            
  }
            </View>


            { imageList.length === 0 ? null :
            imageList.length === 1 ? 
            // <View style={{width: '100%',height: h(25),marginTop: h(5),}}>
            <View style={{height: h(25),aspectRatio: 1,borderRadius: h(3),borderWidth: h(0.1),borderColor: 'white',marginTop: h(5),}}>
            <TouchableOpacity style={{zIndex: 1,position: 'absolute',right: '7%',top: '7%',height: h(3),aspectRatio: 1,backgroundColor: 'rgba(0,0,0,0.45)',borderRadius: h(100),justifyContent: 'center',alignItems: 'center'}} onPress={() => {
              setImageList([]);
            }}>
              <Ionicons name='close' size={h(2.5)} color='white' style={{}}/>
              </TouchableOpacity>
            
            <Image source={{ uri: imageList[0] }} style={{width: '100%',height: '100%',borderRadius: h(3),borderColor: 'white'}} />
            
            </View>
            // </View> 
            :
        
          
            <View style={{width: '100%',height: h(25),marginTop: h(5),}}>
            <FlatList pagingEnabled={false} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: w(10), gap: w(6)}} keyExtractor={(item, index) => index} data={imageList} renderItem={({item}) => {
              return (
                <View style={{height: h(25),aspectRatio: 1,borderRadius: h(3),borderWidth: h(0.1),borderColor: 'white'}}>
                <TouchableOpacity style={{zIndex: 1,position: 'absolute',right: '7%',top: '7%',height: h(3),aspectRatio: 1,backgroundColor: 'rgba(0,0,0,0.45)',borderRadius: h(100),justifyContent: 'center',alignItems: 'center'}} onPress={() => {
                  setImageList(imageList.filter((i) => i !== item))
                }}>
                  <Ionicons name='close' size={h(2.5)} color='white' style={{}}/>
                  </TouchableOpacity>
                
                <Image source={{ uri: item }} style={{width: '100%',height: '100%',borderRadius: h(3),borderColor: 'white'}} />
                
                </View>
              )
            }} />
            </View>
}



<View style={{paddingLeft: w(5),alignSelf: 'flex-start',display: 'flex',flexDirection: 'row',alignItems: 'center',marginTop: h(8)}}>
                    <MaterialIcons name="contact-phone" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> Add contact of co-working space</Text>
                    </View>

                    
                    <TouchableOpacity onPress={() => setIsPressAddContact(!isPressAddContact)} style={{backgroundColor: 'white',
    // width: w(),
    height: h(6),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: w(5),
    // opacity: 0.6,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: h(1)}}>
                <MaterialIcons name="contact-phone" size={h(3.5)} color="black" style={{paddingLeft: w(3)}} />
                <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.6),color: 'black',paddingRight: w(3)}}> Add contact</Text>
              </TouchableOpacity>



{ isPressAddContact && <View style={{width: '90%',paddingTop: h(4)}}>
<View style={{width: '100%',paddingTop: h(0)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <Ionicons name="mail" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> Email</Text>
                    </View>
                    <TextInput keyboardType='default' placeholder="Enter co-working's email" placeholderTextColor='gray' onChangeText={(text) => setEmailOfCoWorkingSpace(text)} value={emailOfCoWorkingSpace} style={{paddingHorizontal: '5%',fontFamily: 'PatrickHand-Regular',fontSize: h(2), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.1),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                    
                </View>
<View style={{width: '100%',paddingTop: h(2)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <FontAwesome name="phone" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> Phone number</Text>
                    </View>
                    <TextInput keyboardType='number-pad' placeholder="Enter co-working's phone number" placeholderTextColor='gray' onChangeText={(text) => {
                      
                      const numbersOnly = text.replace(/[^0-9]/g, ''); 
                      setPhoneNumberOfCoWorkingSpace(numbersOnly);
                      
                      
                      }} value={phoneNumberOfCoWorkingSpace} style={{paddingHorizontal: '5%',fontFamily: 'PatrickHand-Regular',fontSize: h(2), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.1),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                    
                </View>
<View style={{width: '100%',paddingTop: h(2)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <FontAwesome6 name="line" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> Line</Text>
                    </View>
                    <TextInput keyboardType='default' placeholder="Enter co-working's line ID" placeholderTextColor='gray' onChangeText={(text) => setLineLinkOfCoWorkingSpace(text)} value={lineLinkOfCoWorkingSpace} style={{paddingHorizontal: '5%',fontFamily: 'PatrickHand-Regular',fontSize: h(2), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.1),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                    
                </View>
<View style={{width: '100%',paddingTop: h(2)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <FontAwesome name="facebook-square" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> Facebook</Text>
                    </View>
                    <TextInput keyboardType='default' placeholder="Eg. facebook page's name of co-working" placeholderTextColor='gray' onChangeText={(text) => setFacebookLinkOfCoWorkingSpace(text)} value={facebookLinkOfCoWorkingSpace} style={{paddingHorizontal: '5%',fontFamily: 'PatrickHand-Regular',fontSize: h(2), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.1),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                    
                </View>
<View style={{width: '100%',paddingTop: h(2)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <Entypo name="instagram" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> Instagram</Text>
                    </View>
                    <TextInput keyboardType='default' placeholder="Enter co-working's instagram ID" placeholderTextColor='gray' onChangeText={(text) => setInstagramLinkOfCoWorkingSpace(text)} value={instagramLinkOfCoWorkingSpace} style={{paddingHorizontal: '5%',fontFamily: 'PatrickHand-Regular',fontSize: h(2), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.1),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                </View>
<View style={{width: '100%',paddingTop: h(2)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <FontAwesome6 name="square-x-twitter" size={h(3)} color={isDarkTheme ? 'white' : 'black'} />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: isDarkTheme ? 'white' : 'black'}}> X-twitter</Text>
                    </View>
                    <TextInput keyboardType='default' placeholder="Enter co-working's x-twitter ID" placeholderTextColor='gray' onChangeText={(text) => setXTwitterLinkOfCoWorkingSpace(text)} value={xTwitterLinkOfCoWorkingSpace} style={{paddingHorizontal: '5%',fontFamily: 'PatrickHand-Regular',fontSize: h(2), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.1),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                </View>
          </View>  
}    


            <View style={{marginTop: h(15),width: w(80),alignItems: 'center',marginBottom: h(30)}}>
                <TouchableOpacity onPress={handlePost} style={{borderColor: 'white',borderRadius: h(2.6),backgroundColor: isDarkTheme ? '#99FFFF' : '#473FB7',width: '100%',height: h(6),justifyContent: 'center',alignItems: 'center'}}>
                    <Text style={{color: isDarkTheme ? 'black' : 'white',fontSize: h(3),fontFamily: 'PatrickHand-Regular'}}>Edit</Text>
                </TouchableOpacity>
                
            </View>
            
        </View>
        </ScrollView>
        </TouchableWithoutFeedback>

        </KeyboardAvoidingView>
        
    
    </View>

}
</>

  )
}

export default EditPostScreen;
