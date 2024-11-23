// import React from 'react'
// import { useColorScheme, TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// const TestSignInScreen = () => {

//     const {width,height} = Dimensions.get('window');
//     const w = width;
//     const h = height;

//   return (
      
      
//         <LinearGradient colors={['#CFA6EB', '#C39DC3', '#6587BA']} style={{flex:1}}>
//       <View style={styles.background}>
//     <SafeAreaView style={{alignItems: 'center'}}>
//         <View style={{alignItems: 'center'}}>
//             <Text style={{width: w * 0.85,fontFamily: 'Rockwell',fontSize: 24,color: 'black',paddingTop: h * 0.12,textAlign: 'center',lineHeight: 30}}>Sign in or continue as a guest to place your order</Text>
//         </View>

//         <View style={{width: w * 0.8}}>
//             <Text style={{paddingTop: h * 0.05,fontSize: 16,fontFamily: 'Rockwell',color: 'white'}}>Email or Username</Text>
//             <TextInput style={{borderWidth: '2%',borderRadius: '20%',borderColor: 'black',backgroundColor: 'white',width: '100%',height: h * 0.06,paddingLeft: 30,marginTop: h * 0.01}} placeholder="Enter email or username">

//             </TextInput>
            
//             <Text style={{fontSize: 16,fontFamily: 'Rockwell',color: 'white',paddingTop: h * 0.025}}>Password</Text>
//             <TextInput style={{borderWidth: '2%',borderRadius: '20%',borderColor: 'black',backgroundColor: 'white',width: '100%',height: h * 0.06,paddingLeft: 30,marginTop: h * 0.01}} placeholder="Enter password">
                
//             </TextInput>

//         </View>
//             <View style={{marginTop: h * 0.2,width: w * 0.8,alignItems: 'center'}}>
//                 <TouchableOpacity style={{borderColor: 'white',borderRadius: '20%',backgroundColor: '#473FB7',width: '100%',height: h * 0.07,justifyContent: 'center',alignItems: 'center'}}>
//                     <Text style={{color: 'white',fontSize: 24,fontFamily: 'Optima'}}>Sign In</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={{borderColor: 'black',borderRadius: '20%',backgroundColor: 'white',width: '100%',height: h * 0.07,marginTop: h * 0.025,justifyContent: 'center',alignItems: 'center'}}>
//                     <Text style={{fontSize: 24,fontFamily: 'Optima'}}>Continue as Guest</Text>
//                 </TouchableOpacity>

//                     <View style={{flexDirection: 'row',paddingTop: h * 0.03}}>
//                         <Text style={{fontFamily: 'Optima',color: 'white',fontSize: 16}}>No account? </Text>
//                         <TouchableOpacity onPress={() => {}} underlayColor="transparent">
//                             <Text style={{fontFamily: 'Optima',textDecorationLine: 'underline',color: 'white',fontSize: 16}}>Create one now</Text>
//                         </TouchableOpacity>
//                     </View>
//             </View>
//     </SafeAreaView>
//     </View>
//     </LinearGradient>
//   )
// }

// export default TestSignInScreen

// const styles = StyleSheet.create({
//     background: {
//         flex: 1,
//         // justifyContent: 'center',
//         // alignItems: 'center',
//         // backgroundColor: '#A271E8',
//     }
// })

import React, { useState, useEffect, useContext } from 'react';
// import { PiPawPrint } from "react-icons/pi";
import { auth, db } from '../config/firebase';
import { useColorScheme, TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

import { collection, addDoc, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { FontAwesome, Ionicons, MaterialCommunityIcons  } from '@expo/vector-icons';
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { useNavigate } from 'react-router-dom';
import { IoMdMail, IoMdLock } from "react-icons/io";
import { TbLock, TbLockCheck } from "react-icons/tb";
// import { A } from '../components/Animation';
import LoadingScreen from './LoadingScreen';
import { AuthContext } from '../contexts/AuthContext';

const SignInScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [ mockAuth, setMockAuth ] = useContext(AuthContext);

    

    const handleSignIn = async () => {

        if (!email || !password) {
            Alert.alert('Please fill in all fields');
            // setError('');
            return;
            
        }
        try {
            
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);

            // const recentUserData = {
            //     displayName: auth.currentUser.displayName ? auth.currentUser.displayName : null,
            //     email: auth.currentUser.email ? auth.currentUser.email : null,
            //     photoURL: auth.currentUser.photoURL ? auth.currentUser.photoURL : null,
            //     phoneNumber: auth.currentUser.phoneNumber ? auth.currentUser.phoneNumber : null,
            //     uid: auth.currentUser.uid ? auth.currentUser.uid : null,
            //     providerData: auth.currentUser.providerData ? auth.currentUser.providerData : null
            //   };

            const docRef = doc(db, "recentUsers", auth.currentUser.uid);
            await setDoc(docRef, {
                
                    displayName: auth.currentUser.displayName,
                    email: auth.currentUser.email,
                    photoURL: auth.currentUser.photoURL,
                    phoneNumber: auth.currentUser.phoneNumber,
                    uid: auth.currentUser.uid,
                    providerData: auth.currentUser.providerData,
                    

                
            
            

            
                    

                

            });

            await AsyncStorage.setItem('mockAuth', JSON.stringify(auth));
            setMockAuth(auth);
            console.log(auth);
            // navigate('/home');
            
            // setTimeout(() => {
                navigation.navigate('GoToHomeScreen',{ screen: 'HomeScreen' }); 
                setTimeout(() => {
                    
                    setIsLoading(false); 
                },300)
            // }, 1000);
            setError('');
            setEmail('');
            setPassword('');
        } catch (error) {
            
            setError(error.message);
            setIsLoading(false);
            
            
        }
         


    };

    const handleContinueAsGuest = () => {
        // Logic for continuing as a guest
    };

    const handleGotoCreateAccount = () => {
        navigate('/create-account');
    };

    return (
        <>{ isLoading ? <LoadingScreen /> :
            <>
        <LinearGradient colors={['#A9CDF5','#00192E', '#014F8E',]} style={{flex:1}}>
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}}>
            <View style={{alignItems: 'center',width: '100%',height: '100%',}}>
            <FontAwesome name="cutlery" size={h(10)} color="black" style={{marginTop: h(10)}}  />
            <Text style={{fontFamily: 'Rockwell',fontSize: h(5),color: 'white',paddingTop: h(5),fontWeight: 'bold'}}>Sign in</Text>
            <View style={{width: '80%',marginTop: h(4),fontFamily: 'Optima',}}>
                
                <View style={{width: '100%'}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <Ionicons name="mail" size={h(3)} color="white" />
                        <Text style={{fontFamily: 'Optima',fontSize: h(2),color: 'white'}}> Email</Text>
                    </View>
                    <TextInput keyboardType='email-address' placeholder='Enter email' placeholderTextColor='gray' onChangeText={(text) => setEmail(text)} value={email} style={{paddingHorizontal: '5%',fontFamily: 'Optima',fontSize: h(1.7), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.2),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                </View>
                
                <View style={{width: '100%',marginTop: h(1.5)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <MaterialCommunityIcons name="lock" size={h(3)} color="white" />
                        <Text style={{fontFamily: 'Optima',fontSize: h(2),color: 'white'}}> Password</Text>
                    </View>
                    <TextInput  secureTextEntry keyboardType='ascii-capable' placeholder='Enter password' placeholderTextColor='gray' onChangeText={(text) => setPassword(text)} value={password} style={{paddingHorizontal: '5%',fontFamily: 'Optima',fontSize: h(1.7), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.2),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                </View>

                { error && <Text style={{ fontWeight: 'bold', alignSelf: 'center',paddingTop: h(1),fontFamily: 'Optima',fontSize: h(1.7),color: '#df0000'}}>Email or password is invalid</Text>}
                
                
                
            </View>
           
            <View style={{marginTop: h(20),width: w(80),alignItems: 'center'}}>
                <TouchableOpacity onPress={handleSignIn} style={{borderColor: 'white',borderRadius: h(2.6),backgroundColor: '#99FFFF',width: '100%',height: h(6),justifyContent: 'center',alignItems: 'center'}}>
                    <Text style={{color: 'black',fontSize: h(2.6),fontFamily: 'Optima'}}>Sign in</Text>
                </TouchableOpacity>
                
                <View style={{display: 'flex',flexDirection: 'row',marginTop: h(4)}}>
                    <Text style={{fontFamily: 'Optima',fontSize: h(1.8),color: 'white'}}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => {navigation.navigate('CreateAccountScreen')}} underlayColor="transparent">
                            <Text style={{fontFamily: 'Optima',fontSize: h(1.8),color: 'white',textDecorationLine: 'underline'}}>Create account</Text>
                        </TouchableOpacity>
                </View>
            </View>

            </View>
        </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </LinearGradient>
        
        </>
        }
    </>
    );
}

export default SignInScreen