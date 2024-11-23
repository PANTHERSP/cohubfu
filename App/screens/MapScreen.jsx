import React, { useState } from 'react';
import { TouchableHighlight, Dimensions, Image, View, Text, TextInput, Button, StyleSheet, ImageBackground, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const MapScreen = ({navigation}) => {

  const [markerCoordinate, setMarkerCoordinate] = useState({latitude: 13.7271388889, longitude: 100.765611111});
    
  return (
        
            <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={(Event) => {
          const {coordinate} = Event.nativeEvent;
          setMarkerCoordinate(coordinate);
        }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 13.7271388889,
          longitude: 100.765611111,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={markerCoordinate}
          title="Marker Title"
          description="Marker Description"
          
        />
      </MapView>
    </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
  });

export default MapScreen;