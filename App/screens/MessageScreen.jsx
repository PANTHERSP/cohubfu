import React from 'react';
import { TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, Alert, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'

const MessageScreen = ({navigation}) => {
  return (
    <View style={{justifyContent:'center',alignItems:'center',flex: 1,marginBottom:150}}>
      <Ionicons name="mail" size={200} color="black"  style={{}} />
      <Text style={{fontSize: 30}}>MessageScreen</Text>

      <Button onPress={() => {navigation.navigate('IndexScreen')}} title='Back to Login'></Button>
    </View>
  )
}

export default MessageScreen;