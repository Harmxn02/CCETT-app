import { Image, StyleSheet, Platform, View, TouchableOpacity, Text, PanResponder, Animated } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useRef } from 'react';

// import Video from 'react-native-video';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';

export default function HomeScreen() {
  const [triggeredPin, setTriggeredPin] = useState<number | null>(null);

  // Floorplan image (replace with real-time footage later)
  const floorplanImage = require('@/assets/images/apartment-floor-plan-with-furnit.webp');

  // Pins for the floorplan with initial positions
  let initialPins = []

  if (Platform.OS === 'web') {
    initialPins = [
      { id: 1, x: -220, y: 190, name: 'Camera 1 (Image)' },
      { id: 2, x: 150, y: 235, name: 'Camera 2 (Video)' },
      { id: 3, x: 55, y: 320, name: 'Camera 3 (Livestream)' },
    ];
  } else {
    initialPins = [
      { id: 1, x: -120, y: 235, name: 'Camera 1 (Image)' },
      { id: 2, x: 90, y: 255, name: 'Camera 2 (Video)' },
      { id: 3, x: 25, y: 305, name: 'Camera 3 (Livestream)' },
    ];
  }

  const [pins, setPins] = useState(
    initialPins.map((pin) => ({
      ...pin,
      position: new Animated.ValueXY({ x: pin.x, y: pin.y }),
    }))
  );

  const handleNotificationClick = (pinId: number) => {
    setTriggeredPin(pinId);
  };

  const createPanResponder = (pinId: number) => {
    const pin = pins.find((p) => p.id === pinId);
  
    if (!pin) {
      console.warn(`Pin with ID ${pinId} not found.`);
      return PanResponder.create({}); // Return a default PanResponder
    }
  
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (pin) {
          pin.position.setValue({
            x: (pin?.x ?? 0) + gesture.dx,
            y: (pin?.y ?? 0) + gesture.dy,
          });
        }
      },
      onPanResponderRelease: (_, gesture) => {
        // Update the pin's final x and y values in the pins array
        setPins((prevPins) =>
          prevPins.map((p) =>
            p.id === pinId
              ? {
                  ...p,
                  x: (pin?.x ?? 0) + gesture.dx,
                  y: (pin?.y ?? 0) + gesture.dy,
                }
              : p
          )
        );
      },
    });
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
          <Animated.View
            key={pin.id}
            style={[
              styles.pin,
              {
                transform: pin.position.getTranslateTransform(),
                backgroundColor: triggeredPin === pin.id ? 'red' : 'blue',
              },
            ]}
            {...createPanResponder(pin.id).panHandlers}>
              {/* Temporarily disabled due to the images becoming draggable after certain events */}
            {/* <Text style={styles.pinText} selectable={false}>{triggeredPin === pin.id ? '⚠️' : '📍'}</Text> */}
          </Animated.View>
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
            <Text style={styles.notificationText}>Alert for {pin.name}</Text>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Triggered Pin Video Section */}
      {triggeredPin && (
        <ThemedView style={styles.videoSection}>
          <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
            Live Video for {pins.find((p) => p.id === triggeredPin)?.name}
          </ThemedText>

          {triggeredPin === 1 && (
            <View style={styles.videoPlaceholder}>
              <Image source={require('@/assets/images/camera1.jpg')} style={styles.videoImage} />
            </View>
          )}

          {triggeredPin === 2 && (
            <View style={styles.videoPlaceholder}>
              <Video
                source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
                style={styles.videoPlayer}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                isMuted
                shouldPlay
              />
            </View>
          )}

          {triggeredPin === 3 && (
            <View style={styles.videoPlaceholder}>
              {Platform.OS === 'web' ? (
                <iframe
                  title="Livestream"
                  width="100%"
                  height="500"
                  src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1"
                  // src="https://ccett-pi5.hungwevision.com/py/mjpeg"      // Tobias' livestream
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <WebView
                  source={{
                    uri: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1',
                    // uri: 'https://ccett-pi5.hungwevision.com/py/mjpeg',      // Tobias' livestream
                  }}
                  style={styles.webView}
                  allowsInlineMediaPlayback
                  javaScriptEnabled
                  domStorageEnabled
                />
              )}
            </View>
          )}
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
    height: 600,
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
    height: 500,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  videoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#000',
    flex: 1,
  },
  webView: {
    width: '100%',
    height: 500,
    borderRadius: 8,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
});
