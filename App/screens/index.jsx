import React from 'react'
import { TouchableHighlight, Dimensions, Alert, Image, View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native';

const IndexScreen = ({navigation}) => {
    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1hcCUyMGNhcnRvb258ZW58MHwxfDB8fHww' }}
            style={styles.backgroundImage}>
       
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <SafeAreaView style={styles.container}>
              <View style={styles.heading}>
              {/* <TouchableOpacity style={styles.hamburger}>
              <Image
            source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAY1BMVEX///8AAADPz89LS0uWlpaPj4/4+PhfX1/29vawsLAdHR3b29v8/PzExMQzMzOEhIRzc3MPDw+hoaGysrLq6uo8PDwXFxfh4eFkZGRXV1fGxsZGRkaHh4fX19d6enqnp6e7u7sLhoRgAAAChUlEQVR4nO3di1LCQAyF4eWOCIgIqPWC7/+UWhm8jZNs2Z3JJP2/J8gZK+1u02xKAAAAAAAAAAAAAAAAABDfcjWZjfyYTVbLTvl2rwN/Nrv8gBPrYi80ycw33VtXerH9NCvgwbrOAoeciGvrKous9YA31jUWutEC3ltXWOxeSfhgXWCxBzng3Lq+CuZiwivr8iq4EhNurMurYCMm9H2rOJFvGNbVVdHzhJ6f2M4WYsJH6/IqeBQTel03/SSvoYbW5VUwFBOmW+v6it3KAdPRusBiRyVhWlhXWEj+JW29WJdY6EVN6PzhW71GW1vrKgtscwKm1FjXebEmL+DHOtjjhvDHskle+/7JOPa2abofd9jyPpleD/24ztoKBgAAAAAAAAAAPs2b49iPY9PlvVPrbWT9Lqmz0VuHfEOf7QoLpZPm27N1qRdT29hPZtZ1FpjlBPTdJiw3CH+6s66x0J0W0H+zvnbb8P7JzGDwLAdcWtdXgfyp5cq6vApWwS9S7ab4ZF1eBU9iQv8twlqTsHV1VfT8bxj//zD+b2n8+2GEZxoxoOfV75nyXBpgbaH20vr+GCFjfdiDNX4P9mk8/9povzJfwu+Xpvh73q3o7y0AAAAAAAAAAIAjwedE7cbeZiavO836mvt8050/r83vzD25WehL+LmJvme0Zsy+jD+/1GeTwjd1Bq3va7SlXaf+m4SVWdDx53nHn8kef65+hLMRDmJC6+qq6HlCb2um/8jnzPhcNv0mtwl77/JuyZ3e/lv11Q+Bw5+71oOz89x/25UxOML3DSPjDMsenEMa/yzZ5HcNlXsecHJ6pvNrtwMulo2zc7mbbudyAwAAAAAAAAAAAAAAAIBP7y86VZGfUH/eAAAAAElFTkSuQmCC' }}
            style={styles.image}
          />
          </TouchableOpacity> */}
                <View style={styles.titleBackground}>
                {/* <Image source={require('./assets/hamburger-bar.png')} style={styles.hamburger} /> */}
                <Text style={styles.title}>EW<Text style={styles.m}>E</Text>NT</Text>
                </View>
              </View>
    
              <TextInput
                style={styles.searchBox}
                placeholder="Find the activity you want!"
              />
    
              <Text style={styles.phrase}><Text style={{ color: 'white',fontStyle: 'italic' }}>No society, no life.</Text></Text>
    
              <View style={styles.registerLogin}>
                
                <TouchableOpacity style={styles.register} onPress={() => {
                  navigation.navigate('CreateAccountScreen');}}>
                  <Text style={styles.rText}>Register</Text>
                </TouchableOpacity>
              
              
                <TouchableOpacity style={styles.login} onPress={() => {
                  navigation.navigate('LoginScreen');}}>
                  <Text style={styles.lText}>Login</Text>
                </TouchableOpacity>
              
              
              </View>
            {/* <View> */}
                <TouchableOpacity style={styles.skip} onPress={() => {
                  navigation.navigate('GoToHomeScreen');
                  // const showAlert = () => 
                  //   Alert.alert('ควยไรอะ','',[{onPress: showAlert}]);
                  // showAlert();
                }
                
                    }>
                    <Text style={styles.sText}>Skip</Text>
                </TouchableOpacity>
            
            {/* </View> */}
            
            </SafeAreaView>
        </TouchableWithoutFeedback>
          </ImageBackground>
      );
    };
    
    const styles = StyleSheet.create({
      backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
      },
      container: {
        flex: 1,
        alignItems: 'center',
      },
      heading: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        marginBottom: 20,
      },
      hamburger: {
    
      },
      title: {
        fontSize: 45,
        
      },
      m: {
        color: 'black'
        // color: 'white',
      },
      searchBox: {
        width: '90%',
        height: 45,
        borderRadius: 20,
        paddingLeft: 45,
        marginTop: 20,
        fontSize: 15,
        backgroundColor: 'white',
        
      },
      phrase: {
        textAlign: 'center',
        fontSize: 30,
        marginBottom: 20,
        marginTop: 130,
        fontWeight: '300',
      },
      registerLogin: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
        marginBottom: 15,
      },
    
      register: {
        marginLeft: 25,
        backgroundColor: 'rgba(215, 49, 15, 0.75)',
        borderRadius: 25,
        borderColor: 'white',
        borderWidth: 1,
        color: 'white',
        padding: 20,
        width: 150,
        height: 70,
        alignItems: 'center',
    
      },
    
      rText: {
        fontSize: 25,
        color: 'white',
      },
    
      login: {
        marginRight: 25,
        backgroundColor: 'rgba(105, 252, 247, 0.65)',
        borderRadius: 25,
        borderColor: 'white',
        borderWidth: 1,
        padding: 20,
        width: 150,
        height: 70,
        alignItems: 'center',
        
    },
    
    lText: {
      fontSize: 25,
      color: 'white',
    },
      title: {
        fontSize: 50,
        // color: 'brown',
        color: 'white',
        fontFamily: 'Times New Roman'
        
        // backgroundColor: 'blue',
        
      
      },
      titleBackground: {
        // backgroundColor: "#00F99E",
        backgroundColor: '#9c4be7',
        borderRadius: 40,
        borderColor: 'white',
        borderWidth: 2,
        padding: 10,
        shadowOpacity: 1,shadowOffset: {width:0,height:12},shadowRadius:10,shadowColor:'blue'
        
    
    
      },
    
      image: {
        width: 50,
        height: 50,
        // resizeMode: 'cover',
      },
      skip: {
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: 'white',
        borderWidth: 1,
        padding: 10,
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        left: 140,
        
        //flexDirection: 'row',
      },
      sText: {
        fontSize: 15,
        color: 'black',
        
      },
    });

export default IndexScreen;