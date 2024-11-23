import React, { useContext, useEffect, useState, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { Linking, ScrollView, ActivityIndicator, FlatList, TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, Alert, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, Pressable, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
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
import { FilteredOpenContext } from '../contexts/FilteredOpenContext';
import { FilteredNameContext } from '../contexts/FilteredNameContext';
import { collection, addDoc, query, where, getDocs, doc, setDoc, getDoc, onSnapshot, deleteDoc, orderBy } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import Animate from 'react-native-reanimated';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';




const SearchScreen = ({navigation, route}) => {


    const [filteredName, setFilteredName] = useContext(FilteredNameContext);
    const [filteredPosts, setFilteredPosts] = useContext(FilteredPostContext);
    const [filteredAmenities, setFilteredAmenities] = useContext(FilteredAmenitiesContext);
    const [filteredAvailableSpaces, setFilteredAvailableSpaces] = useContext(FilteredAvailableSpacesContext);
    const [filteredOpen, setFilteredOpen] = useContext(FilteredOpenContext);

    const [isLoading, setIsLoading] = useState(true);


    const [posts, setPosts] = useState([]);
    const [postsChanged, setPostsChanged] = useState([]);




    const getPosts = async () => {
  
  

        // setIsLoading(true);
            // setIsLoading(true);
          
        
        const q = query(collection(db, "posts"), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q); 
        const postsSnapshot = querySnapshot.docs.map((doc) => ({postId: doc.id, ...doc.data()}) );
        console.log(postsSnapshot, 'this is postsSnapshot')
    
        
       
    
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


        
    
    
    
       setPosts(editedPosts);

       console.log(editedPosts, 'this is editedPosts')
    setIsLoading(false)
    
    }

    useLayoutEffect(() => {
        getPosts();
    }, [] );








  return (
    <LinearGradient colors={['#A9CDF5','#00192E', '#014F8E',]} style={{flex:1}}>

<KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
<TouchableOpacity onPress={() => {navigation.goBack(); setPostsChanged([]);}} style={{backgroundColor: 'white',
    aspectRatio: 1,
    height: h(5.5),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    position:'absolute',
    zIndex: 1,
    marginTop: h(6),
    marginLeft: w(6),
    }}>
            <Ionicons name="arrow-back" size={h(3.5)} color="black" />
          </TouchableOpacity>


          <View style={{position:'relative',opacity: 0.8,alignSelf: 'center',backgroundColor: 'white',borderRadius: h(100),width: w(55),height: h(6),flexDirection: 'row',marginTop: h(5.2),alignItems: 'center',justifyContent: 'space-between',}}>
            <View style={{fontSize: h(2.4),fontFamily: 'PatrickHand-Regular',paddingLeft: w(5),width: '77%',height: '100%',backgroundColor: 'white',borderRadius: h(100),justifyContent: 'center'}} >
                <TextInput onChangeText={(text) => {
                   
                        setPostsChanged(posts.filter((post) => {
                            return post.nameOfCoWorkingSpace.toLowerCase().includes(text.toLowerCase())
                        }));
                }} placeholder="Search" placeholderTextColor='#606060' style={{fontSize: h(2.4),fontFamily: 'PatrickHand-Regular'}}/>
                </View>
              
                <View>
                  <Ionicons name="search-circle" size={h(5.5)} color="black" style={{paddingRight: w(10)}}/>
                </View>
              
            
          </View>  


          <View style={{marginTop: h(3),alignSelf: 'center',width: '100%',height: '100%',borderTopWidth: h(0.1),borderColor: 'white',paddingHorizontal: w(3.5)}}>

   { postsChanged.length === posts.length || isLoading ? null :   <FlatList 

        data={postsChanged}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.postId}
        contentContainerStyle={{gap: h(3),marginTop: h(3),paddingBottom: h(25)}}
        renderItem={({item}) => {
            return (
                <TouchableOpacity onPress={() => {
                        setFilteredName(item);
                        navigation.goBack();
                }} style={{flexDirection: 'row',alignItems: 'center',borderRadius: h(2)}}>
                    <View style={{aspectRatio: 1,height: h(8.5),backgroundColor: 'white',borderRadius: h(2),}}>
                        <Image source={{uri: item.imageList[0]}} style={{width: '100%',height: '100%',borderRadius: h(2)}} />
                    </View>

                    <View style={{gap: h(0.7),paddingLeft: w(3),flexDirection: 'column',justifyContent: 'center',width: w(75)}}>
                        <Text numberOfLines={1} style={{fontSize:h(2.4),fontFamily:'PatrickHand-Regular',color: 'white'}}>{item.nameOfCoWorkingSpace}</Text>
                        <Text numberOfLines={1} style={{fontSize:h(1.8),fontFamily:'PatrickHand-Regular',color: 'white'}}>{item.addressOfCoWorkingSpace}</Text>
                    </View>
                    </TouchableOpacity>
            )
        }} />
        
        
        }
        
        </View>
    
</KeyboardAvoidingView>
        </LinearGradient>
  )
}

export default SearchScreen

const styles = StyleSheet.create({})




