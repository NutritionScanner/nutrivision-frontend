import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { StackNavigationProp } from "@react-navigation/stack";
import Lottie from "lottie-react-native";

import barcodeAnimation from "../../assets/animations/barcodeSecond.json";
import mealsAnimation from "../../assets/animations/trackYourMeals.json";
import progressAnimation from "../../assets/animations/monitorYourProgress.json";

// Define the navigation type
type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
};

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

const OnboardingSwiper: React.FC<Props> = ({ navigation }) => {
  return (
    <Onboarding
      onSkip={() => navigation.replace("Login")}
      onDone={() => navigation.replace("Login")}
      bottomBarHighlight={false}
      pages={[
        {
          backgroundColor: "white",
          image: (
            <View
              style={{
                height: 100,
                width: 100,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 40,
              }}
            >
              <Lottie
                source={mealsAnimation}
                autoPlay
                style={{
                  width: 80,
                  height: 80,
                  transform: [
                    {
                      scale: 3,
                    },
                  ],
                }}
              />
            </View>
          ),
          title: "Track Your Meals",
          subtitle:
            "Easily log your daily meals and keep track of your nutritional intake.",
        },
        {
          backgroundColor: "white",
          image: (
            <View
              style={{
                height: 100,
                width: 100,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 40,
              }}
            >
              <Lottie
                source={barcodeAnimation}
                autoPlay
                style={{
                  width: 80,
                  height: 80,
                  transform: [
                    {
                      scale: 2.8,
                    },
                  ],
                }}
              />
            </View>
          ),
          title: "Scan Barcodes",
          subtitle:
            "Quickly add food items by scanning barcodes with your camera.",
        },
        {
          backgroundColor: "white",
          image: (
            <View
              style={{
                height: 100,
                width: 100,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 40,
              }}
            >
              <Lottie
                source={progressAnimation}
                autoPlay
                style={{
                  width: 80,
                  height: 80,
                  transform: [
                    {
                      scale: 3,
                    },
                  ],
                }}
              />
            </View>
          ),
          title: "Monitor Your Progress",
          subtitle:
            "Visualize your nutrition trends and achieve your health goals.",
        },
      ]}
      nextLabel={
        <View>
          <Text style={styles.nextButton}>Next</Text>
        </View>
      }
      skipLabel={
        <View style={{}}>
          <Text style={styles.skipButton}>Skip</Text>
        </View>
      }
      DoneButtonComponent={() => (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.replace("Login")}
        >
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
    resizeMode: "contain",
  },
  nextButton: {
    fontSize: 18,
    color: "black",
    fontWeight: "500",
    marginRight: 14,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  skipButton: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginLeft: 10,
  },

  doneButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 13,
  },
  doneButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "500",
  },
});

export default OnboardingSwiper;
