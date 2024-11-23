import React, { useContext, useEffect, useState, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { Linking, ScrollView, ActivityIndicator, FlatList, TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, Alert, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, Pressable, Modal } from 'react-native';
import {NavigationContainer,} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons, Entypo, FontAwesome, FontAwesome5, AntDesign, MaterialIcons, FontAwesome6, Fontisto  } from '@expo/vector-icons';
import { UserLocationContext } from '../contexts/UserLocationContext';
import {createNativeStackNavigator, TransitionPresets} from '@react-navigation/native-stack';
import { auth, db } from '../config/firebase';

import MessageScreen from './MessageScreen';
import ProfileScreen from './ProfileScreen';
import LoadingScreen from './LoadingScreen';
// import ShowDetailsScreen from './ShowDetailsScreen';
import * as Location from 'expo-location';
import { AuthContext } from '../contexts/AuthContext';
import { NewFavoriteContext } from '../contexts/NewFavoriteContext';
import { GetPostsContext } from '../contexts/FilteredPostContext';
import { EditPostContext } from '../contexts/EditPostContext';
import { ShowImageDetailsContext } from '../contexts/ShowImageDetailsContext';

import { collection, addDoc, query, where, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import Animate from 'react-native-reanimated';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';

const ShowDetailsScreen = ({route, navigation}) => {

const [post, setPost] = useState({});

const [showImageDetails, setShowImageDetails] = useState(null);

const [openTimeOfThisDay, setOpenTimeOfThisDay] = useState('');
const [isOpen, setIsOpen] = useState('open');

const [isLoading, setIsLoading] = useState(true);


const [mockAuth, setMockAuth] = useContext(AuthContext);

const [editPost, setEditPost] = useContext(EditPostContext);

const [currentImageIndex, setCurrentImageIndex] = useContext(ShowImageDetailsContext);



// useFocusEffect(
//     useCallback(() => {
        
//     //   setIsLoading(false);
//     // setCurrentImageIndex(0);
//     setCurrentImageIndex(currentImageIndex);
        
//     }, [])
//   );




useLayoutEffect(() => {

    getPost();
    console.log(editPost, 'edit post');
}, [editPost]);


const getPost = async () => {

    setIsLoading(true);
    
    const docRef = doc(db, "posts", route.params.postId);
    const docSnap = await getDoc(docRef);
    const data = {...docSnap.data(), postId: docSnap.id};
    setPost(data);

    const thisDay = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date());

    const openTime = thisDay === 'Mon' ? data.openTime.mondayOpenTime : thisDay === 'Tue' ? data.openTime.tuesdayOpenTime : thisDay === 'Wed' ? data.openTime.wednesdayOpenTime : thisDay === 'Thu' ? data.openTime.thursdayOpenTime : thisDay === 'Fri' ? data.openTime.fridayOpenTime : thisDay === 'Sat' ? data.openTime.saturdayOpenTime : thisDay === 'Sun' ? data.openTime.sundayOpenTime : '';
    const closeTime = thisDay === 'Mon' ? data.openTime.mondayCloseTime : thisDay === 'Tue' ? data.openTime.tuesdayCloseTime : thisDay === 'Wed' ? data.openTime.wednesdayCloseTime : thisDay === 'Thu' ? data.openTime.thursdayCloseTime : thisDay === 'Fri' ? data.openTime.fridayCloseTime : thisDay === 'Sat' ? data.openTime.saturdayCloseTime : thisDay === 'Sun' ? data.openTime.sundayCloseTime : '';
    
    const formattedTime = openTime.time === 'Open 24 hours'|| closeTime.time === 'Open 24 hours' ? 'Open 24 hours' : openTime.time === 'Closed' || closeTime.time === 'Closed' ? 'Closed' : `${openTime.time} to ${closeTime.time}`;
    
    setOpenTimeOfThisDay(formattedTime);

    console.log(formattedTime, 'formattedTime');
    console.log(openTime, 'openTime');
    console.log(closeTime, 'closeTime');
    console.log(openTime.time, 'openTime');
    console.log(closeTime.time, 'closeTime');
    console.log(thisDay, 'thisDay');

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const thisTimeFromMidnight = currentHour * 60 + currentMinute;


    if (openTime.time === 'Open 24 hours' || closeTime.time === 'Open 24 hours') {
        setIsOpen('open');

    }
    else if (openTime.time === 'Closed' || closeTime.time === 'Closed') {
        setIsOpen('closed');
    }
    else if (openTime.timeFromMidnight < closeTime.timeFromMidnight) {
        if (thisTimeFromMidnight >= openTime.timeFromMidnight && thisTimeFromMidnight <= closeTime.timeFromMidnight) {
            setIsOpen('open');
        } else {
            setIsOpen('closed');
        }
    }
    else if (openTime.timeFromMidnight > closeTime.timeFromMidnight) {
        if (thisTimeFromMidnight >= openTime.timeFromMidnight || thisTimeFromMidnight <= closeTime.timeFromMidnight) {
            setIsOpen('open');
        } else {
            setIsOpen('closed');
        }
    }


    setIsLoading(false);
    




}

    const ImageDetails = ({images}) => {

        return (
            <>
<TouchableOpacity onPress={() => setShowImageDetails(null)} style={{backgroundColor: 'white',
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
    zIndex: 4
    }}>
            <Ionicons name="arrow-back" size={h(3.5)} color="black" />
          </TouchableOpacity>
           
            <View style={{zIndex: 3,width:'100%',height:'100%',justifyContent:'center',backgroundColor: 'rgba(235,235,235,1)'}}>




            

                    


      {/* <Image source={{ uri: post.image }} style={{width:'100%',height: '100%',borderBottomWidth: h(0.1),borderColor: '#dddddd'}} /> */}
{/* <View style={{position:'absolute',width: '100%',height: '100%',backgroundColor: 'rgba(235,235,235,1)'}}> */}
      
    
      <FlatList onViewableItemsChanged={(info) => setCurrentImageIndex(info.viewableItems[0].index)} initialScrollIndex={currentImageIndex} getItemLayout={(item, index) => ({length: w(100), offset: w(100) * index,})} pagingEnabled={true} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{}} keyExtractor={(item, index) => index} data={images} renderItem={({item}) => {
              return (
                
                
                 <View style={{width: w(100),height: h(100),justifyContent:'center',}}>
                
                
                <Image source={{ uri: item  }} blurRadius={50} style={{width: '100%',height: '100%',}} />
                    
                    
                    
                    <View style={{position:'absolute',width: w(100),aspectRatio: 1,borderColor: 'white'}}>
                    
                    
                        <Image source={{ uri: item  }} style={{width: '100%',height: '100%',}} />
                    
                    </View>

                    <View style={{position: 'absolute',right: h(3),bottom: h(3),backgroundColor: 'rgba(255,255,255,0.6)',paddingHorizontal: h(1),borderRadius: h(2.5)}}>
                        <Text style={{fontSize:h(2.5),fontFamily:'PatrickHand-Regular',fontWeight:'bold',color: 'black'}}>{currentImageIndex + 1}/{post.imageList.length}</Text>
                    </View> 
      
      


                </View>

                   

                
              )
            }} />

{/* </View> */}
      
      


                
                
</View>      
                
                </>
                )
    }

    





    // useLayoutEffect(() => {

    //     getPost();
    // }, []);

  return (

<>
    { isLoading ? <LoadingScreen /> :

    <LinearGradient colors={['#A9CDF5','#00192E', '#014F8E',]} style={{flex:1}}>
    <TouchableOpacity onPress={() => {navigation.goBack(); setCurrentImageIndex(0)}} style={{backgroundColor: 'white',
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


    { showImageDetails && <ImageDetails images={showImageDetails} />}

    <ScrollView bounces={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
    <View style={{backgroundColor:'white',width:'100%',height:'100%',}}>

      
      <View style={{width: '100%',aspectRatio: 1,backgroundColor: 'rgba(0,0,0,0.11)'}}>

      {/* <Image source={{ uri: post.image }} style={{width:'100%',height: '100%',borderBottomWidth: h(0.1),borderColor: '#dddddd'}} /> */}
      
      <FlatList onViewableItemsChanged={(info) => setCurrentImageIndex(info.viewableItems[0].index)} initialScrollIndex={currentImageIndex} getItemLayout={(item, index) => ({length: w(100), offset: w(100) * index,})} pagingEnabled={true} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{}} keyExtractor={(item, index) => index} data={post.imageList} renderItem={({item, index}) => {
             
             return (
                
                <TouchableHighlight onPress={() => {navigation.navigate('ShowImageDetailsScreen', post.imageList)}} style={{width: w(100),aspectRatio: 1,borderRadius: h(3),borderColor: 'white'}}>
                
                
                <Image source={{ uri: item  }} style={{width: '100%',height: '100%',borderBottomWidth: h(0.1),borderColor: '#dddddd'}} />
                
                    
                 </TouchableHighlight>
                     
                    
              )
            }} />
      
      
      <View style={{position: 'absolute',right: h(3),bottom: h(3),backgroundColor: 'rgba(255,255,255,0.6)',paddingHorizontal: h(1),borderRadius: h(2.5)}}>
                        <Text style={{fontSize:h(2.5),fontFamily:'PatrickHand-Regular',fontWeight:'bold',color: 'black'}}>{currentImageIndex + 1}/{post.imageList.length}</Text>
                    </View> 
      
      </View>
      
      
      
      <View style={{width:'100%',height: '100%',backgroundColor: '#f3f3f3',padding:h(2.5)}}>

        <View style={{paddingBottom:h(1.5),borderBottomWidth: h(0.2),borderColor: '#d0d0d0',gap:h(0.6)}}>
        <Text numberOfLines={1} style={{fontSize:h(2.3),fontFamily:'PatrickHand-Regular',color: '#838383'}}>{post.addressOfCoWorkingSpace}</Text>
        <Text numberOfLines={1} style={{fontSize:h(3.2),fontFamily:'PatrickHand-Regular',fontWeight:'bold',}}>{post.nameOfCoWorkingSpace}</Text>

        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',}}>
        <Text style={{fontSize:h(2.3),fontFamily:'PatrickHand-Regular',fontWeight:'bold',}}>{openTimeOfThisDay}</Text>
        <Text style={{paddingRight:w(5),fontSize:h(2.3),fontFamily:'PatrickHand-Regular',fontWeight:'bold',color: isOpen === 'closed' ? 'red' : 'green'}}>{isOpen}</Text>
        </View>
        </View>

       


       
        <View style={{marginTop:h(2),}}>
        <Text style={{fontSize:h(2.7),fontFamily:'PatrickHand-Regular',fontWeight:'bold',}}>Available spaces</Text>
        <View style={{marginTop:h(2.5),gap:h(1),flexDirection:'row',flexWrap:'wrap',}}>
        { post.availableSpaces.map((item, index) => {
         
            return (
                // <View style={{flexWrap: 'wrap',flexDirection: 'row',}}>
                <View key={index} style={{backgroundColor: '#8888ff',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: 'white'}}>{item}</Text>
            </View>
            // </View>
              )
        })}


        { post.availableSpaces.length === 0 && <View style={{flexDirection:'row',alignItems:'center',}}>
                {/* <View style={{width: '10%',alignItems: 'center'}}>
                    <FontAwesome name="phone" size={h(3)} color="black" style={{}}/>
                    </View> */}
                    <Text style={{paddingLeft:w(3),fontSize:h(2),fontFamily:'PatrickHand-Regular',}}>-</Text>
                </View>}

        </View>
            



        </View>

       
        <View style={{marginTop:h(5),}}>
            <Text style={{fontSize:h(2.7),fontFamily:'PatrickHand-Regular',fontWeight:'bold',}}>Amenities</Text>
            <View style={{marginTop:h(2.5),gap:h(2),paddingLeft:w(3),}}>
        { post.amenities.map((item, index) => {
          return (
            <View key={index} style={{flexDirection: 'row',alignItems: 'center'}}>
                <View style={{width: '10%',alignItems: 'center'}}>
                    { item === 'Free wifi' ? <FontAwesome6 name='wifi' size={h(3)} color="black" style={{color: 'black',}} /> :
                    item === 'Kitchen' ? <FontAwesome6 name='utensils' size={h(3)} color="black" style={{color: 'black',}} /> :
                    item === 'Printing' ? <Entypo name='print' size={h(3)} color="black" style={{color: 'black',}} /> :
                    item === 'Coffee bar' ? <Fontisto name='coffeescript' size={h(3)} color="black" style={{color: 'black',}} /> :
                    item === 'Car parking' ? <FontAwesome6 name='car-side' size={h(3)} color="black" style={{color: 'black',}} /> :
                    item === 'Customer service' ? <AntDesign name='customerservice' size={h(3)} color="black" style={{color: 'black',}} /> : 
                    item === 'Laundry' ? <MaterialIcons name='local-laundry-service' size={h(3)} color="black" style={{color: 'black',}} /> :
                    item === 'Lockers' ? <MaterialCommunityIcons name='locker-multiple' size={h(3)} color="black" style={{color: 'black',}} /> :
                    item === 'Computers' ? <FontAwesome6 name='computer' size={h(3)} color="black" style={{color: 'black',}} /> :
                    item === 'Air conditioner' ? <MaterialCommunityIcons name='air-conditioner' size={h(3)} color="black" style={{color: 'black',}} /> :
                    item === 'CCTV' ? <MaterialCommunityIcons name='cctv' size={h(3)} color="black" style={{color: 'black',}} /> :
                    item === 'Vending machine' ? <MaterialIcons name='fastfood' size={h(3)} color="black" style={{color: 'black',}} /> :
                    item === 'Board game' ? <Entypo name='game-controller' size={h(3)} color="black" style={{color: 'black',}} /> :
                    item === 'Taobin' ? <Image source={{uri: 'https://cms.dmpcdn.com/trueyoumerchant/2023/06/26/5d097240-140b-11ee-95e2-6d745e0e1036_webp_original.webp'}} style={{width:h(5),height:h(5)}} /> : null 
                    }
                </View>
            <Text style={{fontSize:h(2),fontFamily:'PatrickHand-Regular',}}>   {item}</Text>
            </View>
            
          )
        })}

        {post.amenities.length === 0 && <View style={{flexDirection:'row',alignItems:'center',}}>
                {/* <View style={{width: '10%',alignItems: 'center'}}>
                    <FontAwesome name="phone" size={h(3)} color="black" style={{}}/>
                    </View> */}
                    <Text style={{fontSize:h(2),fontFamily:'PatrickHand-Regular',}}>-</Text>
                </View>}

</View>
        </View>



        <View style={{marginTop:h(5),marginBottom:h(5),}}>
            <Text style={{fontSize:h(2.7),fontFamily:'PatrickHand-Regular',fontWeight:'bold',}}>Contact</Text>

            <View style={{marginTop:h(2.5),gap:h(2),paddingLeft:w(3),}}>
            { (!post.phoneNumberOfCoWorkingSpace && !post.emailOfCoWorkingSpace && !post.lineLinkOfCoWorkingSpace && !post.facebookLinkOfCoWorkingSpace && !post.instagramLinkOfCoWorkingSpace && !post.xTwitterLinkOfCoWorkingSpace ) &&        <View style={{flexDirection:'row',alignItems:'center',}}>
                {/* <View style={{width: '10%',alignItems: 'center'}}>
                    <FontAwesome name="phone" size={h(3)} color="black" style={{}}/>
                    </View> */}
                    <Text style={{fontSize:h(2),fontFamily:'PatrickHand-Regular',}}>-</Text>
                </View>
    }
        { post.phoneNumberOfCoWorkingSpace &&        <TouchableOpacity onPress={() => {Linking.openURL('tel:' + post.phoneNumberOfCoWorkingSpace)}} style={{flexDirection:'row',alignItems:'center',}}>
                <View style={{width: '10%',alignItems: 'center'}}>
                    <FontAwesome name="phone" size={h(3)} color="black" style={{}}/>
                    </View>
                    <Text style={{fontSize:h(2),fontFamily:'PatrickHand-Regular',}}>   {post.phoneNumberOfCoWorkingSpace}</Text>
                </TouchableOpacity>
    }
        
           { post.emailOfCoWorkingSpace &&      <TouchableOpacity onPress={() => {Linking.openURL(`googlegmail://co?to=` + post.emailOfCoWorkingSpace)}} style={{flexDirection:'row',alignItems:'center',}}>
                <View style={{width: '10%',alignItems: 'center'}}>
                    <Ionicons name="mail" size={h(3)} color="black" style={{}}/>
                    </View>
                    <Text style={{fontSize:h(2),fontFamily:'PatrickHand-Regular',}}>   {post.emailOfCoWorkingSpace}</Text>
                </TouchableOpacity>
    }
                
                    { post.lineLinkOfCoWorkingSpace &&      <TouchableOpacity onPress={() => {Linking.openURL(`line://ti/p/~` + post.lineLinkOfCoWorkingSpace)}} style={{flexDirection:'row',alignItems:'center',}}>
                          <View style={{width: '10%',alignItems: 'center'}}>
                              <FontAwesome6 name="line" size={h(3)} color="black" style={{}}/>
                              </View>
                              <Text style={{fontSize:h(2),fontFamily:'PatrickHand-Regular',}}>   {post.lineLinkOfCoWorkingSpace}</Text>
                          </TouchableOpacity>
                     
                  }
                    { post.facebookLinkOfCoWorkingSpace &&      <TouchableOpacity onPress={() => {}} style={{flexDirection:'row',alignItems:'center',}}>
                          <View style={{width: '10%',alignItems: 'center'}}>
                              <FontAwesome name="facebook-square" size={h(3)} color="black" style={{}}/>
                              </View>
                              <Text style={{fontSize:h(2),fontFamily:'PatrickHand-Regular',}}>   {post.facebookLinkOfCoWorkingSpace}</Text>
                          </TouchableOpacity>
                     
                  }
          { post.instagramLinkOfCoWorkingSpace &&      <TouchableOpacity onPress={() => {Linking.openURL('instagram://user?username=' + post.instagramLinkOfCoWorkingSpace )}} style={{flexDirection:'row',alignItems:'center',}}>
                <View style={{width: '10%',alignItems: 'center'}}>
                    <Entypo name="instagram" size={h(3)} color="black" style={{}}/>
                    </View>
                    <Text style={{fontSize:h(2),fontFamily:'PatrickHand-Regular',}}>   {post.instagramLinkOfCoWorkingSpace}</Text>
                </TouchableOpacity>
           
        }
          { post.xTwitterLinkOfCoWorkingSpace &&      <TouchableOpacity onPress={() => {Linking.openURL(`twitter://user?screen_name=${post.xTwitterLinkOfCoWorkingSpace}` )}} style={{flexDirection:'row',alignItems:'center',}}>
                <View style={{width: '10%',alignItems: 'center'}}>
                    <FontAwesome6 name="square-x-twitter" size={h(3)} color="black" style={{}}/>
                    </View>
                    <Text style={{fontSize:h(2),fontFamily:'PatrickHand-Regular',}}>   {post.xTwitterLinkOfCoWorkingSpace}</Text>
                </TouchableOpacity>
           
        }
            </View>



            <View style={{marginTop:h(4),borderTopWidth: h(0.2),borderColor: '#d0d0d0'}}>
            {/* <Text style={{fontSize:h(2.7),fontFamily:'PatrickHand-Regular',fontWeight:'bold',}}>What you will love about this</Text> */}
        <Text style={{paddingTop:h(2),fontSize:h(1.9),fontFamily:'PatrickHand-Regular',color: '#838383'}}> {post.description}</Text>
        </View>
        
        </View>
       

       <View style={{marginBottom:h(12),flexDirection:'row',justifyContent:'space-evenly',}}>
        {/* <View style={{width: '100%',alignItems: 'center',justifyContent: 'center',marginTop: h(0),}}> */}
       { post.userId === mockAuth.currentUser.uid &&    <TouchableOpacity onPress={ () => Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}, {text: 'delete', onPress: async () => 
       {
           
           
            const docRefP = doc(db, 'posts', post.postId);
            await deleteDoc(docRefP);

            const docRefU = doc(db, "users", mockAuth.currentUser.uid);
      const querySnapshotU = await getDoc(docRefU); 
      const dataSnapshotU = querySnapshotU.data();
            
      await setDoc(docRefU, {
                uid: dataSnapshotU.uid,
                    username: dataSnapshotU.username,
                    email: dataSnapshotU.email,
                    phoneNumber: dataSnapshotU.phoneNumber,
                    address: dataSnapshotU.address,
                    favorites: dataSnapshotU.favorites.filter((item) => item.postId !== post.postId),
                    myPosts: dataSnapshotU.myPosts.filter((item) => item.postId !== post.postId),

            });

            navigation.goBack();

                
                    

                    
        }}])} style={{
    // width: '100%',
    height: h(3.8),
    borderRadius: h(100),
    // borderWidth: h(0.2),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.6,
    flexDirection: 'row',
    // alignSelf: 'flex-start',
    // marginTop: h(8)
    }}>

<LinearGradient colors={[ '#FF7777', '#AA0000']} style={{height: h(3.8),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.6,
    flexDirection: 'row',}}>
                <Ionicons name="trash" size={h(2.6)} color="white" style={{paddingLeft: w(2)}} />
                <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(1.95),color: 'white',paddingRight: w(2)}}> Delete post</Text>
              </LinearGradient>
              </TouchableOpacity>
    }

    { post.userId === mockAuth.currentUser.uid &&    <TouchableOpacity onPress={() => {navigation.navigate('EditPostScreen', post )}} style={{
// width: '100%',
height: h(3.8),
borderRadius: h(100),
// borderWidth: h(0.2),
justifyContent: 'center',
alignItems: 'center',
// opacity: 0.6,
flexDirection: 'row',
// alignSelf: 'flex-start',
marginTop: h(0)
}}>

<LinearGradient colors={[ '#A9CDF5','#00192E', '#014F8E',]} style={{height: h(3.8),
borderRadius: h(100),
justifyContent: 'center',
alignItems: 'center',
// opacity: 0.6,
flexDirection: 'row',}}>
<FontAwesome6 name="edit" size={h(2.6)} color="white" style={{paddingLeft: w(2)}} />
<Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(1.95),color: 'white',paddingRight: w(2)}}> Edit post</Text>
</LinearGradient>
</TouchableOpacity>
}
              </View>

              {/* </View> */}
       
       
       






        </View>
      {/* <Button title="Back" onPress={() => navigation.goBack()} /> */}
    </View>
    </ScrollView>
        <TouchableOpacity onPress={() => {
          Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${post.markerCoordinate.coordinate.latitude},${post.markerCoordinate.coordinate.longitude}`);
        }} style={{backgroundColor: 'white',
    aspectRatio: 1,
    height: h(6.5),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
    position:'absolute',
    zIndex: 2,
    // marginBottom: h(7),
    // marginRight: w(7),
    bottom: h(5),
    right: w(10),

    shadowOffset: {
      width: 0,
      height: h(0.5),
    },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    shadowColor: 'black',

    }}>
            <FontAwesome5 name="location-arrow" size={h(3)} color="black" />
          </TouchableOpacity>






    </LinearGradient>

}
</>
  )
}

export default ShowDetailsScreen

const styles = StyleSheet.create({})