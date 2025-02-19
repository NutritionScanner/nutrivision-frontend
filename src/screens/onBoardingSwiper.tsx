import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the navigation type
type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
};

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

const OnboardingSwiper: React.FC<Props> = ({ navigation }) => {
  return (
    <Onboarding
      onSkip={() => navigation.replace('Login')}
      onDone={() => navigation.replace('Login')}
      bottomBarHighlight={false} 
      pages={[
        {
          backgroundColor: '#FFFBF5',
          image: <Image source={require('../../assets/track_meals.png')} style={styles.image} />,
          title: 'Track Your Meals',
          subtitle: 'Easily log your daily meals and keep track of your nutritional intake.',
        },
        {
          backgroundColor: '#FFF5E1',
          image: <Image source={require('../../assets/scan_barcode.jpeg')} style={styles.image} />,
          title: 'Scan Barcodes',
          subtitle: 'Quickly add food items by scanning barcodes with your camera.',
        },
        {
          backgroundColor: '#E5F7E1',
          image: <Image source={require('../../assets/monitor_progress.png')} style={styles.image} />,
          title: 'Monitor Your Progress',
          subtitle: 'Visualize your nutrition trends and achieve your health goals.',
        },
      ]}
      nextLabel={<Text style={styles.nextButton}>Next</Text>}
      skipLabel={<Text style={styles.skipButton}>Skip</Text>}
      DoneButtonComponent={() => (
        <TouchableOpacity style={styles.doneButton} onPress={() => navigation.replace('Login')}>
          <Text style={styles.doneButtonText}>Get Started</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  nextButton: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  skipButton: {
    fontSize: 16,
    color: '#777',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  doneButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OnboardingSwiper;
