import React from 'react';
import { BackHandler, Platform, Alert, View, Image, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

import HomeScreen from './src/screens/HomeScreen';
import AboutScreen from './src/screens/AboutScreen';

import 'react-native-gesture-handler'; // Required for Drawer

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const handleExit = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      Alert.alert('Exit App', 'To exit, press the home button on your device.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#051811' }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Image source={require('./assets/icon.png')} style={styles.drawerLogo} />
          <Text style={styles.drawerTitle}>Qibla Compass</Text>
        </View>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Exit"
          labelStyle={{ color: '#FF6B6B', fontWeight: 'bold' }}
          onPress={handleExit}
        />
      </DrawerContentScrollView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0A251C',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#FFD700',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerActiveTintColor: '#FFD700',
          drawerInactiveTintColor: '#A9DFBF',
          drawerActiveBackgroundColor: 'rgba(255, 215, 0, 0.1)',
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Qibla Compass' }} />
        <Drawer.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#123D2E',
    marginBottom: 10,
  },
  drawerLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 10,
  },
  drawerTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
