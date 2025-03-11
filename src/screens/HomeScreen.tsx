import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons'; // <button class="citation-flag" data-index="6"><button class="citation-flag" data-index="7"><button class="citation-flag" data-index="8">
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Circle } from 'react-native-svg';
import { ScrollView } from 'react-native';

interface CircularProgressProps {
  value: number;
  maxValue: number;
  title: string;
}

const CircularProgress = ({ value, maxValue, title }: CircularProgressProps) => {
  const progress = (value / maxValue) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.progressContainer}>
      <Svg height="100" width="100" viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#e0e0e0"
          strokeWidth="8"
          fill="transparent"
        />
        <Circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#4CAF50"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.progressText}>{value}/{maxValue}</Text>
      <Text style={styles.progressTitle}>{title}</Text>
    </View>
  );
};

// Dynamic Greeting Function
const getDynamicGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 17) {
    return 'Good Afternoon';
  } else if (currentHour >= 17 && currentHour < 21) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
};

type RootStackParamList = {
  Home: undefined;
  BarcodeScanner: undefined;
  FoodDetection: undefined;
  FruitVegetableDetection: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {

  return (
    <ScrollView 
    style={{ flex: 1 }} 
    contentContainerStyle={styles.scrollContainer} // <button class="citation-flag" data-index="6"><button class="citation-flag" data-index="7">
    >
    <LinearGradient 
      colors={['#4CAF50', '#8BC34A']} 
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header with vector icons */}
      <View style={styles.header}>
        {/* <View>
          <Text style={styles.greeting}>Good Morning!</Text>
          <Text style={styles.appName}>NutriVision</Text>
        </View> */}
        {/* <TouchableOpacity style={styles.profile}>
          <Icon name="person-circle-outline" size={50} color="white" />
        </TouchableOpacity> */}
      </View>

      {/* Feature Cards */}
      <View style={styles.cardsContainer}>
        {/* Barcode Scanner Card */}
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('BarcodeScanner')}
          activeOpacity={0.8}
        >
          <Icon name="barcode-outline" size={60} color="#4CAF50" />
          <Text style={styles.cardTitle}>Scan Barcode</Text>
          <Text style={styles.cardDesc}>Instant nutritional info</Text>
          <Icon 
            name="chevron-forward-outline" 
            size={24} 
            color="#4CAF50" 
            style={styles.cardChevron}
          />
        </TouchableOpacity>

        {/* 2. Food Detection <button class="citation-flag" data-index="3"><button class="citation-flag" data-index="5"> */}
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('FoodDetection')}
        >
          <Icon name="fast-food-outline" size={60} color="#4CAF50" />
          <Text style={styles.cardTitle}>Detect Food</Text>
          <Text style={styles.cardDesc}>AI-powered meal analysis</Text>
          <Icon 
            name="chevron-forward-outline" 
            size={24} 
            color="#4CAF50" 
            style={styles.cardChevron}
          />
        </TouchableOpacity>

        {/* 3. Fruit/Vegetable Detection <button class="citation-flag" data-index="4"><button class="citation-flag" data-index="6"> */}
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('FruitVegetableDetection')}
        >
          <Icon name="leaf-outline" size={60} color="#4CAF50" />
          <Text style={styles.cardTitle}>Fruits/Vegetable </Text>
          <Text style={styles.cardDesc}>Get nutrition value of them</Text>
          <Icon 
            name="chevron-forward-outline" 
            size={24} 
            color="#4CAF50" 
            style={styles.cardChevron}
          />
        </TouchableOpacity>

        {/* Add other feature cards here */}
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Daily Progress</Text>
        <View style={styles.progressCards}>
          <CircularProgress 
            value={1500} 
            maxValue={2000} 
            title="Calories"
          />
          <CircularProgress 
            value={3} 
            maxValue={8} 
            title="Water"
          />
        </View>
      </View>
    </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Add space at bottom <button class="citation-flag" data-index="7">
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    color: 'white',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  cardsContainer: {
    marginBottom: 30,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  cardChevron: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -12,
  },
  progressSection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    marginBottom: 20,
  },
  progressCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  progressTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
});

export default HomeScreen;