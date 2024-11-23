// import React from 'react'
// import { TouchableHighlight, Dimensions, Alert, Image, View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native';
// import { FontAwesome6 } from '@expo/vector-icons';

// const CreateAccountScreen = () => {
//   return (
//     <ImageBackground 
//         source={{ uri: 'https://images.unsplash.com/photo-1604342427523-189b17048839?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwcm9maWxlLWxpa2VkfDh8fHxlbnwwfHx8fHw%3D' }}
//         style={styles.backgroundImage}>
//         {/* <Image
//             source={{ uri: 'https://w7.pngwing.com/pngs/960/351/png-transparent-computer-icons-business-sikhism-text-rectangle-people-thumbnail.png'}}
//         style={{width:50,height:100}} resizeMethod='contain'/> */}
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            
//             <SafeAreaView style={{alignItems: 'center'}}>
//         <View style={{opacity: 0.3,top:780,position: 'absolute',justifyContent: 'center', alignItems: 'center' }}>
//             <FontAwesome6 name="people-group" size={250} color="black" />
//         </View>
//                 <View style={{top: 25,position: 'relative',alignItems: 'center',width:'60%',height:110,backgroundColor: 'pink',borderRadius:55,shadowOpacity: 5,shadowOffset: {width:0,height:15},shadowRadius:10}}>
//                 <Image source={{ uri: 'https://cdn.discordapp.com/attachments/1130168930724478987/1208987057804808204/IMG_5216.jpg?ex=65e547f0&is=65d2d2f0&hm=bc4c4498e1407025f8b9d78724c82ff25c5db07d8c30ef9e6a15ae7d5fb553ca&'}}
//                     style={{width: 200,height: 50,top: 30,alignItems: 'center'}} resizeMode='contain'/>
//                 </View>
//                 <Text style={styles.loginText}>Login to your account</Text>
                
//                 <View style={styles.container}>

//                     <TextInput 
//                         style={styles.emailUsername}
//                         placeholder="Email/Username"
//                     />
//                     <TextInput 
//                         style={styles.password}
//                         placeholder="Password"
//                     />
//                     <TouchableOpacity onPress={() => {navigation.navigate('ForgotPasswordScreen')}} underlayColor="transparent">
//                         <Text style={styles.forgotPassword}>Forgot password?</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity onPress={() => {navigation.navigate('GoToHomeScreen');}} style={styles.loginButton}>
//                         {/* <View style={{justifyContent: 'center',alignItems: 'center'}}> */}
//                             <Text style={styles.loginButtonText}>Login</Text>
//                         {/* </View> */}
//                     </TouchableOpacity>

//                     <View style={styles.createAccountA}>
//                         <Text style={{color: 'white',fontSize: 14}}>Don't have an account? </Text>
//                         <TouchableOpacity onPress={() => {navigation.navigate('CreateAccountScreen')}} underlayColor="transparent">
//                             <Text style={styles.createAccount}>Create account</Text>
//                         </TouchableOpacity>
//                     </View>

//                 </View>
//             </SafeAreaView>
            
//         </TouchableWithoutFeedback>
//     </ImageBackground>
//   )
// }

// const styles = StyleSheet.create({
//     backgroundImage: {
//         flex: 1,
//         resizeMode: 'cover',
//         // justifyContent: 'center',
//         // alignItems: 'center',
//     },
//     container: {
//         // justifyContent: 'center',
//         alignItems: 'flex-end',
//         width: '75%',
//         // backgroundColor: 'none',
        
//     },
//     loginText: {
//         color: 'white',
//         fontSize: 40,
//         paddingTop: 120,
//         fontWeight: '200',
//     },
//     emailUsername: {
//         width: '100%',
//         height: 60,
//         borderRadius: 30,
//         paddingLeft: 20,
//         marginTop: 70,
//         fontSize: 16,
//         backgroundColor: 'white',
//         shadowOffset: {height:4},
//         shadowOpacity: 10,
//         shadowRadius: 5,
//     },
//     password: {
//         width: '100%',
//         height: 60,
//         borderRadius: 30,
//         paddingLeft: 20,
//         marginTop: 25,
//         fontSize: 16,
//         backgroundColor: 'white',
//         shadowOffset: {height:4},
//         shadowOpacity: 10,
//         shadowRadius: 5,
//     },
//     forgotPassword: {
//         color: 'blue',
//         paddingTop: 15,
//         // left: 100,
//         textDecorationLine: 'underline',
//         fontSize: 14,
        
//     },
//     loginButton: {
//         width: '100%',
//         height: 60,
//         backgroundColor: 'purple',
//         borderRadius: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: 120,
//         // borderWidth: 1,
//         // borderColor: 'white',




//     },
//     loginButtonText: {
//         fontSize: 30,
//         color: 'white',
//     },
//     createAccountA: {
//         flexDirection: 'row',
//         // justifyContent: 'flex-end',
//         // alignSelf: 'flex-end',
//         paddingTop: 10,
//         // left: 30,
        


//     },
//     createAccount: {
//         color: 'blue',
//         // paddingTop: 10,
//         // left: 100,
//         textDecorationLine: 'underline',
//         fontSize: 14,
//     },

        
        



// })


// export default CreateAccountScreen;

import React, { useEffect, useState } from 'react';

import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';


import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useColorScheme, TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5  } from '@expo/vector-icons';
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
// import { A } from '../components/Animation';
import LoadingScreen from './LoadingScreen';

const CreateAccountScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [minPasswordLength, setMinPasswordLength] = useState(false);
    const [maxPasswordLength, setMaxPasswordLength] = useState(false);
    const [notMatchPassword, setNotMatchPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isValid, setIsValid] = useState(true);

    const handleSetPhoneNumber = (text) => {
        
        const numbersOnly = text.replace(/[^0-9]/g, ''); 
        setPhoneNumber(numbersOnly);
        
      };

    

    const validateEmail = () => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

      
const handleSubmit = () => {
    if (email && password && confirmPassword && username && phoneNumber && address) {
          // const passwordMatchCheck = () => {
                
                if (password !== confirmPassword) {
                    setNotMatchPassword(true);
                    // console.log(notMatchPassword);
                    // return false;
                }
                else  {
                    setNotMatchPassword(false);
                    // return true;
                }
            // }

            // const passwordLengthCheck = () => {
                
                if (password.length < 8) {
                    setMinPasswordLength(true);
                    setMaxPasswordLength(false);
                    // console.log(minPasswordLength, maxPasswordLength);
                    // return false;
                }
                else if (password.length > 15) {
                    setMaxPasswordLength(true);
                    setMinPasswordLength(false);
                    // console.log(minPasswordLength, maxPasswordLength);
                    // return false;
                }
                else  {
                    setMaxPasswordLength(false);
                    setMinPasswordLength(false);
                    // return true;
                }
                // }
                
            // const emailCheck = () => {
                
                if (!(validateEmail())) {
                    setInvalidEmail(true);
                    // console.log(invalidEmail);
                    // return false;
                }
                else  {
                    setInvalidEmail(false);
                    // return true;
                }
                // }


                const thaiPhoneRegex = /^0[1-9][0-9]{8}$/;
        setIsValid(thaiPhoneRegex.test(phoneNumber));

                

    }
    
    else {
        Alert.alert('Please fill in all fields');
        return;
    }

    setSubmitting(true);
}
                useEffect(() => {
                    
                    if ( username && isValid && phoneNumber && address && !invalidEmail && !minPasswordLength && !maxPasswordLength && !notMatchPassword && submitting) {
                        handleCreateAccount();
                        
                    }
                }, [ isValid, username, phoneNumber, address, invalidEmail, minPasswordLength, maxPasswordLength, notMatchPassword, submitting]);
                const handleCreateAccount = async () => {
                    
                    try {
                        setIsLoading(true);
                        await createUserWithEmailAndPassword(auth, email, password);
                        const docRef = doc(db, "users", auth.currentUser.uid);
                        await setDoc(docRef, {
                            uid: auth.currentUser.uid,
                            username: username,
                            email: email,
                            phoneNumber: phoneNumber,
                            address: address,
                            favorites: [],
                            myPosts: [],
                        })
                        // await addDoc(collection(db, "users", auth.currentUser.uid), {
                        //     uid: auth.currentUser.uid,
                        //     username: username,
                        //     email: email,
                        //     phoneNumber: phoneNumber,
                        //     address: address
                        // })

                        

                        navigation.navigate('SignInScreen');
                        setIsLoading(false);
                        
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                        setInvalidEmail(false);
                        setUsername('');
                        setPhoneNumber('');
                        setAddress('');
                        setIsValid(true);
                        setMinPasswordLength(false);
                        setMaxPasswordLength(false);
                        setNotMatchPassword(false);
                        setSubmitting(false);
                    }
                    catch (error) {
                        console.error(error);
                        Alert.alert('Email already in use');
                        setEmail('');
                        setSubmitting(false);
                        setIsLoading(false);
                    }
                    
                
              
                }
            
            
        
        
            
            

    

    

    const handleGotoSignIn = () => {
        navigation.navigate('SigninScreen');
    };

    return (

        <>{ isLoading ? <LoadingScreen /> :
            <>
        <LinearGradient colors={[ '#A9CDF5','#00192E', '#014F8E',]} style={{flex:1}}>
    
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <ScrollView bounces={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{alignItems: 'center',width: '100%',height: '100%',}}>
            <FontAwesome name="cutlery" size={h(10)} color="black" style={{marginTop: h(10)}}  />
            <Text style={{fontFamily: 'Rockwell',fontSize: h(3.5),color: 'white',paddingTop: h(5),fontWeight: 'bold'}}>Create account</Text>
            <Text style={{fontFamily: 'Rockwell',fontSize: h(3.5),color: 'white',paddingTop: h(1),fontWeight: 'bold'}}>and enter contact info</Text>
            <View style={{width: '80%',marginTop: h(4),fontFamily: 'Optima',}}>
                
                <View style={{width: '100%'}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <Ionicons name="mail" size={h(3)} color="white" />
                        <Text style={{fontFamily: 'Optima',fontSize: h(2),color: 'white'}}> Email</Text>
                    </View>
                    <TextInput keyboardType='email-address' placeholder='Enter email' placeholderTextColor='gray' onChangeText={(text) => setEmail(text)} value={email} style={{paddingHorizontal: '5%',fontFamily: 'Optima',fontSize: h(1.7), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.2),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                    { invalidEmail && <Text style={{ fontWeight: 'bold', alignSelf: 'center',paddingTop: h(1),fontFamily: 'Optima',fontSize: h(1.7),color: '#df0000'}}>Please enter a valid email address</Text>}
                </View>
                
                <View style={{width: '100%',marginTop: h(1.5)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <MaterialCommunityIcons name="lock" size={h(3)} color="white" />
                        <Text style={{fontFamily: 'Optima',fontSize: h(2),color: 'white'}}> Password</Text>
                    </View>
                    <TextInput secureTextEntry keyboardType='ascii-capable' placeholder='Enter password' placeholderTextColor='gray' onChangeText={(text) => setPassword(text)} value={password} style={{paddingHorizontal: '5%',fontFamily: 'Optima',fontSize: h(1.7), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.2),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                    { minPasswordLength ? <Text style={{ fontWeight: 'bold', alignSelf: 'center',paddingTop: h(1),fontFamily: 'Optima',fontSize: h(1.7),color: '#df0000'}}>Password must be at least 8 characters long</Text> : maxPasswordLength ? <Text style={{ fontWeight: 'bold', alignSelf: 'center',paddingTop: h(1),fontFamily: 'Optima',fontSize: h(1.7),color: '#df0000'}}>Password must be less than 16 characters long</Text> : null}
                </View>
               
                <View style={{width: '100%',marginTop: h(1.5)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <MaterialCommunityIcons name="lock-check" size={h(3)} color="white" />
                        <Text style={{fontFamily: 'Optima',fontSize: h(2),color: 'white'}}> Confirm password</Text>
                    </View>
                    <TextInput secureTextEntry keyboardType='ascii-capable' placeholder='Confirm password' placeholderTextColor='gray' onChangeText={(text) => setConfirmPassword(text)} value={confirmPassword} style={{paddingHorizontal: '5%',fontFamily: 'Optima',fontSize: h(1.7), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.2),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                    { notMatchPassword && <Text style={{ fontWeight: 'bold', alignSelf: 'center',paddingTop: h(1),fontFamily: 'Optima',fontSize: h(1.7),color: '#df0000'}}>Passwords do not match</Text>}
                </View>
                
                <View style={{display: 'flex',flexDirection: 'row',marginTop: h(4),justifyContent: 'center'}}>
                    <Text style={{fontFamily: 'Optima',fontSize: h(1.8),color: 'white'}}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => {navigation.navigate('SignInScreen')}} underlayColor="transparent">
                            <Text style={{fontFamily: 'Optima',fontSize: h(1.8),color: 'white',textDecorationLine: 'underline'}}>Sign in</Text>
                        </TouchableOpacity>
                </View>

            </View>

                <Text style={{fontFamily: 'Rockwell',fontSize: h(3.5),color: 'white',paddingTop: h(12),fontWeight: 'bold',}}>Enter contact info</Text>
            
            

            <View style={{width: '80%',marginTop: h(4),fontFamily: 'Optima',}}>
                
                <View style={{width: '100%'}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <MaterialIcons name="drive-file-rename-outline" size={h(3)} color="white" />
                        <Text style={{fontFamily: 'Optima',fontSize: h(2),color: 'white'}}> Username</Text>
                    </View>
                    <TextInput placeholder='Enter your preferred username' placeholderTextColor='gray' onChangeText={(text) => setUsername(text)} value={username} style={{paddingHorizontal: '5%',fontFamily: 'Optima',fontSize: h(1.7), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.2),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                </View>
                
                <View style={{width: '100%',marginTop: h(1.5)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <FontAwesome name="phone" size={h(3)} color="white" />
                        <Text style={{fontFamily: 'Optima',fontSize: h(2),color: 'white'}}> Phone number</Text>
                    </View>
                    <TextInput keyboardType='number-pad' placeholder='Enter your phone number' placeholderTextColor='gray' onChangeText={handleSetPhoneNumber} value={phoneNumber} style={{paddingHorizontal: '5%',fontFamily: 'Optima',fontSize: h(1.7), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.2),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                    { !isValid && <Text style={{ fontWeight: 'bold', alignSelf: 'center',paddingTop: h(1),fontFamily: 'Optima',fontSize: h(1.7),color: '#df0000'}}>Please enter a valid phone number</Text>}
                </View>
               
                <View style={{width: '100%',marginTop: h(1.5)}}>
                    <View style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                    <FontAwesome5 name="address-card" size={h(3)} color="white" />
                        <Text style={{fontFamily: 'Optima',fontSize: h(2),color: 'white'}}> Address</Text>
                    </View>
                    <TextInput placeholder='Enter your address' placeholderTextColor='gray' onChangeText={(text) => setAddress(text)} value={address} style={{paddingHorizontal: '5%',fontFamily: 'Optima',fontSize: h(1.7), backgroundColor: 'white',borderColor: 'black',borderWidth: h(0.2),borderRadius: h(100),width: '100%',height: h(6),marginTop: h(0.2)}} />
                </View>
                
                

            </View>
                
           
            <View style={{marginTop: h(14),width: w(80),alignItems: 'center',marginBottom: h(20)}}>
                <TouchableOpacity onPress={handleSubmit} style={{borderColor: 'white',borderRadius: h(2.6),backgroundColor: '#99FFFF',width: '100%',height: h(6),justifyContent: 'center',alignItems: 'center'}}>
                    <Text style={{color: 'black',fontSize: h(2.6),fontFamily: 'Optima'}}>Create account</Text>
                </TouchableOpacity>
                
            </View>
        </View>
        </ScrollView>

        </KeyboardAvoidingView>
        {/* </TouchableWithoutFeedback> */}
        {/* <Text style={{color: 'white',marginBottom: h(5)}}>sdsdsd</Text> */}
    
    </LinearGradient>
        
        </>
        }
    </>

    //     <A>

    //      {/* <div style={{backgroundColor: 'black', width: 430, height: 932,display: 'flex',flexDirection: 'column',}}> */}
    //     <div style={{display: 'flex',flexDirection: 'column',width: '100%', height: '100vh'}}>
    //     <div style={{ overflowY: 'auto',overflowX: 'hidden',background: 'linear-gradient(to bottom, #CFA6EB, #C39DC3, #6587BA)', width: '100%',height: '100%', display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center',paddingTop: '60%' }}>
    //         <div style={{ width: '86%', textAlign: 'center', fontFamily: 'Rockwell', marginTop: '98%' }}>
    //         <PiPawPrint size={100} color="black" style={{marginTop: '0px'}} />
    //             <h1 style={{ fontFamily: 'cursive',fontSize: '32px', color: 'black', paddingTop: '2%' }}>Create account</h1>
    //             <h1 style={{ fontFamily: 'cursive',fontSize: '32px', color: 'black', paddingTop: '0%' }}>and enter contact info</h1>
    //             {/* <form> */}
    //             <div style={{ marginTop: '15%',display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
    //                 <label style={{ marginTop: '-10%',fontFamily: 'cursive',alignSelf: 'flex-start', fontSize: '20px', color: 'white' }}><IoMdMail size={35}/> Email</label>
                    
    //                 <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={{ boxShadow: '0px 5px 20px 0px rgba(0,0,0,0.7)',fontFamily: 'cursive',fontSize: '18px',paddingBlock: '6%', borderWidth: '4px', borderRadius: '200px', borderColor: invalidEmail ? 'red' : 'black', backgroundColor: 'white', width: '100%', height: '40px', paddingLeft: '30px',paddingRight: '30px', marginTop: '5px' }} placeholder="Enter email" />
    //                 { invalidEmail && <p style={{ paddingTop: '2%',fontFamily: 'cursive',fontSize: '17px',marginBottom: '-5%',color: 'red'}}>Please enter a valid email address</p>}
    //             </div>
    //             <div style={{ marginTop: '5%',display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
    //                 <label style={{ fontFamily: 'cursive',alignSelf: 'flex-start',fontSize: '20px', color: 'white' }}><TbLock size={35}/> Password</label>
    //                 <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" style={{ boxShadow: '0px 5px 20px 0px rgba(0,0,0,0.7)',fontFamily: 'cursive',fontSize: '18px',paddingBlock: '6%',borderWidth: '4px', borderRadius: '200px', borderColor: minPasswordLength || maxPasswordLength ? 'red' : 'black', backgroundColor: 'white', width: '100%', height: '40px', paddingLeft: '30px',paddingRight: '30px', marginTop: '5px' }} placeholder="Enter password" />
    //                 { minPasswordLength ? <p style={{paddingTop: '2%',fontFamily: 'cursive',fontSize: '17px',marginBottom: '-5%',color: 'red'}}>Password must be at least 8 characters long</p> : maxPasswordLength ? <p style={{paddingTop: '2%',fontFamily: 'cursive',fontSize: '17px',marginBottom: '-5%',color: 'red'}}>Password must be less than 16 characters long</p> : null}
    //             </div>
    //             <div style={{ marginTop: '5%',display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
    //                 <label style={{ fontFamily: 'cursive',alignSelf: 'flex-start',fontSize: '20px', color: 'white' }}><TbLockCheck size={35}/> Comfirm password</label>
    //                 <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" style={{ boxShadow: '0px 5px 20px 0px rgba(0,0,0,0.7)',fontFamily: 'cursive',fontSize: '18px',paddingBlock: '6%',borderWidth: '4px', borderRadius: '200px', borderColor: notMatchPassword ? 'red' : 'black', backgroundColor: 'white', width: '100%', height: '40px', paddingLeft: '30px',paddingRight: '30px', marginTop: '5px' }} placeholder="Confirm password" />
    //                 { notMatchPassword && <p style={{paddingTop: '2%',fontFamily: 'cursive',fontSize: '17px',marginBottom: '-5%',color: 'red'}}>Passwords do not match</p>}
    //             </div>
    //             <div style={{ marginBlock: '20%',marginTop: '22%' }}>
    //                 <div style={{ fontFamily: 'cursive', fontSize: '18px', color: 'white' }}>Already have an account? <button onClick={handleGotoSignIn} style={{ fontFamily: 'cursive',textDecoration: 'underline', color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Sign in</button></div>
    //                 {/* <button onClick={handleContinueAsGuest} style={{ borderWidth: '1px', borderRadius: '20px', borderColor: 'black', backgroundColor: 'white', width: '100%', height: '50px', marginTop: '15px', color: 'black', fontSize: '22px', fontFamily: 'cursive' }d}>Continue as Guest</button> */}
    //             </div>
                
    //             <h1 style={{ fontFamily: 'cursive',fontSize: '30px', color: 'black', paddingTop: '2%' }}>Enter contact info</h1>            
                
    //             <div style={{ marginTop: '15%',display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
    //                 <label style={{ marginTop: '-10%',fontFamily: 'cursive',alignSelf: 'flex-start', fontSize: '20px', color: 'white' }}><MdOutlineDriveFileRenameOutline size={35}/> Username</label>
                    
    //                 <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" style={{ boxShadow: '0px 5px 20px 0px rgba(0,0,0,0.7)',fontFamily: 'cursive',fontSize: '18px',paddingBlock: '6%', borderWidth: '4px', borderRadius: '200px', borderColor: 'black', backgroundColor: 'white', width: '100%', height: '40px', paddingLeft: '30px',paddingRight: '30px', marginTop: '5px' }} placeholder="Enter your preferred username" />
    //                 {/* { invalidEmail && <p style={{ paddingTop: '2%',fontFamily: 'cursive',fontSize: '17px',marginBottom: '-5%',color: 'red'}}>Please enter a valid email address</p>} */}
    //             </div>
    //             <div style={{ marginTop: '5%',display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
    //                 <label style={{ fontFamily: 'cursive',alignSelf: 'flex-start',fontSize: '20px', color: 'white' }}><FaPhone size={35}/> Phone number</label>
    //                 <input
    //     type="tel"
    //     id="phone"
    //     value={phoneNumber}
    //     onChange={handleSetPhoneNumber}
    //     placeholder="Enter your phone number"
    //     pattern="[0-9]*"
    //     style={{ boxShadow: '0px 5px 20px 0px rgba(0,0,0,0.7)',fontFamily: 'cursive',fontSize: '18px',paddingBlock: '6%', borderWidth: '4px', borderRadius: '200px', borderColor: isValid ? 'black' : 'red', backgroundColor: 'white', width: '100%', height: '40px', paddingLeft: '30px',paddingRight: '30px', marginTop: '5px' }}
    //   />
    //                 { !isValid && <p style={{paddingTop: '2%',fontFamily: 'cursive',fontSize: '17px',marginBottom: '-5%',color: 'red'}}>Please enter a valid phone number</p>}
    //             </div>
    //             <div style={{ marginTop: '15%',display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
    //                 <label style={{ marginTop: '-10%',fontFamily: 'cursive',alignSelf: 'flex-start', fontSize: '20px', color: 'white' }}><FaAddressCard size={35}/> Address</label>
                    
    //                 <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" style={{ boxShadow: '0px 5px 20px 0px rgba(0,0,0,0.7)',fontFamily: 'cursive',fontSize: '18px',paddingBlock: '6%', borderWidth: '4px', borderRadius: '200px', borderColor: 'black', backgroundColor: 'white', width: '100%', height: '40px', paddingLeft: '30px',paddingRight: '30px', marginTop: '5px' }} placeholder="Enter your address" />
    //                 {/* { invalidEmail && <p style={{ paddingTop: '2%',fontFamily: 'cursive',fontSize: '17px',marginBottom: '-5%',color: 'red'}}>Please enter a valid email address</p>} */}
    //             </div>
    //             <button onClick={handleSubmit} style={{ marginTop: '45%',borderWidth: '1px', borderRadius: '20px', borderColor: 'white', backgroundImage: 'linear-gradient(to top, #222222, #4b4079, #6c2c72)', backgroundColor: '#473FB7', width: '100%', height: '50px', color: 'white', fontSize: '22px', fontFamily: 'cursive' }}>Create account</button>
    //             {/* </form> */}

    //             <div style={{ marginTop: '30%',opacity: '0'}}>
    //                 br
    //             </div>
    //         </div>
    //     </div>
    //     </div>
    //     </A>
    );
}

export default CreateAccountScreen

