import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { Switch, TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, Alert, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons'
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import { signOut } from 'firebase/auth';
import { auth, db, storage } from '../config/firebase';
import LoadingScreen from './LoadingScreen';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { doc, deleteDoc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import asyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Entypo, FontAwesome, FontAwesome5, MaterialIcons, Fontisto, FontAwesome6, Feather  } from '@expo/vector-icons';
// import { Switch } from 'react-native-switch';

const ProfileScreen = ({navigation}) => {


  const [isDarkTheme, setIsDarkTheme] = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState({});
  
  const [ mockAuth, setMockAuth ] = useContext(AuthContext);
  console.log(mockAuth);


  useLayoutEffect(() => {
    getUserData();
  }, []);



  const getUserData = async () => {

    const docRef = doc(db, "users", mockAuth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    setUserData(data);
    
  }

    const handleSignOut = async () => {
        try {
          setIsLoading(true);
          // if (auth.currentUser) {
            const docRef = doc(db, "recentUser", mockAuth.currentUser.uid);
              await deleteDoc(docRef);
            await signOut(auth);
          // }

          setMockAuth(null);

          await asyncStorage.removeItem('mockAuth');




          
          navigation.navigate('SignInScreen');
          setTimeout(() => {
            
            setIsLoading(false);
          },300)
        } catch (error) {
          console.log(error);
        }
    }
  
  return (

    <>
    { isLoading ? <LoadingScreen /> :  
    // <View style={{justifyContent:'center',alignItems:'center',flex: 1,marginBottom:150}}>
      <View style={{flex:1,backgroundColor: isDarkTheme ? '#7066b5' : '#a083ff'}}>
      {/* <Ionicons name="people" size={200} color="black"  style={{}} />
      <Text style={{fontSize: 30}}>ProfileScreen</Text>

      

      <Button onPress={() => {navigation.navigate('IndexScreen')}} title='Back to Login'></Button> */}


<TouchableOpacity onPress={() => {}} style={{
// width: '100%',
aspectRatio: 1,
height: h(5),
borderRadius: h(100),
// borderWidth: h(0.2),
justifyContent: 'center',
alignItems: 'center',
// opacity: 0.6,
// flexDirection: 'row',
// alignSelf: 'flex-start',
// zIndex: 1,
// marginTop: h(5)
position: 'absolute',
top: h(7),
right: w(8)
}}>

{/* <LinearGradient colors={[ '#A9CDF5','#00192E', '#014F8E',]} style={{height: h(3.8),
borderRadius: h(100),
justifyContent: 'center',
alignItems: 'center',
// opacity: 0.6,
flexDirection: 'row',}}> */}
<FontAwesome6 name="edit" size={h(3.5)} color={isDarkTheme ? 'black' : 'white'} style={{}} />
{/* <Text style={{fontFamily: 'PatrickHand-Regular',fontSize: h(1.95),color: 'white',paddingRight: w(2)}}> Edit post</Text> */}
{/* </LinearGradient> */}
</TouchableOpacity>


<View style={{borderWidth: h(0.5),borderColor: isDarkTheme ? 'black' : 'white',zIndex: 1,position: 'absolute',top: h(22.5),left: w(50) - h(7.5),height: h(15),aspectRatio: 1,borderRadius: h(100)}}>
            <Image source={require('../assets/person_placeholder.webp')} style={{height: '100%',width: '100%',borderRadius: h(100)}} />
            </View>

  <View style={{alignItems:'center',width: '100%',backgroundColor: isDarkTheme ? 'black' : 'white',bottom: 0,position: 'absolute',height: '70%',borderTopLeftRadius: h(7),borderTopRightRadius: h(7)}}>
      
      <View style={{marginTop: h(8),alignItems: 'center',borderBottomWidth: h(0.2),borderColor: '#dddddd',width: '95%',paddingBottom: h(2)}}>
        <Text style={{fontSize: h(4),fontFamily: 'PatrickHand-Regular',color: isDarkTheme ? 'white' : 'black'}}>
          {userData.username}
        </Text>
        <Text style={{fontSize: h(2),fontFamily: 'PatrickHand-Regular',color: isDarkTheme ? '#cccccc' : '#888888'}}>
          {userData.email}
        </Text>
      </View>


      <View style={{width: '90%',marginTop: h(2)}}>
        <Text style={{fontSize: h(3),fontFamily: 'PatrickHand-Regular',color: isDarkTheme ? 'white' : 'black'}}>Settings</Text>

        <View style={{width: '100%', flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',paddingHorizontal: w(3),paddingTop: h(1.5)}}>
            <Text style={{fontSize: h(2),fontFamily: 'PatrickHand-Regular',color: isDarkTheme ? 'white' : 'black'}}>Dark Mode</Text>
            <Switch value={isDarkTheme} onValueChange={() => setIsDarkTheme(!isDarkTheme)} />
        </View>

      </View>
      
      
      <View style={{marginTop: h(20),width: w(80),alignItems: 'center',marginBottom: h(20)}}>
                <TouchableOpacity onPress={handleSignOut} style={{borderColor: 'white',borderRadius: h(2.6),backgroundColor: isDarkTheme ? '#99FFFF' : '#473FB7',width: '100%',height: h(6),justifyContent: 'center',alignItems: 'center'}}>
                    <Text style={{color: isDarkTheme ? 'black' : 'white',fontSize: h(3),fontFamily: 'PatrickHand-Regular'}}>Sign out</Text>
                </TouchableOpacity>
                
            </View>
      
          </View>
            </View>
    // </View>
    }
    </>
  )
}

export default ProfileScreen;