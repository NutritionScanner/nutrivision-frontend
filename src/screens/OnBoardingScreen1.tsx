// src/screens/OnboardingScreen1.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const OnboardingScreen1 = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/track_meals.png')} style={styles.image} />
      <Text style={styles.title}>Track Your Meals</Text>
      <Text style={styles.description}>
        Easily log your daily meals and keep track of your nutritional intake.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default OnboardingScreen1;
