import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableHighlight, Dimensions, Image, View, Linking, Text, TextInput, Button, Alert, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome, FontAwesome5, Entypo, FontAwesome6, Fontisto, AntDesign   } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../contexts/AuthContext';
import { PinMarkerContext } from '../contexts/PinMarkerContext';
import { NewPostContext } from '../contexts/NewPostContext';
import { FilteredPostContext } from '../contexts/FilteredPostContext';
import { FilteredAmenitiesContext } from '../contexts/FilteredAmenitiesContext';
import { FilteredAvailableSpacesContext } from '../contexts/FilteredAvailableSpacesContext';
import { FilteredOpenContext } from '../contexts/FilteredOpenContext';
import { auth, db, storage } from '../config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs, doc, setDoc, getDoc, orderBy } from 'firebase/firestore';
import LoadingScreen from './LoadingScreen';

const FilterScreen = ({navigation, route}) => {


  const [mockAuth, setMockAuth ] = useContext(AuthContext);
  const [filteredPosts, setFilteredPosts] = useContext(FilteredPostContext);
  const [filteredAmenities, setFilteredAmenities] = useContext(FilteredAmenitiesContext);
  const [filteredAvailableSpaces, setFilteredAvailableSpaces] = useContext(FilteredAvailableSpacesContext);
  const [filteredOpen, setFilteredOpen] = useContext(FilteredOpenContext);



  







  const handleSetFilteredAmenities = (amenity) => {
    if (filteredAmenities.includes(amenity)) {
      setFilteredAmenities(filteredAmenities.filter((item) => item !== amenity));
    } else {
      setFilteredAmenities([...filteredAmenities, amenity]);
    }

    console.log(filteredAmenities)
  }




  const handleSetFilteredAvailableSpaces = (space) => {
    if (filteredAvailableSpaces.includes(space)) {
      setFilteredAvailableSpaces(filteredAvailableSpaces.filter((item) => item !== space));
    } else {
      setFilteredAvailableSpaces([...filteredAvailableSpaces, space]);
    }
  }


  const handleSetFilteredOpen = () => {

    if (filteredOpen === '') {
      setFilteredOpen('open');
    
  }
  else if (filteredOpen === 'open') {
    setFilteredOpen('');
  }

}


const handleApplyFilters = async () => {
  
  

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



    const includesAllValues = (arr, values) => {
      
      for (let i = 0; i < values.length; i++) {
        
        if (!arr.includes(values[i])) {
          return false;
        }
      }
      
      return true;
    }
    
    
   
    
    


let filtered;
let filtered1;
let filtered2;
let filtered3;

if (filteredOpen === 'open') {
     filtered = editedPosts.filter((post) => post.isOpen === filteredOpen && includesAllValues(post.amenities, filteredAmenities) && includesAllValues(post.availableSpaces, filteredAvailableSpaces))
    //  filtered2 = filtered1.filter((post) => includesAllValues(post.amenities, filteredAmenities))

    //  filtered3 = filteredAvailableSpaces.map((space) => {

    //   return filtered2.filter((post) => post.availableSpaces.includes(space))
    //  })

       
     
}
else if (filteredOpen === '') {
  // filtered2 = filteredAmenities.map((amenity) => {

  //   return editedPosts.filter((post) => post.amenities.includes(amenity))

  //  })

  //  filtered3 = filteredAvailableSpaces.map((space) => {

  //   return filtered2.filter((post) => post.availableSpaces.includes(space))
  //  })

  filtered = editedPosts.filter((post) => includesAllValues(post.amenities, filteredAmenities) && includesAllValues(post.availableSpaces, filteredAvailableSpaces))
  
}


console.log(filtered, 'this is filteredPostsssssssssssssssssssssssssssss')
  setFilteredPosts(filtered);
    navigation.goBack();


}






  return (
    <LinearGradient colors={['#A9CDF5','#00192E', '#014F8E',]} style={{flex:1}}>

<TouchableOpacity onPress={() => {navigation.goBack()}} style={{backgroundColor: 'white',
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


      <Text style={{alignSelf: 'center',fontSize: h(4),color: 'black',fontWeight: 'bold',fontFamily: 'Rockwell', paddingTop: h(8),shadowOffset: { width: 0, height:  0},shadowOpacity: 0,}}>Filter</Text>



      
      


<View style={{width: w(90),alignSelf: 'center',}}>


<View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',marginTop: h(1)}}>
                    <FontAwesome6 name="door-open" size={h(3)} color="white" />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: 'white'}}> Open co-working space only</Text>
                    </View>

                    <View style={{flexDirection: 'row',paddingTop: h(1),}}>
                    <TouchableOpacity onPress={handleSetFilteredOpen} style={{backgroundColor: filteredOpen === 'open' ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    width: w(18),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    justifyContent: 'center',
    
    alignItems: 'center',
    flexDirection: 'row',
    // marginTop: h(1),
    // opacity: 0.5.5
    }}>
      {/* <View style={{width: w(7), alignItems: 'center'}}>
      <FontAwesome6 name='wifi' size={h(2)} color="black" style={{color: filteredAmenities.includes('Free wifi') ? 'white' : 'black',}} />
      </View> */}
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredOpen === 'open' ? 'white' : 'black'}}>Open</Text>
            </TouchableOpacity>
</View>



      
      
      <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',marginTop: h(2)}}>
                    <FontAwesome5 name="tag" size={h(3)} color="white" />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: 'white'}}> Amenities</Text>
                    </View>


<View style={{flexDirection: 'row',gap: h(1),paddingTop: h(1),flexWrap: 'wrap',alignItems: 'center',}}>
                  <TouchableOpacity onPress={() => handleSetFilteredAmenities('Free wifi')} style={{backgroundColor: filteredAmenities.includes('Free wifi') ? '#8888ff' : 'white',
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
      <FontAwesome6 name='wifi' size={h(2)} color="black" style={{color: filteredAmenities.includes('Free wifi') ? 'white' : 'black',}} />
      </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('Free wifi') ? 'white' : 'black'}}>Free wifi</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetFilteredAmenities('Kitchen')} style={{backgroundColor: filteredAmenities.includes('Kitchen') ? '#8888ff' : 'white',
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
              <FontAwesome6 name='utensils' size={h(2)} color="black" style={{color: filteredAmenities.includes('Kitchen') ? 'white' : 'black',}} />
        </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('Kitchen') ? 'white' : 'black'}}>Kitchen</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetFilteredAmenities('Printing')} style={{backgroundColor: filteredAmenities.includes('Printing') ? '#8888ff' : 'white',
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
            <Entypo name='print' size={h(2)} color="black" style={{color: filteredAmenities.includes('Printing') ? 'white' : 'black',}} />
            </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('Printing') ? 'white' : 'black'}}>Printing</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleSetFilteredAmenities('Laundry')} style={{backgroundColor: filteredAmenities.includes('Laundry') ? '#8888ff' : 'white',
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
            <MaterialIcons name='local-laundry-service' size={h(2)} color="black" style={{color: filteredAmenities.includes('Laundry') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('Laundry') ? 'white' : 'black'}}>Laundry</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetFilteredAmenities('Lockers')} style={{backgroundColor: filteredAmenities.includes('Lockers') ? '#8888ff' : 'white',
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
            <MaterialCommunityIcons name='locker-multiple' size={h(2)} color="black" style={{color: filteredAmenities.includes('Lockers') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('Lockers') ? 'white' : 'black'}}>Lockers</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetFilteredAmenities('CCTV')} style={{backgroundColor: filteredAmenities.includes('CCTV') ? '#8888ff' : 'white',
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
            <MaterialCommunityIcons name='cctv' size={h(2)} color="black" style={{color: filteredAmenities.includes('CCTV') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('CCTV') ? 'white' : 'black'}}>CCTV</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleSetFilteredAmenities('Coffee bar')} style={{backgroundColor: filteredAmenities.includes('Coffee bar') ? '#8888ff' : 'white',
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
          <Fontisto name='coffeescript' size={h(2)} color="black" style={{color: filteredAmenities.includes('Coffee bar') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('Coffee bar') ? 'white' : 'black'}}>Coffee bar</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetFilteredAmenities('Car parking')} style={{backgroundColor: filteredAmenities.includes('Car parking') ? '#8888ff' : 'white',
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
          <FontAwesome6 name='car-side' size={h(2)} color="black" style={{color: filteredAmenities.includes('Car parking') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('Car parking') ? 'white' : 'black'}}>Car parking</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetFilteredAmenities('Customer service')} style={{backgroundColor: filteredAmenities.includes('Customer service') ? '#8888ff' : 'white',
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
            <AntDesign name='customerservice' size={h(2)} color="black" style={{color: filteredAmenities.includes('Customer service') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('Customer service') ? 'white' : 'black'}}>Customer service</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleSetFilteredAmenities('Computers')} style={{backgroundColor: filteredAmenities.includes('Computers') ? '#8888ff' : 'white',
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
            <FontAwesome6 name='computer' size={h(2)} color="black" style={{color: filteredAmenities.includes('Computers') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('Computers') ? 'white' : 'black'}}>Computers</Text>
            </TouchableOpacity>
            
      <TouchableOpacity onPress={() => handleSetFilteredAmenities('Air conditioner')} style={{backgroundColor: filteredAmenities.includes('Air conditioner') ? '#8888ff' : 'white',
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
      <MaterialCommunityIcons name='air-conditioner' size={h(2)} color="black" style={{color: filteredAmenities.includes('Air conditioner') ? 'white' : 'black',}} />
    </View>
        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('Air conditioner') ? 'white' : 'black'}}>Air conditioner</Text>
      </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetFilteredAmenities('Vending machine')} style={{backgroundColor: filteredAmenities.includes('Vending machine') ? '#8888ff' : 'white',
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
            <MaterialIcons name='fastfood' size={h(2)} color="black" style={{color: filteredAmenities.includes('Vending machine') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('Vending machine') ? 'white' : 'black'}}>Vending machine</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetFilteredAmenities('Board game')} style={{backgroundColor: filteredAmenities.includes('Board game') ? '#8888ff' : 'white',
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
            <Entypo name='game-controller' size={h(2)} color="black" style={{color: filteredAmenities.includes('Board game') ? 'white' : 'black',}} />
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('Board game') ? 'white' : 'black'}}>Board game</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetFilteredAmenities('Taobin')} style={{backgroundColor: filteredAmenities.includes('Taobin') ? '#8888ff' : 'white',
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
            {/* <AntDesign name='customerservice' size={h(3)} color="black" style={{color: filteredAmenities.includes('Taobin') ? 'white' : 'black',}} /> */}
          </View>
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAmenities.includes('Taobin') ? 'white' : 'black'}}>Taobin</Text>
            </TouchableOpacity>
                    </View>




                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',marginTop: h(2)}}>
                    <MaterialIcons name="workspaces" size={h(3)} color="white" />
                        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.5),color: 'white'}}> Available spaces</Text>
                    </View>

                    <View style={{flexDirection: 'row',gap: h(1),paddingTop: h(1),flexWrap: 'wrap',alignItems: 'center',}}>
                  <TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Working area')} style={{backgroundColor: filteredAvailableSpaces.includes('Working area') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Working area') ? 'white' : 'black'}}>Working area</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Meeting room')} style={{backgroundColor: filteredAvailableSpaces.includes('Meeting room') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Meeting room') ? 'white' : 'black'}}>Meeting room</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Private room')} style={{backgroundColor: filteredAvailableSpaces.includes('Private room') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Private room') ? 'white' : 'black'}}>Private room</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Interview room')} style={{backgroundColor: filteredAvailableSpaces.includes('Interview room') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Interview room') ? 'white' : 'black'}}>Interview room</Text>
            </TouchableOpacity><TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Breakout area')} style={{backgroundColor: filteredAvailableSpaces.includes('Breakout area') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
      
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Breakout area') ? 'white' : 'black'}}>Breakout area</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Nap room')} style={{backgroundColor: filteredAvailableSpaces.includes('Nap room') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
  }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Nap room') ? 'white' : 'black'}}>Nap room</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Training room')} style={{backgroundColor: filteredAvailableSpaces.includes('Training room') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Training room') ? 'white' : 'black'}}>Training room</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Boardroom')} style={{backgroundColor: filteredAvailableSpaces.includes('Boardroom') ? '#8888ff' : 'white',
        // aspectRatio: 1,
        height: h(4),
        paddingHorizontal: h(1.2),
        borderRadius: h(100),
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // opacity: 0.5.5
        }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Boardroom') ? 'white' : 'black'}}>Boardroom</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Relaxing area')} style={{backgroundColor: filteredAvailableSpaces.includes('Relaxing area') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Relaxing area') ? 'white' : 'black'}}>Relaxing area</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Event space')} style={{backgroundColor: filteredAvailableSpaces.includes('Event space') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Event space') ? 'white' : 'black'}}>Event space</Text>
            </TouchableOpacity>
           
      <TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Library room')} style={{backgroundColor: filteredAvailableSpaces.includes('Library room') ? '#8888ff' : 'white',
  // aspectRatio: 1,
  height: h(4),
  paddingHorizontal: h(1.2),
  borderRadius: h(100),
  // justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  // opacity: 0.5.5
  }}>
    
        <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Library room') ? 'white' : 'black'}}>Library room</Text>
      </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Hot desk')} style={{backgroundColor: filteredAvailableSpaces.includes('Hot desk') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
         
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Hot desk') ? 'white' : 'black'}}>Hot desk</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Virtual Office')} style={{backgroundColor: filteredAvailableSpaces.includes('Virtual Office') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Virtual Office') ? 'white' : 'black'}}>Virtual Office</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Private office')} style={{backgroundColor: filteredAvailableSpaces.includes('Private office') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Private office') ? 'white' : 'black'}}>Private office</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Custom office')} style={{backgroundColor: filteredAvailableSpaces.includes('Custom office') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Custom office') ? 'white' : 'black'}}>Custom office</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Wellness room')} style={{backgroundColor: filteredAvailableSpaces.includes('Wellness room') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Wellness room') ? 'white' : 'black'}}>Wellness room</Text>
            </TouchableOpacity>
           
            <TouchableOpacity onPress={() => handleSetFilteredAvailableSpaces('Shower')} style={{backgroundColor: filteredAvailableSpaces.includes('Shower') ? '#8888ff' : 'white',
    // aspectRatio: 1,
    height: h(4),
    paddingHorizontal: h(1.2),
    borderRadius: h(100),
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // opacity: 0.5.5
    }}>
          
              <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(2.1),color: filteredAvailableSpaces.includes('Shower') ? 'white' : 'black'}}>Shower</Text>
            </TouchableOpacity>
            
                    </View>

          </View>


          <TouchableOpacity onPress={handleApplyFilters} style={{backgroundColor: 'white',
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
    bottom: h(4),
    right: w(10),

    shadowOffset: {
      width: 0,
      height: h(0.5),
    },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    shadowColor: 'black',

    }}>
            <Entypo name="check" size={h(3)} color="black" />
          </TouchableOpacity>


      </LinearGradient>
  )
}

export default FilterScreen

const styles = StyleSheet.create({})