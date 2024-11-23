import React, { useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, Alert, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, Pressable } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons, Entypo  } from '@expo/vector-icons';
import { UserLocationContext } from '../contexts/UserLocationContext';
import {createNativeStackNavigator, TransitionPresets} from '@react-navigation/native-stack';
import { auth, db } from '../config/firebase';

import MessageScreen from './MessageScreen';
import ProfileScreen from './ProfileScreen';
import LoadingScreen from './LoadingScreen';
import * as Location from 'expo-location';
import { collection, addDoc, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../contexts/AuthContext';
import { PinMarkerContext } from '../contexts/PinMarkerContext';
import { reload } from 'firebase/auth';
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';

// const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const PinMarkerScreen = ({navigation}) => {

    
    const [ mockAuth, setMockAuth ] = useContext(AuthContext);
    const [markerCoordinate, setMarkerCoordinate] = useContext(PinMarkerContext);
    const mapRef = useRef(null);
    // const user = auth.currentUser;
    // console.log(auth.currentUser)
    const [isLoading, setIsLoading] = useState(true);
    
    const [submit, setSubmit] = useState(false);
    const [isFetchingCurrentLocation, setIsFetchingCurrentLocation] = useState(false);
    const [allowLocation, setAllowLocation] = useState(false);
    // const {location,setLocation} = useContext(UserLocationContext);

    // const [location, setLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useLayoutEffect(() => {
        if (markerCoordinate) {
            
                
                setIsLoading(false);
            
            return
        }
    (async () => {
      
    //   let { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status !== 'granted') {
    //     setErrorMsg('Permission to access location was denied');
    //     return;
    //   }

      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Lowest,});
      setCurrentLocation(location);
    //   setCurrentLocation(location);

    //   setAllowLocation(false);
      console.log(location)
      setTimeout(() => {
          
          setIsLoading(false);
      },100)
    })();
  }, []);

//   let text = 'Waiting..';
//   if (errorMsg) {
//     text = errorMsg;
//   } else if (location) {
//     text = JSON.stringify(location);
    
//   }

  const handleSetCurrentLocation = async () => {
    // if(isFetchingCurrentLocation) {
    //     console.log('fetching')
    //     return;
    // }
    // setIsFetchingCurrentLocation(true);
    // try {
      let _currentLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Lowest});
    //   setCurrentLocation(_currentLocation);
      console.log(_currentLocation)
      mapRef.current.animateToRegion({
        latitude: _currentLocation.coords.latitude,
        longitude: _currentLocation.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      })
      
//   } catch (error) {
//     console.log(error)
//   } finally {
//     setIsFetchingCurrentLocation(false);
//   }
    
}
//   const [markerCoordinate, setMarkerCoordinate] = useState(null);


  const handlePinMarker = () => {
      if (!markerCoordinate) {
          Alert.alert('Please pin the marker');
          return;
        }

        setSubmit(true);

        mapRef.current.animateToRegion({
          latitude: markerCoordinate.coordinate.latitude,
          longitude: markerCoordinate.coordinate.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        },0)
        setTimeout( async () => {
            
            try {
                const snapshot = await mapRef.current.takeSnapshot({
                  format: 'png', 
                  quality: 0.8,
                  result: 'file', 
                //   latitudeDelta: 0.01,
                //   longitudeDelta: 0.01,
                
    
    
                  
            });
            setMarkerCoordinate({coordinate: markerCoordinate.coordinate, snapshot: snapshot});
            console.log('Snapshot captured:', snapshot);
            navigation.goBack();
            setSubmit(false);
                
              } catch (error) {
                console.error('Error capturing snapshot:', error);
                setSubmit(false);
              }
        },600)
    
                
        // console.log(markerCoordinate)
        
        // setTimeout(() => {
            
        //     setIsLoading(false);
        // },100)

        

        // setMarkerCoordinate(null)
    


  }
//   console.log(location)
  return (
    // <View>
    <>
{ isLoading ? <LoadingScreen /> :
    
    <View style={{flex:1}}>
    {/* <> */}
    <MapView 
    ref={mapRef}
    showsUserLocation={true}
    style={styles.map}
    onPress={(Event) => {
          const { coordinate } = Event.nativeEvent;
          setMarkerCoordinate({coordinate: coordinate, snapshot: null});
        }}
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMapStyle3}
        initialRegion={{
            latitude: markerCoordinate ? markerCoordinate.coordinate.latitude : currentLocation?.coords.latitude,
            longitude: markerCoordinate ? markerCoordinate.coordinate.longitude : currentLocation?.coords.longitude,
            latitudeDelta: markerCoordinate ? 0.001 : 0.002,
            longitudeDelta: markerCoordinate ? 0.001 : 0.002,
        }}
        // region={{
        //   latitude: currentLocation?.coords.latitude,
        //   longitude: currentLocation?.coords.longitude,
        //   latitudeDelta: 0.01,
        //   longitudeDelta: 0.01,
        // }}
        showsCompass={false}
        showsMyLocationButton={false}
        showsBuildings={false}
        showsIndoors={false}
        showsPointsOfInterest={false}
        // showsTraffic={true}
        // showsScale={true}
        // showsUserLocation={true}
        mapType='standard'
        >
        <Marker
          coordinate={markerCoordinate?.coordinate}
          
          
          
          >
            <Image source={require('../assets/marker.png')} style={{aspectRatio: 0.7, height: 50}} />
            </Marker>
          </MapView>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        {/* <SafeAreaView style={{}}> */}
          {/* <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',left:20}}>
            <TextInput style={styles.searchBox} placeholder='Search' placeholderTextColor='white' />
              <View style={{right: 55,}}>
                <TouchableOpacity onPress={() => {console.log('SEARCH')}}>
                  <Ionicons name="search-circle" size={50} color="black" style={{color:"orange",}}/>
                </TouchableOpacity>
              </View>
            
          </View>         */}
            {/* <View style={{position:'absolute',right:20,marginTop:52}}>
              <TouchableOpacity onPress={() => {console.log('FILTER')}} style={[styles.iconStyle]}>
                <MaterialCommunityIcons name="filter-outline" size={30} color="white" style={{}} />
              </TouchableOpacity>
            </View> */}
          
          {/* <View style={{position:'absolute',right:20,marginTop:112,backgroundColor: 'orange'}}> */}
          <TouchableOpacity onPress={() => {navigation.goBack()}} style={[styles.iconStyle,{marginTop: h(8),marginLeft: w(12)}]}>
            <Ionicons name="arrow-back" size={h(3.5)} color="black" />
          </TouchableOpacity>
            
          {/* </View> */}

          <TouchableOpacity onPress={handleSetCurrentLocation} style={{backgroundColor: 'white',
    aspectRatio: 1,
    height: h(6),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: w(3),
    marginTop: h(2),
    opacity: 0.8}}>
              <MaterialCommunityIcons name="crosshairs-gps" size={h(3.5)} color="black" />
            </TouchableOpacity>

          {/* <View style={{position:'absolute',right:20,marginTop:172,}}>
            <TouchableOpacity onPress={{}} style={[styles.iconStyle]}>
              <Ionicons name={true ? 'invert-mode-outline' : 'invert-mode'} size={30} color="white" />
              
            </TouchableOpacity>
          </View> */}

          {/* <View style={{left: w(20),backgroundColor: 'orange'}}> */}
          {/* </View> */}
          
          {/* <View style={{position:'absolute',right:20,marginTop:292,}}> */}
            <TouchableOpacity onPress={handlePinMarker} style={{backgroundColor: 'white',
    aspectRatio: 1,
    height: h(6),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: w(3),
    opacity: 0.8,
    marginTop: h(1.2)}}>
              <Entypo name="pin" size={h(3.5)} color="black" />
            </TouchableOpacity>
          {/* </View> */}
        {/* </SafeAreaView> */}
        { submit && <LoadingScreen /> }
        {/* </TouchableWithoutFeedback> */}
          </View>
    }
           </>      
    );
};

const styles = StyleSheet.create({
  map: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  
  searchBox: {
    width: '60%',
    height: 60,
    backgroundColor: 'grey',
    borderRadius: 30,
    paddingLeft: 20,
    fontSize: 20,
    fontWeight: '300',
    opacity: 0.8,

  },
  iconStyle: {
    backgroundColor: 'white',
    aspectRatio: 1,
    height: h(6),
    borderRadius: h(100),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8
    
  }
  });

  export default PinMarkerScreen

  const customMapStyle1 = [
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#202c3e"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "gamma": 0.01
            },
            {
                "lightness": 20
            },
            {
                "weight": "1.39"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "weight": "0.96"
            },
            {
                "saturation": "9"
            },
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 30
            },
            {
                "saturation": "9"
            },
            {
                "color": "black"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "saturation": 20
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 20
            },
            {
                "saturation": -20
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 10
            },
            {
                "saturation": -30
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#193a55"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "saturation": 25
            },
            {
                "lightness": 25
            },
            {
                "weight": "0.01"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "lightness": -20
            }
        ]
    }
]

const customMapStyle2 = [
  {
      "featureType": "all",
      "elementType": "all",
      "stylers": [
          {
              "invert_lightness": true
          },
          {
              "saturation": "-9"
          },
          {
              "lightness": "0"
          },
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "administrative.country",
      "elementType": "labels.text",
      "stylers": [
          {
              "color": "#18ff00"
          }
      ]
  },
  {
      "featureType": "administrative.province",
      "elementType": "labels.text",
      "stylers": [
          {
              "color": "#ff0000"
          }
      ]
  },
  {
      "featureType": "administrative.locality",
      "elementType": "labels.text",
      "stylers": [
          {
              "color": "#00b2ff"
          }
      ]
  },
  {
      "featureType": "administrative.neighborhood",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text",
      "stylers": [
          {
              "color": "#ff0000"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "all",
      "stylers": [
          {
              "weight": "1.00"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "landscape.natural.landcover",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "poi.attraction",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.business",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "poi.place_of_worship",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "poi.school",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "simplified"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
          {
              "weight": "0.49"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#fefffc"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#ffffff"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#0020ff"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "weight": "0.01"
          },
          {
              "lightness": "-7"
          },
          {
              "saturation": "-35"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels.text",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#62ffd0"
          },
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#ff2d2d"
          }
      ]
  },
  {
      "featureType": "road.highway.controlled_access",
      "elementType": "labels.text",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
          {
              "hue": "#ff0000"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#777777"
          },
          {
              "visibility": "simplified"
          },
          {
              "saturation": "8"
          },
          {
              "lightness": "-57"
          },
          {
              "gamma": "1.68"
          },
          {
              "weight": "1.17"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "labels.text",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  }
]




const customMapStyle3 =
[
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "saturation": 10
            },
            {
                "hue": "#ddddee"
            },
            {
                "lightness": 20
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 13
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#144b53"
            },
            {
                "lightness": 14
            },
            {
                "weight": 1.4
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#021525"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0c4152"
            },
            {
                "lightness": 5
            },
            {
                "visibility": 'on'
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#0b434f"
            },
            {
                "lightness": 25
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#0b3d51"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "color": "#146474"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    }
]

const customMapStyle4 = [
    {
        "featureType": "all",
        "stylers": [
            {
                "saturation": 0
            },
            {
                "hue": "#e7ecf0"
            }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            {
                "saturation": -70
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "saturation": -20
            }
        ]
    }
]

const customMapStyle5 = [
    {
        "featureType": "road",
        "stylers": [
            {
                "hue": "#5e00ff"
            },
            {
                "saturation": -79
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "saturation": 10
            },
            {
                "hue": "#6066ff"
            },
            {
                "lightness": 20
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "lightness": 22
            }
        ]
    },
    {
        "featureType": "landscape",
        // "elementType": "geometry",
        "stylers": [
            {
                "hue": "#9000cc"
            },
            {
                "saturation": -11
            },
            // {
            //     "color": "#ff00ff",
            //     // "lightness": 90
            // }
            
        ]
    },
    {},
    {},
    {
        "featureType": "water",
        "stylers": [
            {
                "saturation": -65
            },
            {
                "hue": "#1900ff"
            },
            {
                "lightness": 8
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "weight": 1.3
            },
            {
                "lightness": 30
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "hue": "#5e00ff"
            },
            {
                "saturation": -16
            }
        ]
    },
    {
        "featureType": "transit.line",
        "stylers": [
            {
                "saturation": -72
            }
        ]
    },
    {}
]