// src/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

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
  // This is the important part - match the expected props
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

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InitialOnboarding">
        <Stack.Screen
          name="InitialOnboarding"
          component={InitialOnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GenderSelection"
          component={GenderSelectionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AgeSelection"
          component={AgeSelectionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HeightSelection"
          component={HeightSelectionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CurrentWeight"
          component={CurrentWeightScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GoalWeight"
          component={GoalWeightScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WeightChangeSpeed"
          component={WeightChangeSpeedScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
        name="SummaryScreen"
        component={SummaryScreen}
        options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingSwiper}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "Login",
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            title: "Signup",
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Home",
            headerLeft: () => null,
          }}
        />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
        <Stack.Screen name="FoodDetection" component={FoodDetectionScreen} />
        <Stack.Screen
          name="FruitVegetableDetection"
          component={FruitVegetableDetectionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
