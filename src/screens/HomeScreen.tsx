import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack'; // Import the navigation prop type

// Define the type for your stack navigator
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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NutriVision🍏</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('BarcodeScanner')}
        >
          <Ionicons name="qr-code-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Scan Barcode</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('FoodDetection')}
        >
          <Ionicons name="fast-food-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Detect Food Item</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('FruitVegetableDetection')}
        >
          <Ionicons name="leaf-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Detect Fruit/Vegetable</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 10,
  },
});

export default HomeScreen;
