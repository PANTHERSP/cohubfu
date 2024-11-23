import React, { useContext } from 'react'
import {ActivityIndicator, useColorScheme, TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import { ThemeContext } from '../contexts/ThemeContext';
import react from 'react';


const LoadingScreen = ({navigation}) => {

    // const {width,height} = Dimensions.get('window');
    // const w = width;
    // const h = height;

    const [isDarkTheme, setIsDarkTheme] = useContext(ThemeContext);


    

  return (

    <View style={{flex:1,position: 'absolute',width: '100%',height: '100%',backgroundColor: isDarkTheme ? '#150228' : '#ddddff'}}>
    <View style={styles.background}>
        <SafeAreaView style={{justifyContent: 'center',alignItems: 'center'}}>
            {/* <FontAwesome name="cutlery" size={h(15)} color="black" style={{marginTop: h(15)}}  /> */}
                <Image source={require('../assets/logo.png')} style={{width: w(50),height: h(22),marginTop: h(15)}} />           
            <ActivityIndicator size={'large'} color={isDarkTheme ? 'white' : 'black'} style={{marginTop: h(5)}} />

        </SafeAreaView>
    </View>
    </View>
  )
}

export default LoadingScreen

const styles = StyleSheet.create({
    background: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#817BEC'
    }
})