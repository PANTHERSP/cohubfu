import React from 'react'
import { TouchableHighlight, Dimensions, Alert, Image, View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const LoginScreen = ({navigation}) => {
  return (
    <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1604342427523-189b17048839?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwcm9maWxlLWxpa2VkfDh8fHxlbnwwfHx8fHw%3D' }}
        style={styles.backgroundImage}>
        {/* <Image
            source={{ uri: 'https://w7.pngwing.com/pngs/960/351/png-transparent-computer-icons-business-sikhism-text-rectangle-people-thumbnail.png'}}
        style={{width:50,height:100}} resizeMethod='contain'/> */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            
            <SafeAreaView style={{alignItems: 'center'}}>
        <View style={{opacity: 0.3,top:780,position: 'absolute',justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesome6 name="people-group" size={250} color="black" />
        </View>
                <View style={{top: 25,position: 'relative',alignItems: 'center',width:'60%',height:110,backgroundColor: 'pink',borderRadius:55,shadowOpacity: 5,shadowOffset: {width:0,height:15},shadowRadius:10}}>
                <Image source={{ uri: 'https://cdn.discordapp.com/attachments/1130168930724478987/1208987057804808204/IMG_5216.jpg?ex=65e547f0&is=65d2d2f0&hm=bc4c4498e1407025f8b9d78724c82ff25c5db07d8c30ef9e6a15ae7d5fb553ca&'}}
                    style={{width: 200,height: 50,top: 30,alignItems: 'center'}} resizeMode='contain'/>
                </View>
                <Text style={styles.loginText}>Login to your account</Text>
                
                <View style={styles.container}>

                    <TextInput 
                        style={styles.emailUsername}
                        placeholder="Email/Username"
                    />
                    <TextInput 
                        style={styles.password}
                        placeholder="Password"
                    />
                    <TouchableOpacity onPress={() => {navigation.navigate('ForgotPasswordScreen')}} underlayColor="transparent">
                        <Text style={styles.forgotPassword}>Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {navigation.navigate('GoToHomeScreen');}} style={styles.loginButton}>
                        {/* <View style={{justifyContent: 'center',alignItems: 'center'}}> */}
                            <Text style={styles.loginButtonText}>Login</Text>
                        {/* </View> */}
                    </TouchableOpacity>

                    <View style={styles.createAccountA}>
                        <Text style={{color: 'white',fontSize: 14}}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => {navigation.navigate('CreateAccountScreen')}} underlayColor="transparent">
                            <Text style={styles.createAccount}>Create account</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView>
            
        </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    container: {
        // justifyContent: 'center',
        alignItems: 'flex-end',
        width: '75%',
        // backgroundColor: 'none',
        
    },
    loginText: {
        color: 'white',
        fontSize: 40,
        paddingTop: 120,
        fontWeight: '200',
    },
    emailUsername: {
        width: '100%',
        height: 60,
        borderRadius: 30,
        paddingLeft: 20,
        marginTop: 70,
        fontSize: 16,
        backgroundColor: 'white',
        shadowOffset: {height:4},
        shadowOpacity: 10,
        shadowRadius: 5,
    },
    password: {
        width: '100%',
        height: 60,
        borderRadius: 30,
        paddingLeft: 20,
        marginTop: 25,
        fontSize: 16,
        backgroundColor: 'white',
        shadowOffset: {height:4},
        shadowOpacity: 10,
        shadowRadius: 5,
    },
    forgotPassword: {
        color: 'blue',
        paddingTop: 15,
        // left: 100,
        textDecorationLine: 'underline',
        fontSize: 14,
        
    },
    loginButton: {
        width: '100%',
        height: 60,
        backgroundColor: 'purple',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 120,
        // borderWidth: 1,
        // borderColor: 'white',




    },
    loginButtonText: {
        fontSize: 30,
        color: 'white',
    },
    createAccountA: {
        flexDirection: 'row',
        // justifyContent: 'flex-end',
        // alignSelf: 'flex-end',
        paddingTop: 10,
        // left: 30,
        


    },
    createAccount: {
        color: 'blue',
        // paddingTop: 10,
        // left: 100,
        textDecorationLine: 'underline',
        fontSize: 14,
    },

        
        



})

export default LoginScreen;