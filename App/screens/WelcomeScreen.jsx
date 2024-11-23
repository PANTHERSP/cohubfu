import React, { useEffect, useState, useContext } from 'react'
import { useColorScheme, TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import { auth } from '../config/firebase';
import react from 'react';
import { AuthContext } from '../contexts/AuthContext';




const WelcomeScreen = ({navigation}) => {

    const [ mockAuth, setMockAuth ] = useContext(AuthContext);

        // console.log(mockAuth, 'this is mock auth')
    // useEffect(() => {
    //     if (true) {
    //         navigation.navigate('GoToHomeScreen');
    //     }
    // }, [])

    // console.log(auth)
    // useEffect(() => {
    //     if (auth.currentUser) {
    //         navigation.navigate('GoToHomeScreen');
    //     }
    // }, []);

  return (

    <LinearGradient colors={['#A9CDF5','#00192E', '#014F8E',]} style={{flex:1}}>
        <SafeAreaView style={{alignItems: 'center',width: '100%',height: '100%'}}>
    
            <FontAwesome name="cutlery" size={h(12)} color="black" style={{marginTop: h(13)}}  />
            <Text style={{fontFamily: 'Rockwell',fontSize: h(5.5),color: 'white',paddingTop: h(8)}}>Confuso</Text>
            <View style={{width: '100%',marginTop: h(4)}}>
                <Text style={{fontFamily: 'Rockwell',color: 'white',fontSize: h(2),textAlign: 'center',lineHeight: h(3.2),fontStyle: 'italic'}}>Who says apps have to make sense?</Text>
                <Text style={{fontFamily: 'Rockwell',color: 'white',fontSize: h(2),textAlign: 'center',lineHeight: h(3.2),fontStyle: 'italic'}}>What is accessibility anyway?</Text>
                <Text style={{fontFamily: 'Rockwell',color: 'white',fontSize: h(2),textAlign: 'center',lineHeight: h(3.2),fontStyle: 'italic'}}>Confuso.</Text>
            </View>
            <View style={{marginTop: h(18),width: w(80)}}>
                <TouchableOpacity onPress={() => {navigation.navigate('SignInScreen')}} style={{borderColor: 'white',borderRadius: h(2.6),backgroundColor: '#99FFFF',width: '100%',height: h(6),justifyContent: 'center',alignItems: 'center'}}>
                    <Text style={{color: 'black',fontSize: h(2.6),fontFamily: 'Optima'}}>Get started</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{borderColor: 'white',borderRadius: '20%',borderWidth: '3%',backgroundColor: 'white',width: '100%',height: h * 0.07,marginTop: h * 0.025,justifyContent: 'center',alignItems: 'center'}}>
                    <Text style={{fontSize: 24,fontFamily: 'Optima'}}>What?</Text>
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    
    </LinearGradient>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    
})


// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';

// import { useNavigation } from '@react-navigation/native';
// import { FontAwesome } from '@expo/vector-icons';

// import { auth } from '../config/firebase';

// const TestLoginScreen = () => {
//     const navigation = useNavigation();
//     const [isLoading, setIsLoading] = useState(true);
    
//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged(user => {
//             if (user) {
//                 setTimeout(() => {
//                     setIsLoading(false); 
//                     navigation.navigate('Home'); 
//                 }, 500);
//             }
//             else {
//                 setTimeout(() => {
//                     setIsLoading(false); 
//                 }, 1000);
//             }
//         });

//         return () => unsubscribe();
//     }, [navigation]);
    
//     return (
//         <View style={styles.container}>
//             {isLoading ? (
//                 <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//                 <View style={styles.content}>
//                     <FontAwesome name="cutlery" size={150} color="black" style={styles.pawPrint} />
//                     <Text style={styles.title}>Mom Mam</Text>
//                     <Text style={styles.description}>Welcome to a World Tailored for Pets. Your Gateway to Furry Happiness!</Text>
//                     <Button title="Get started" onPress={() => navigation.navigate('SignIn')} />
//                 </View>
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#CFA6EB', // You can adjust the background color accordingly
//     },
//     content: {
//         alignItems: 'center',
//     },
//     pawPrint: {
//         marginTop: -60,
//     },
//     title: {
//         fontFamily: 'cursive',
//         fontSize: 50,
//         color: 'black',
//         paddingTop: 0,
//     },
//     description: {
//         fontFamily: 'cursive',
//         color: 'white',
//         fontSize: 20,
//         textAlign: 'center',
//         lineHeight: 30,
//         fontStyle: 'italic',
//         marginTop: 40,
//         marginBottom: 150,
//         paddingHorizontal: 20,
//     },
// });

// export default TestLoginScreen;