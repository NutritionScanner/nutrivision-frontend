import axios from "axios";

const API_URL = "http://your-backend-url:5000/api";

export const saveUserToDatabase = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error("Error saving user to database:", error);
    throw error;
  }
};

export const getUserFromDatabase = async (firebaseUid) => {
  try {
    const response = await axios.get(`${API_URL}/users/${firebaseUid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user from database:", error);
    throw error;
  }
};

export const updateUserInDatabase = async (firebaseUid, userData) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${firebaseUid}`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user in database:", error);
    throw error;
  }
};
