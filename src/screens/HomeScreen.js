import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { calculateQiblaBearing } from '../utils/QiblaMath';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [heading, setHeading] = useState(0);
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
          setHeading(Math.round(newHeading));
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

  // The compass rose points to North. We rotate it by -heading.
  const compassRoseRotation = -heading;
  
  // The Kaaba pointer. It should point towards the Qibla.
  // Since we also want it to rotate relative to the phone, we subtract the heading.
  const kaabaRotation = qiblaBearing - heading;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Qibla Compass</Text>
        <Text style={styles.subtitle}>
          Your Location: {location.coords.latitude.toFixed(2)}°, {location.coords.longitude.toFixed(2)}°
        </Text>
        <Text style={styles.subtitle}>
          Qibla: {Math.round(qiblaBearing)}° | Heading: {heading}°
        </Text>
      </View>

      <View style={styles.compassContainer}>
        {/* Draw a subtle ring for the compass */}
        <View style={styles.staticRing} />
        
        {/* The Kaaba image rotating as pointer */}
        <AnimatedKaaba rotation={kaabaRotation} />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.instructionText}>
          Point the top of your phone forward. The icon points to Makkah.
        </Text>
      </View>
    </View>
  );
}

const AnimatedKaaba = ({ rotation }) => {
  return (
    <View
      style={[
        styles.pointerWrapper,
        { transform: [{ rotate: `${rotation}deg` }] },
      ]}
    >
      {/* Arrow pointing up */}
      <View style={styles.arrowContainer}>
        {/* Triangle head */}
        <View style={styles.arrowHead} />
        {/* Arrow line/stick */}
        <View style={styles.arrowLine} />
      </View>

      {/* Kaaba image */}
      <Image
        source={require('../../assets/kaaba.png')}
        style={styles.kaabaImage}
        resizeMode="contain"
      />
    </View>
  );
};

const COMPASS_SIZE = width * 0.85;
const KAABA_SIZE = width * 0.35;

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
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  staticRing: {
    position: 'absolute',
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 6,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  pointerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 28,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFD700',
  },
  arrowLine: {
    width: 6,
    height: 40,
    backgroundColor: '#FFD700',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  kaabaImage: {
    width: KAABA_SIZE,
    height: KAABA_SIZE,
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
