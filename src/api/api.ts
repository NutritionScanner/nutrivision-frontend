// src/api/api.ts
import axios from "axios";

const API_BASE_URL = "http://192.168.1.5:8000";
const USER_API_URL = "http://your-backend-url:5000/api";
const API_BASE =
  process.env.API_BASE_URL || "https://your-render-api.onrender.com";

export const fetchNutritionData = async (barcode: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/nutrition/${barcode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    throw error;
  }
};

export const detectFoodItem = async (file: FormData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/food-detection/food-item`,
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error detecting food item:", error);
    throw error;
  }
};

export const detectFruitVegetable = async (file: FormData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/food-detection/fruit-vegetable`,
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error detecting fruit/vegetable:", error);
    throw error;
  }
};

// User API
export const saveUserToDatabase = async (userData: object) => {
  try {
    const response = await axios.post(`${USER_API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error("Error saving user to database:", error);
    throw error;
  }
};

export const getUserFromDatabase = async (firebaseUid: string) => {
  try {
    const response = await axios.get(`${USER_API_URL}/users/${firebaseUid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user from database:", error);
    throw error;
  }
};

export const updateUserInDatabase = async (
  firebaseUid: string,
  userData: object
) => {
  try {
    const response = await axios.put(
      `${USER_API_URL}/users/${firebaseUid}`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user in database:", error);
    throw error;
  }
};

export const createUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_BASE}/api/users`, userData);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};