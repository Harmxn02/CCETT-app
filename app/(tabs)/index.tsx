import { Image, StyleSheet, Platform, View, TouchableOpacity, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';

export default function HomeScreen() {
  const [triggeredPin, setTriggeredPin] = useState<number | null>(null);

  // Floorplan image (replace with real time footage later)
  const floorplanImage = require('@/assets/images/floorplan.jpg');

  // Pins for the floorplan
  const pins = [
    { id: 1, x: 500, y: 150, name: 'Camera 1' },
    { id: 2, x: 800, y: 250, name: 'Camera 2' },
  ];

  const handleNotificationClick = (pinId: number) => {
    setTriggeredPin(pinId);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Floorplan Viewer */}
      <ThemedView style={styles.floorplanContainer}>
        <Image source={floorplanImage} style={styles.floorplanImage} />
        {pins.map((pin) => (
          <TouchableOpacity
            key={pin.id}
            style={[
              styles.pin,
              {
                left: pin.x,
                top: pin.y,
                backgroundColor: triggeredPin === pin.id ? 'red' : 'blue',
              },
            ]}
            onPress={() => alert(`You clicked on ${pin.name}`)}>
            <Text style={styles.pinText}>{triggeredPin === pin.id ? '⚠️' : '📍'}</Text>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Notifications */}
      <ThemedView style={styles.notifications}>
        <ThemedText type="subtitle">Notifications</ThemedText>
        {pins.map((pin) => (
          <TouchableOpacity
            key={pin.id}
            style={styles.notificationButton}
            onPress={() => handleNotificationClick(pin.id)}>
            <Text style={styles.notificationText}>{pin.name} Alert</Text>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Triggered Pin Video Section */}
      {triggeredPin && (
        <ThemedView style={styles.videoSection}>
          <ThemedText type="subtitle">
            Live Video for {pins.find((p) => p.id === triggeredPin)?.name}
          </ThemedText>
          {/* Replace with your video player or component */}
          <View style={styles.videoPlaceholder}>
            <Text style={{ color: '#fff' }}>Video Placeholder</Text>
          </View>
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  floorplanContainer: {
    position: 'relative',
    marginVertical: 16,
    alignItems: 'center',
  },
  floorplanImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  pin: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinText: {
    color: '#fff',
    fontSize: 18,
  },
  notifications: {
    marginVertical: 16,
  },
  notificationButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  notificationText: {
    color: '#fff',
    fontSize: 16,
  },
  videoSection: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
