import React, { useContext, useEffect, useState, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { FlatList, TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, Alert, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons'
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../contexts/AuthContext';
import { NewFavoriteContext } from '../contexts/NewFavoriteContext';
import { ThemeContext } from '../contexts/ThemeContext';

import { LinearGradient } from 'expo-linear-gradient';
import LoadingScreen from './LoadingScreen';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, Entypo, FontAwesome, FontAwesome5, MaterialIcons, Fontisto, FontAwesome6, Feather  } from '@expo/vector-icons';
const FavoritesScreen = ({navigation}) => {

  const [mockAuth, setMockAuth ] = useContext(AuthContext);

  const [isDarkTheme, setIsDarkTheme] = useContext(ThemeContext);

  // const [ GetFavoriteList ] = useContext(GetFavoriteListContext);

  const [ newFavorite, setNewFavorite ] = useContext(NewFavoriteContext);

  const [favoriteList, setFavoriteList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isLoadingImage, setIsLoadingImage] = useState(true);

  const [isOpen, setIsOpen] = useState('open');
  const [openTimeOfThisDay, setOpenTimeOfThisDay] = useState('');

  
  const getFavoriteList = async () => {
    
      // setIsLoading(true);
      try {

    const docRef = doc(db, "users", mockAuth.currentUser.uid);
    const querySnapshot = await getDoc(docRef); 
    const { favorites } = querySnapshot.data();



    const editedFavorites = await Promise.all(favorites.map( async (data) => {

    let isOpen;
    let openTimeOfThisDay;

// const docRef = doc(db, "posts", item.postId);
// const docSnap = await getDoc(docRef);
// const data = docSnap.data();
// setPost(data);

const thisDay = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date());

const openTime = thisDay === 'Mon' ? data.openTime.mondayOpenTime : thisDay === 'Tue' ? data.openTime.tuesdayOpenTime : thisDay === 'Wed' ? data.openTime.wednesdayOpenTime : thisDay === 'Thu' ? data.openTime.thursdayOpenTime : thisDay === 'Fri' ? data.openTime.fridayOpenTime : thisDay === 'Sat' ? data.openTime.saturdayOpenTime : thisDay === 'Sun' ? data.openTime.sundayOpenTime : '';
const closeTime = thisDay === 'Mon' ? data.openTime.mondayCloseTime : thisDay === 'Tue' ? data.openTime.tuesdayCloseTime : thisDay === 'Wed' ? data.openTime.wednesdayCloseTime : thisDay === 'Thu' ? data.openTime.thursdayCloseTime : thisDay === 'Fri' ? data.openTime.fridayCloseTime : thisDay === 'Sat' ? data.openTime.saturdayCloseTime : thisDay === 'Sun' ? data.openTime.sundayCloseTime : '';

const formattedTime = openTime.time === 'Open 24 hours'|| closeTime.time === 'Open 24 hours' ? 'Open 24 hours' : openTime.time === 'Closed' || closeTime.time === 'Closed' ? 'Closed' : `${openTime.time} to ${closeTime.time}`;

openTimeOfThisDay = formattedTime

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

        // const docRef = doc(db, "posts", formattedPost.postId);
        // await setDoc(docRef, {
        //     ...formattedPost
        // })

        return formattedPost
        
        
    }))

    setFavoriteList(editedFavorites);
    setIsLoading(false);
    setTimeout(() => {

      setIsLoadingImage(false);
    },250)

      } catch (error) {

        console.log(error);
        setIsLoading(false);
      }
      
      
      
      console.log(editedFavorites, 'fav')
      
      
    }

  //   useFocusEffect(
  //   useCallback(() => {
        
  //       getFavoriteList(); 
        
  //   }, [])
  // );
  
    
    useLayoutEffect(() => {
  
      getFavoriteList();

}, [newFavorite]);
// console.log(favoriteList[0])
 
return (
    <>

    { isLoading ? <LoadingScreen /> :

    <View style={{flex:1,alignItems: 'center',backgroundColor: isDarkTheme ? '#150228' : '#ddddff'}}>
      <View style={{alignItems: 'center',width: '100%',height: '100%',}}>

      { favoriteList.length === 0 ? <Text style={{fontSize: h(4),color: isDarkTheme ? 'white' : 'black',fontFamily: 'Rockwell',fontWeight: 'bold', paddingTop: h(8),shadowOffset: { width: 0, height:  0},shadowOpacity: 0,}}>No favorite yet</Text> :

      <FlatList pagingEnabled={false} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: h(15),paddingTop: h(5), gap: h(3)}} keyExtractor={(item) => item.postId} data={favoriteList} renderItem={({item}) => {
        
        return (
          <>
          <View style={{alignItems: 'center',}}>
            { favoriteList.indexOf(item) === 0 && <Text style={{fontSize: h(4),color: isDarkTheme ? 'white' : 'black',fontWeight: 'bold',fontFamily: 'Rockwell', paddingTop: h(3),shadowOffset: { width: 0, height:  0},shadowOpacity: 0}}>Favorites</Text>}
          
            <TouchableOpacity onPress={() => {

//               let isOpen;
//               let openTimeOfThisDay;

// const docRef = doc(db, "posts", item.postId);
// const docSnap = await getDoc(docRef);
// const data = docSnap.data();
// // setPost(data);

// const thisDay = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date());

// const openTime = thisDay === 'Mon' ? data.openTime.mondayOpenTime : thisDay === 'Tue' ? data.openTime.tuesdayOpenTime : thisDay === 'Wed' ? data.openTime.wednesdayOpenTime : thisDay === 'Thu' ? data.openTime.thursdayOpenTime : thisDay === 'Fri' ? data.openTime.fridayOpenTime : thisDay === 'Sat' ? data.openTime.saturdayOpenTime : thisDay === 'Sun' ? data.openTime.sundayOpenTime : '';
// const closeTime = thisDay === 'Mon' ? data.openTime.mondayCloseTime : thisDay === 'Tue' ? data.openTime.tuesdayCloseTime : thisDay === 'Wed' ? data.openTime.wednesdayCloseTime : thisDay === 'Thu' ? data.openTime.thursdayCloseTime : thisDay === 'Fri' ? data.openTime.fridayCloseTime : thisDay === 'Sat' ? data.openTime.saturdayCloseTime : thisDay === 'Sun' ? data.openTime.sundayCloseTime : '';

// const formattedTime = openTime.time === 'Open 24 hours'|| closeTime.time === 'Open 24 hours' ? 'Open 24 hours' : openTime.time === 'Closed' || closeTime.time === 'Closed' ? 'Closed' : `${openTime.time} to ${closeTime.time}`;

// openTimeOfThisDay = formattedTime

// console.log(formattedTime, 'formattedTime');
// console.log(openTime, 'openTime');
// console.log(closeTime, 'closeTime');
// console.log(openTime.time, 'openTime');
// console.log(closeTime.time, 'closeTime');
// console.log(thisDay, 'thisDay');

// const currentTime = new Date();
// const currentHour = currentTime.getHours();
// const currentMinute = currentTime.getMinutes();
// const thisTimeFromMidnight = currentHour * 60 + currentMinute;


// if (openTime.time === 'Open 24 hours' || closeTime.time === 'Open 24 hours') {
//     isOpen = 'open';

// }
// else if (openTime.time === 'Closed' || closeTime.time === 'Closed') {
//     isOpen = 'closed';
// }
// else if (openTime.timeFromMidnight < closeTime.timeFromMidnight) {
//     if (thisTimeFromMidnight >= openTime.timeFromMidnight && thisTimeFromMidnight <= closeTime.timeFromMidnight) {
//         isOpen = 'open';
//     } else {
//         isOpen = 'closed';
//     }
// }
// else if (openTime.timeFromMidnight > closeTime.timeFromMidnight) {
//     if (thisTimeFromMidnight >= openTime.timeFromMidnight || thisTimeFromMidnight <= closeTime.timeFromMidnight) {
//         isOpen = 'open';
//     } else {
//         isOpen = 'closed';
//     }
// }
              navigation.navigate('ShowDetailsScreen', item )
              }} style={{shadowOpacity: 0.5,shadowOffset: { width: 0, height:  h(0.45)},shadowRadius: 3.5,shadowColor: isDarkTheme ? 'black' : 'black',padding: h(1.5),width: w(90), height: h(31),backgroundColor: isDarkTheme ? 'white' : 'white',justifyContent: 'center',alignItems: 'center',borderRadius: h(3),marginTop: favoriteList.indexOf(item) === 0 ? h(3) : 0}}>
          {/* <View style={{backgroundColor: 'lightblue',justifyContent: 'center',alignItems: 'center',width: '100%', height: '100%',display: 'flex', flexDirection: 'row'}}> */}
              <View style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
              {/* <View style={{width: '100%', height: '100%',backgroundColor: 'black'}}> */}
              {/* </View> */}
              <View style={{width: '100%',aspectRatio: 2.2,backgroundColor: 'rgba(0,0,0,0.11)', borderRadius: h(2),}}>
              
              <Image source={ !isLoadingImage ? {uri: item.imageList[0]} : null} style={{aspectRatio: 2.2, width: '100%', borderRadius: h(2),}} />

              
              </View>
              <View style={{width: '100%',paddingHorizontal: w(3),paddingTop: h(1)}}>

              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height: h(3.8)}}>
            <Text numberOfLines={1} style={{width: w(75),fontSize: h(2.7),color: isDarkTheme ? 'black' : 'black',fontFamily: 'PatrickHand-Regular',fontWeight: 'bold',}}>{item.nameOfCoWorkingSpace}</Text>
           {/* <LikeButton item={item}/> */}
        </View>
            <View style={{flexDirection:'row',alignItems:'center',}}>
                <FontAwesome5 name="map-marker-alt" size={h(2)} color="#505050" />
                <Text numberOfLines={1} style={{width: w(75),fontSize: h(2),color: '#505050',fontFamily: 'PatrickHand-Regular',}}>  {item.addressOfCoWorkingSpace}</Text>
            </View>
            
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',}}>
        <Text style={{fontSize:h(2),fontFamily:'PatrickHand-Regular',fontWeight:'bold',color: isDarkTheme ? 'black' : 'black'}}>{item.openTimeOfThisDay}</Text>
        <Text style={{paddingRight: w(2),fontSize:h(2.2),fontFamily:'PatrickHand-Regular',fontWeight:'bold',color: item.isOpen === 'closed' ? 'red' : 'green'}}>{item.isOpen}</Text>
        </View>
              </View>
              </View>
          {/* </View> */}
            </TouchableOpacity>
          
          </View>
          </>
        )
      }}
      
/>

    }
</View>
    </View>

   } 
  </>
  )
}

export default FavoritesScreen;