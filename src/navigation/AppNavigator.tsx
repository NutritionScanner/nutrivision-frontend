// src/navigation/AppNavigator.tsx
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged, User } from "firebase/auth";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { auth } from "../firebaseConfig";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import BarcodeScanner from "../components/BarcodeScanner";
import FoodDetectionScreen from "../components/FoodDetectionScreen";
import FruitVegetableDetectionScreen from "../components/FruitVegetableDetectionScreen";
import OnboardingSwiper from "src/screens/onBoardingSwiper";
import InitialOnboardingScreen from "../screens/InitialOnboardingScreen";
import GenderSelectionScreen from "../screens/GenderSelectionScreen";
import AgeSelectionScreen from "../screens/AgeSelectionScreen";
import HeightSelectionScreen from "../screens/HeightSelectionScreen";
import CurrentWeightScreen from "src/screens/CurrentWeightScreen";
import GoalWeightScreen from "src/screens/GoalWeightScreen";
import WeightChangeSpeedScreen from "src/screens/WeightChangeSpeedScreen";
import SummaryScreen from "src/screens/SummaryScreen";

// Define the param list for the stack navigator
type RootStackParamList = {
  InitialOnboarding: undefined;
  GenderSelection: undefined;
  AgeSelection: undefined;
  HeightSelection: undefined;
  CurrentWeight: undefined;
  GoalWeight: { currentWeight: number };
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  BarcodeScanner: undefined;
  FoodDetection: undefined;
  FruitVegetableDetection: undefined;
  WeightChangeSpeed: {
    currentWeight: number;
    goalWeight: number;
    goalType: string;
  };
  SummaryScreen: {
    speed: number;
    goalWeight: number;
    goalType: string;
    currentWeight: number;
  };
};

// Pass the RootStackParamList to createStackNavigator
const Stack = createStackNavigator<RootStackParamList>();

// Loading component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#333" />
  </View>
);

const AppNavigator = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        "Auth state changed:",
        user ? "User logged in" : "User logged out"
      );
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  // Show loading screen while checking authentication state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={user ? "Home" : "InitialOnboarding"}
      >
        {user ? (
          // Authenticated user screens
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
            <Stack.Screen
              name="FoodDetection"
              component={FoodDetectionScreen}
            />
            <Stack.Screen
              name="FruitVegetableDetection"
              component={FruitVegetableDetectionScreen}
            />
          </>
        ) : (
          // Non-authenticated user screens
          <>
            <Stack.Screen
              name="InitialOnboarding"
              component={InitialOnboardingScreen}
            />
            <Stack.Screen
              name="GenderSelection"
              component={GenderSelectionScreen}
            />
            <Stack.Screen name="AgeSelection" component={AgeSelectionScreen} />
            <Stack.Screen
              name="HeightSelection"
              component={HeightSelectionScreen}
            />
            <Stack.Screen
              name="CurrentWeight"
              component={CurrentWeightScreen}
            />
            <Stack.Screen name="GoalWeight" component={GoalWeightScreen} />
            <Stack.Screen
              name="WeightChangeSpeed"
              component={WeightChangeSpeedScreen}
            />
            <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingSwiper} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default AppNavigator;
