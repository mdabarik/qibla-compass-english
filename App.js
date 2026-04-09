import React, { useState, useRef } from 'react';
import {
  BackHandler,
  Platform,
  Alert,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import AboutScreen from './src/screens/AboutScreen';

import 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setDrawerOpen(false));
  };

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    closeDrawer();
  };

  const handleExit = () => {
    closeDrawer();
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      Alert.alert('Exit App', 'To exit, press the home button on your device.');
    }
  };

  const getTitle = () => {
    switch (currentScreen) {
      case 'Home': return 'Qibla Compass';
      case 'About': return 'About';
      default: return 'Qibla Compass';
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home': return <HomeScreen />;
      case 'About': return <AboutScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0A251C" />
      <View style={styles.root}>
        {/* Header */}
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{getTitle()}</Text>
            <View style={styles.menuButton} />
          </View>
        </SafeAreaView>

        {/* Screen Content */}
        <View style={styles.content}>
          {renderScreen()}
        </View>

        {/* Overlay */}
        {drawerOpen && (
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeDrawer}
          >
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                styles.overlay,
                { opacity: overlayAnim },
              ]}
            />
          </TouchableOpacity>
        )}

        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            { transform: [{ translateX: drawerAnim }] },
          ]}
        >
          <SafeAreaView edges={['top']} style={{ flex: 1 }}>
            <View style={styles.drawerHeader}>
              <Image source={require('./assets/icon.png')} style={styles.drawerLogo} />
              <Text style={styles.drawerTitle}>Qibla Compass</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.drawerItem,
                currentScreen === 'Home' && styles.drawerItemActive,
              ]}
              onPress={() => navigateTo('Home')}
            >
              <Text
                style={[
                  styles.drawerItemText,
                  currentScreen === 'Home' && styles.drawerItemTextActive,
                ]}
              >
                🏠  Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.drawerItem,
                currentScreen === 'About' && styles.drawerItemActive,
              ]}
              onPress={() => navigateTo('About')}
            >
              <Text
                style={[
                  styles.drawerItemText,
                  currentScreen === 'About' && styles.drawerItemTextActive,
                ]}
              >
                ℹ️  About
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem} onPress={handleExit}>
              <Text style={[styles.drawerItemText, { color: '#FF6B6B' }]}>
                🚪  Exit
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Animated.View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A251C',
  },
  headerSafeArea: {
    backgroundColor: '#0A251C',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#0A251C',
    borderBottomWidth: 1,
    borderBottomColor: '#123D2E',
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 26,
    color: '#FFD700',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  content: {
    flex: 1,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#051811',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  drawerHeader: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#123D2E',
    marginBottom: 10,
  },
  drawerLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 12,
  },
  drawerTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
  },
  drawerItem: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 2,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  drawerItemText: {
    fontSize: 17,
    color: '#A9DFBF',
    fontWeight: '500',
  },
  drawerItemTextActive: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});
