import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions, Animated } from 'react-native';
import * as Location from 'expo-location';
import { calculateQiblaBearing } from '../utils/QiblaMath';
import { CompassDial, KaabaIndicator } from '../components/CompassVectors';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Throttle state for text to prevent UI lag
  const [headingText, setHeadingText] = useState(0);
  const lastTextUpdate = useRef(0);
  
  // Native animated value for silky smooth 60fps rotation
  const headingAnim = useRef(new Animated.Value(0)).current;
  const [qiblaBearing, setQiblaBearing] = useState(0);

  useEffect(() => {
    let headingSub;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Start watching compass heading
      headingSub = await Location.watchHeadingAsync((data) => {
        const newHeading = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
        if (newHeading >= 0) {
          // Update rotation immediately in native thread (0 UI lag)
          headingAnim.setValue(newHeading);

          // Update text independently (throttled to 250ms interval max)
          const now = Date.now();
          if (now - lastTextUpdate.current > 250) {
            setHeadingText(Math.round(newHeading));
            lastTextUpdate.current = now;
          }
        }
      });

      // Also get current position to calculate Qibla
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      const bearing = calculateQiblaBearing(loc.coords.latitude, loc.coords.longitude);
      setQiblaBearing(bearing);
    })();

    return () => {
      if (headingSub) {
        headingSub.remove();
      }
    };
  }, []);

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Locating & Calibrating...</Text>
          </>
        )}
      </View>
    );
  }

  // Interpolate heading into exact CSS-style rotation degrees
  const compassRotation = headingAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '-360deg']
  });
  
  const kaabaRotation = headingAnim.interpolate({
    inputRange: [0, 360],
    outputRange: [`${qiblaBearing}deg`, `${qiblaBearing - 360}deg`]
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Qibla Compass</Text>
        <Text style={styles.subtitle}>
          Your Location: {location.coords.latitude.toFixed(2)}°, {location.coords.longitude.toFixed(2)}°
        </Text>
        <Text style={styles.subtitle}>
          Qibla: {Math.round(qiblaBearing)}° | Heading: {headingText}°
        </Text>
      </View>

      <View style={styles.compassContainer}>
        {/* The rotating beautiful SVG Compass Dial */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.layer, { transform: [{ rotate: compassRotation }] }]}>
          <CompassDial size={width * 0.85} />
        </Animated.View>
        
        {/* The vector Kaaba and glowing pointer */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.layer, { transform: [{ rotate: kaabaRotation }] }]}>
          <KaabaIndicator size={width * 0.85} />
        </Animated.View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.instructionText}>
          Point the top of your phone forward. The arrow points to Makkah.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A251C',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A251C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 20,
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '600',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    padding: 20,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#A9DFBF',
    marginBottom: 5,
  },
  compassContainer: {
    width: width * 0.85,
    height: width * 0.85,
    position: 'relative',
  },
  layer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  instructionText: {
    color: '#A9DFBF',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
});
