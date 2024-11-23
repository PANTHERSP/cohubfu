import React from 'react'
import { TouchableHighlight, Dimensions, Alert, Image, View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native';

const ForgotPasswordScreen = ({navigation}) => {
  return (
    <View style={{justifyContent:'center',alignItems:'center',flex: 1,marginBottom:150}}>
      <Text>ForgotPasswordScreen</Text>
      <Button onPress={() => {navigation.navigate('IndexScreen')}} title='Back to Login'></Button>
    </View>
  )
}

export default ForgotPasswordScreen;

const styles = StyleSheet.create({})