import React , { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { LogBox, Platform,AppRegistry, useColorScheme, TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator, TransitionPresets} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { Theme } from './App/screens/HomeScreen';

import IndexScreen from './App/screens/index'
import MapScreen from './App/screens/MapScreen';
import HomeScreen from './App/screens/HomeScreen';
import FavoritesScreen from './App/screens/FavoritesScreen';
import MessageScreen from './App/screens/MessageScreen';
import ProfileScreen from './App/screens/ProfileScreen';
import SignInScreen from './App/screens/SignInScreen';
import CreateAccountScreen from './App/screens/CreateAccountScreen';
import ForgotPasswordScreen from './App/screens/ForgotPasswordScreen';
import PostScreen from './App/screens/PostScreen';
import WelcomeScreen from './App/screens/WelcomeScreen';
// import TestSignInScreen from './App/screens/SignInScreen'
import PinMarkerScreen from './App/screens/PinMarkerScreen';
import SearchScreen from './App/screens/SearchScreen';
import * as Location from 'expo-location'; 
import { UserLocationContext } from './App/contexts/UserLocationContext';
import { AuthContext } from './App/contexts/AuthContext';
import { NewFavoriteContext } from './App/contexts/NewFavoriteContext';
import { PinMarkerContext } from './App/contexts/PinMarkerContext';
import { EditPostContext } from './App/contexts/EditPostContext';
import { ShowImageDetailsContext } from './App/contexts/ShowImageDetailsContext';

import { NewPostContext } from './App/contexts/NewPostContext';
import asyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './App/config/firebase';
import { collection, addDoc, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import LoadingScreen from './App/screens/LoadingScreen';
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
// import Animated from 'react-native-reanimated';
// import BottomSheet from 'reanimated-bottom-sheet';
// import BottomSheet from 'reanimated-bottom-sheet';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import * as font from 'expo-font';
import ShowDetailsScreen from './App/screens/ShowDetailsScreen';
import EditPostScreen from './App/screens/EditPostScreen';
import ShowImageDetailsScreen from './App/screens/ShowImageDetailsScreen';
import { FilteredPostContext } from './App/contexts/FilteredPostContext';
import FilterScreen from './App/screens/FilterScreen';
import { FilteredAmenitiesContext } from './App/contexts/FilteredAmenitiesContext';
import { FilteredAvailableSpacesContext } from './App/contexts/FilteredAvailableSpacesContext';
import { FilteredOpenContext } from './App/contexts/FilteredOpenContext';
import { FilteredNameContext} from './App/contexts/FilteredNameContext';

import { ThemeContext } from './App/contexts/ThemeContext';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();




const App = () => {

  LogBox.ignoreAllLogs();


  useEffect(() => {
    
    font.loadAsync({
      'PatrickHand-Regular': require('./App/assets/fonts/PatrickHand-Regular.ttf'),
      'PlaypenSans-Regular': require('./App/assets/fonts/PlaypenSans-Regular.ttf'),
      'PlaypenSans-VariableFont_wght': require('./App/assets/fonts/PlaypenSans-VariableFont_wght.ttf'),
      
    });
  }, []);

  
  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 450,
      }}
    >
      <Text>Swipe down to close</Text>
    </View>
  );

  const sheetRef = useRef(null);
  

  const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });
 


  const bottomSheetRef = useRef(null);

  // callbacks
  // const handleSheetChanges = useCallback((index) => {
  //   console.log('handleSheetChanges', index);
  // }, []);
    
 
  
   return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
     <StatusBar style='auto' />
      <StackScreen />
     
    </NavigationContainer>
    </GestureHandlerRootView>


    // <>
    //   <View
    //     style={{
    //       flex: 1,
    //       backgroundColor: 'papayawhip',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //     }}
    //   >
    //     <Button
    //       title="Open Bottom Sheet"
    //       onPress={() => sheetRef.current.snapTo(0)}
    //     />
    //   </View>
    //   <BottomSheet
    //     ref={sheetRef}
    //     snapPoints={[450, 300, 0]}
    //     borderRadius={10}
    //     renderContent={renderContent}
    //   />
    // </>
    // <Animated.View style={{flex: 1}}>
    //   <Text>App</Text>
    // </Animated.View>


    // <View
    //   style={{
    //     flex: 1,
    //     alignItems: "center",
    //     justifyContent: "center",
    //     flexDirection: "column",
    //   }}
    // >
    //   <Animated.View
    //     style={[
    //       { width: 100, height: 80, backgroundColor: "black", margin: 30 },
    //       style,
    //     ]}
    //   />
    //   <Button
    //     title="toggle"
    //     onPress={() => {
    //       randomWidth.value = Math.random() * 350;
    //     }}
    //   />
    // </View>
    //   <GestureHandlerRootView style={{ flex: 1 }}>
    // <View style={styles.container}>
    //   <BottomSheet
    //     ref={bottomSheetRef}
    //     onChange={{}}
    //     snapPoints={[h(10), h(80)]}
    //   >
    //     <BottomSheetView style={styles.contentContainer}>
    //       <Text>Awesome 🎉</Text>
    //     </BottomSheetView>
    //   </BottomSheet>
    // </View>
    // </GestureHandlerRootView>
    
   );
};


const GoToHomeScreen = ({navigation, route}) => {
  
  // console.log(navigation)

  const [isDarkTheme, setIsDarkTheme] = useContext(ThemeContext);

  const [favoriteList, setFavoriteList] = useState([]);
  // const Theme = () => {
    
  //     setIsDarkTheme(!isDarkTheme);
      
    
  // };

  const getFavoriteList = async () => {
    
    // setIsLoading(true);
    try {

  const docRef = doc(db, "users", mockAuth.currentUser.uid);
  const querySnapshot = await getDoc(docRef); 
  const dataSnapshot = querySnapshot.data();

  setFavoriteList(dataSnapshot.favorites);
  setIsLoading(false);

    } catch (error) {

      console.log(error);
      setIsLoading(false);
    }
    
    
    
    // console.log(favoriteList)
    
    
  }

  // const [markerCoordinate, setMarkerCoordinate] = useState(null);
  

  return (

    
    <Tab.Navigator 
      initialRouteName="Homescreen"
      
      screenOptions= {({route}) => { return ({
        tabBarIcon: ({focused}) => {
          let iconName;
          let size;
          let color;

          let labelName;
          
          
          
          
            labelName = route.name === 'HomeScreen' ? 'Explore' :
                        route.name === 'FavoritesScreen' ? 'Favorites' :
                        route.name === 'PostScreen' ? 'Post' :
                        route.name === 'MessageScreen' ? 'Inbox' :
                        route.name === 'ProfileScreen' ? 'Profile' : null
          // let 
          
          if (focused) 
            {size = h(3.7); color = isDarkTheme ? '#cc66ff' : '#7722ff';}
          else 
            {size = h(2.7); color = isDarkTheme ? 'white' : 'black';}
          
          
          if (route.name === 'HomeScreen') 
            iconName = focused ? 'search' : 'search-outline';
          
          else if (route.name === 'FavoritesScreen') 
            iconName = focused ? 'heart' : 'heart-outline';

          else if (route.name === 'PostScreen') 
            iconName = focused ? 'add-circle' : 'add-circle-outline';

          else if (route.name === 'MessageScreen') 
            iconName = focused ? 'mail' : 'mail-outline';

          else if (route.name === 'ProfileScreen') 
            iconName = focused ? 'person-circle' : 'person-circle-outline';

          
            
          
          
            return (
            <View style={{display: 'flex', flexDirection: 'column',justifyContent: 'center',alignItems: 'center',width: w(20),height: '100%',paddingTop: '14%'}}>
              <Ionicons labelStyle={{color:'black'}} name={iconName} size={size} color={color} style={{}} />
              <Text style={{ color: focused ? (isDarkTheme ? '#cc66ff' : '#7722ff') : (isDarkTheme ? 'white' : 'black'),fontSize: focused ? h(1.32) : h(1.12),paddingTop: h(0.4)}}>
               {labelName}
              </Text>
            </View>
            )
        
        },
      
        tabBarStyle:{
          
          
          position: 'absolute',
          bottom: 0,
          height: h(8.7),
          width: '100%',
          // paddingBottom: 50,
          // marginBottom: 20,
          left: 0,
          right: 0,
          
          // borderTopLeftRadius: h(5),
          // borderTopRightRadius: h(5),
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          opacity: 0.9,
          shadowOffset: {
            width: 0,
            height: h(-0.3),
          },
          shadowOpacity: 0.5,
          shadowRadius: 5,
          shadowColor: isDarkTheme ? 'white' : 'black',
          backgroundColor: isDarkTheme ? 'black' : 'white',
        },
        labelStyle: {
          // display: 'none',
          // fontSize: 10,
          // fontWeight: '500',
          // color: 'black',
          
        
          
        },
        tabBarIconStyle: {
          // Top: 
          position: 'relative',
          bottom: 0,
          
          
        },
        // tabBarItemStyle: {
        //   display: 'flex',
        //   flexDirection: 'column',
        // },

        tabBarLabel: ({ focused }) => {
          let labelName;
          
          
          
          
            labelName = route.name === 'HomeScreen' ? 'Explore' :
                        route.name === 'FavoritesScreen' ? 'Favorites' :
                        route.name === 'PostScreen' ? 'Post' :
                        route.name === 'MessageScreen' ? 'Inbox' :
                        route.name === 'ProfileScreen' ? 'Profile' : null
          
          return(
          // <Text style={{ color: focused ? (isDarkTheme ? 'magenta' : 'magenta') : (isDarkTheme ? 'black' : 'white'),fontSize: focused ? h(1.32) : h(1.12),top:h(0)}}>
          //   {labelName}
          // </Text>
          null
          )
        }



        
        // tabBarLabelStyle: ({ focused }) => {
        //   return ({
        //     color: 'black',
        //     top: 14
        //   });
        // }
        
        
      })}} >
         
        
    
      <Tab.Screen options={{ headerShown: false,}} name="HomeScreen">{() => <HomeScreen navigation={navigation} route={route} />}</Tab.Screen>
      <Tab.Screen options={{ headerShown: false,}} name="FavoritesScreen">{() => <FavoritesScreen navigation={navigation} route={route} />}</Tab.Screen>
      <Tab.Screen options={{ headerShown: false,}} name="PostScreen">{() => <PostScreen navigation={navigation} route={route} />}</Tab.Screen>
      {/* <Tab.Screen options={{}} name="MessageScreen">{() => <MessageScreen navigation={navigation} route={route} />}</Tab.Screen> */}
      <Tab.Screen options={{ headerShown: false,}} name="ProfileScreen">{() => <ProfileScreen navigation={navigation} route={route} />}</Tab.Screen>
      
    </Tab.Navigator>
      
  );
};


  


const StackScreen = () => {

  const [mockAuth, setMockAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [markerCoordinate, setMarkerCoordinate] = useState(null);

//   const [posts, setPosts] = useState([]);

//   const getPosts = async () => {
//     // setIsLoading(true);
//     const querySnapshot = await getDocs(collection(db, 'posts')); 
//     const postsSnapshot = querySnapshot.docs.map((doc) => ({postId: doc.id, ...doc.data()}) );
//     console.log(postsSnapshot, 'this is postsSnapshot')

//     setPosts(postsSnapshot);

//     // console.log(posts)

//     // setIsLoading(false);
// }

//   useEffect(() => {

//     getPosts();

//   }, []);

  const [newFavorite, setNewFavorite] = useState([]);

  const [newPost, setNewPost] = useState([]);

  const [editPost, setEditPost] = useState({});

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [filteredPosts, setFilteredPosts] = useState([]);

  const [filteredAmenities, setFilteredAmenities] = useState([]);

  const [filteredAvailableSpaces, setFilteredAvailableSpaces] = useState([]);

  const [filteredOpen, setFilteredOpen] = useState('');

  const [filteredName, setFilteredName] = useState(null);

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  

  useEffect(() => {
    (async () => {
      const _auth = await asyncStorage.getItem('mockAuth').then((value) => JSON.parse(value));
      // console.log(_auth.currentUser)
      // console.log('1')

      if(_auth?.currentUser) {
        setMockAuth(_auth)
        
        
      }
      else {
        setMockAuth(auth);
      }

      setIsLoading(false);
      // console.log(_auth, 'this is _auth')
    })();
    // console.log(mockAuth, 'this is mockAuth inside useEffect')
  }, []);

  // console.log(mockAuth?.currentUser, 'this is mockAuth')

  
  
  return(

<ThemeContext.Provider value={[isDarkTheme, setIsDarkTheme]}>
<FilteredNameContext.Provider value={[filteredName, setFilteredName]}>
<FilteredAmenitiesContext.Provider value={[filteredAmenities, setFilteredAmenities]}>
<FilteredAvailableSpacesContext.Provider value={[filteredAvailableSpaces, setFilteredAvailableSpaces]}>
<FilteredOpenContext.Provider value={[filteredOpen, setFilteredOpen]}>
<FilteredPostContext.Provider value={[filteredPosts, setFilteredPosts]}>
<ShowImageDetailsContext.Provider value={[currentImageIndex, setCurrentImageIndex]}>
<EditPostContext.Provider value={[editPost, setEditPost]}>
<NewPostContext.Provider value={[newPost, setNewPost]}>
    <NewFavoriteContext.Provider value={[newFavorite, setNewFavorite]}>
    <PinMarkerContext.Provider value={[markerCoordinate, setMarkerCoordinate]}>
<AuthContext.Provider value={[mockAuth, setMockAuth]}>
    
      <Stack.Navigator>


    { isLoading ? 
    <Stack.Screen
    name="LoadingScreen"
    component={LoadingScreen}
    options={({ route }) => ({
      headerShown: false,
      // animation: 'fade',
      // animationDuration: 2000,
      // tabBarVisible: screensWithTabs.includes(route.name),
    })}
  /> : ( !mockAuth?.currentUser ?
      
    <>
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            animationDuration: 2000,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />
        <Stack.Screen
          name="GoToHomeScreen"
          component={GoToHomeScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
            // animationDuration: 1500
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />
        
          <Stack.Screen
            name="SignInScreen"
            component={SignInScreen}
            options={({ route }) => ({
              headerShown: false,
              animation: 'none',
              animationDuration: 1000,
              gestureEnabled: false,
              // gestureEnabled: false
              // tabBarVisible: screensWithTabs.includes(route.name),
            })}
          />
        
        <Stack.Screen
          name="CreateAccountScreen"
          component={CreateAccountScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            animationDuration: 1000,
            gestureEnabled: false,
            
            

            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />


        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            animationDuration: 1000,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />

   
        

        <Stack.Screen
          name="PinMarkerScreen"
          component={PinMarkerScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            animationDuration: 1000,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />

<Stack.Screen
          name="ShowDetailsScreen"
          component={ShowDetailsScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            animationDuration: 1000,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />
<Stack.Screen
          name="EditPostScreen"
          component={EditPostScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            animationDuration: 1000,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />
<Stack.Screen
          name="ShowImageDetailsScreen"
          component={ShowImageDetailsScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            animationDuration: 1000,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />
<Stack.Screen
          name="FilterScreen"
          component={FilterScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'fade_from_bottom',
            animationDuration: 500,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'fade_from_bottom',
            animationDuration: 500,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />
    
    </> : <>
    <Stack.Screen
      name="GoToHomeScreen"
      component={GoToHomeScreen}
      options={({ route }) => ({
        headerShown: false,
        animation: 'none',
        gestureEnabled: false,
        // animationDuration: 1500
        // tabBarVisible: screensWithTabs.includes(route.name),
      })}
    />
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            animationDuration: 2000,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />
        
          <Stack.Screen
            name="SignInScreen"
            component={SignInScreen}
            options={({ route }) => ({
              headerShown: false,
              animation: 'none',
              animationDuration: 1000,
              gestureEnabled: false,
              // gestureEnabled: false
              // tabBarVisible: screensWithTabs.includes(route.name),
            })}
          />
        
        <Stack.Screen
          name="CreateAccountScreen"
          component={CreateAccountScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            animationDuration: 1000,
            gestureEnabled: false,
            
            

            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />


        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            animationDuration: 1000,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />

   
        

        <Stack.Screen
          name="PinMarkerScreen"
          component={PinMarkerScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            animationDuration: 1000,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />
       
        <Stack.Screen
          name="ShowDetailsScreen"
          component={ShowDetailsScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            animationDuration: 1000,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />

<Stack.Screen
          name="EditPostScreen"
          component={EditPostScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'none',
            animationDuration: 1000,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />
        <Stack.Screen
          name="ShowImageDetailsScreen"
          component={ShowImageDetailsScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'fade_from_bottom',
            animationDuration: 500,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />
        <Stack.Screen
          name="FilterScreen"
          component={FilterScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'fade_from_bottom',
            animationDuration: 500,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={({ route }) => ({
            headerShown: false,
            animation: 'fade_from_bottom',
            animationDuration: 500,
            gestureEnabled: false,
            // tabBarVisible: screensWithTabs.includes(route.name),
          })}
        />
    
    </> )
    
        }
    
          
          
          
      </Stack.Navigator>
      </AuthContext.Provider>
      </PinMarkerContext.Provider>
       </NewFavoriteContext.Provider>
       </NewPostContext.Provider>
       </EditPostContext.Provider>
       </ShowImageDetailsContext.Provider>
       </FilteredPostContext.Provider>
       </FilteredOpenContext.Provider>
       </FilteredAvailableSpacesContext.Provider>
       </FilteredAmenitiesContext.Provider>
       </FilteredNameContext.Provider>
       </ThemeContext.Provider>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});





export default App;

    
      
      
    
  

