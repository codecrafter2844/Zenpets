import { Image } from 'expo-image';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';

export default function HomeScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate loading bar for 5 seconds
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      // Navigate after loading completes
      router.replace('/(tabs)/explore');
    });
  }, []);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('../../assets/images/bg.jpg')}
        style={styles.background}
        contentFit="cover"
      />

      <View style={styles.content}>
        {/* App Title */}
        <ThemedText type="title" style={styles.title}>
          ZenPets 🐾
        </ThemedText>

        {/* Loading Bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[styles.progressBar, { width: widthInterpolated }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    color: '#000', // Black ZenPets text
    marginBottom: 30,
  },

  progressContainer: {
    width: '70%',
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#fbff00', // loading bar color
  },
});
