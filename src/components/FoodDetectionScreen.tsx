// src/components/FoodDetectionScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { detectFoodItem } from '../api/api';

const FoodDetectionScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      handleImageUpload(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      handleImageUpload(result.assets[0].uri);
    }
  };

  const handleImageUpload = async (uri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    setLoading(true);
    try {
      const data = await detectFoodItem(formData);
      setNutritionData(data);
    } catch (error) {
      Alert.alert('Error', 'Unable to detect food item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Food Detection</Text>

      <View style={styles.buttonContainer}>
        <Button title="Pick an image from camera roll" onPress={pickImage} color="#4CAF50" />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Take a photo" onPress={takePhoto} color="#2196F3" />
      </View>

      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      )}

      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}

      {nutritionData && !loading && (
        <View style={styles.nutritionContainer}>
          <Text style={styles.nutritionTitle}>Nutrition Data for {nutritionData.food_item}:</Text>
          <Text style={styles.nutritionText}>Calories: {nutritionData.calories} kcal</Text>
          <Text style={styles.nutritionText}>Protein: {nutritionData.protein}g</Text>
          <Text style={styles.nutritionText}>Carbohydrates: {nutritionData.carbohydrates}g</Text>
          <Text style={styles.nutritionText}>Fats: {nutritionData.fats}g</Text>
          <Text style={styles.nutritionText}>Fiber: {nutritionData.fiber}g</Text>
          <Text style={styles.nutritionText}>Sugar: {nutritionData.sugar}g</Text>
          <Text style={styles.nutritionText}>Health Rating: {nutritionData.health_rating}</Text>
          <Text style={styles.nutritionSummary}>Summary: {nutritionData.summary}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
    borderRadius: 10,
  },
  imageContainer: {
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  nutritionContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  nutritionText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#555',
  },
  nutritionSummary: {
    fontSize: 14,
    marginTop: 10,
    fontStyle: 'italic',
    color: '#888',
  },
});

export default FoodDetectionScreen;
