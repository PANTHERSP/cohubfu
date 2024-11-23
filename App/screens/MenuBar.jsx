import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const MenuBar = ({ navigation }) => {
  const handleMenuItemPress = (routeName) => {
    navigation.navigate(routeName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => handleMenuItemPress('Home')}>
        <Text style={styles.menuItemText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => handleMenuItemPress('Map')}>
        <Text style={styles.menuItemText}>About</Text>
      </TouchableOpacity>
      {/* Add more menu items as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 50,
    elevation: 2,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MenuBar;
