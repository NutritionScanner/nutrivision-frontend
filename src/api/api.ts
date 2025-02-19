// src/api/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://192.168.181.148:8000'; 


export const fetchNutritionData = async (barcode: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/nutrition/${barcode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    throw error;
  }
};

export const detectFoodItem = async (file: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/food-detection/food-item`, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error detecting food item:', error);
    throw error;
  }
};

export const detectFruitVegetable = async (file: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/food-detection/fruit-vegetable`, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error detecting fruit/vegetable:', error);
    throw error;
  }
};