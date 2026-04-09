import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>About Qibla Compass</Text>
      <Text style={styles.description}>
        This application uses your device's sensors and location to calculate the shortest path towards the Kaaba in Makkah, Saudi Arabia. 
      </Text>
      <Text style={styles.version}>Version 1.0.0 (Expo SDK 54)</Text>
      <View style={styles.credits}>
        <Text style={styles.creditsText}>Designed with elegance and care.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A251C',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 30, // For a rounded icon look
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#A9DFBF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  version: {
    fontSize: 14,
    color: '#769C89',
    marginBottom: 10,
  },
  credits: {
    position: 'absolute',
    bottom: 40,
  },
  creditsText: {
    color: '#A9DFBF',
    fontStyle: 'italic',
  },
});
