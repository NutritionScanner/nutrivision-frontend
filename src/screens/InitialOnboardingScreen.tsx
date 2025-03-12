import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  InitialOnboarding: undefined;
  Onboarding: undefined;
  GenderSelection:undefined;
};

type InitialOnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "InitialOnboarding"
>;

const { width, height } = Dimensions.get("window");

const InitialOnboardingScreen = () => {
  const navigation = useNavigation<InitialOnboardingScreenNavigationProp>();
  const videoRef = useRef<Video | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playAsync();
    }

    // Start animations after a short delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {/* Full-screen Background Video */}
      <Video
        ref={videoRef}
        source={require("../../assets/videos/background2.mp4")}
        style={{ position: "absolute", width: "100%", height: "100%" }}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        isMuted
      />

      {/* Top Branding */}
      <View
        style={{
          position: "absolute",
          top: 40,
          left: 24,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/green_apple_bg.png")}
          style={{ width: 48, height: 48, marginTop: 10 }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 45,
            fontWeight: "900", // Maximum boldness
            fontFamily: "System", // You can also try specific fonts if available in your project
            marginTop: 15,
            marginLeft: 3,
            letterSpacing: 0.5, // Slightly increased letter spacing
            textShadowColor: "rgba(0, 0, 0, 0.3)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
        >
          NutriVision
        </Text>
      </View>

      {/* Animated Quote & Text */}
      <Animated.View
        style={{
          position: "absolute",
          top: height / 4, // Moved up from height/3 as requested
          left: 15, // Moved more to the left as requested
          width: "90%",
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text
          style={{
            color: "white",
            marginTop: 38,
            textAlign: "left",
            fontSize: 65,
            fontStyle: "italic",
            fontWeight: "bold",
            textShadowColor: "rgba(0, 0, 0, 0.5)",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 3,
          }}
        >
          Your health, Your choices, Track what Fuels you!
        </Text>
      </Animated.View>

      {/* Bottom Next Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 40,
          right: 24,
          backgroundColor: "#22c55e",
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 50,
        }}
        onPress={() => navigation.navigate("GenderSelection")}
      >
        <Text style={{ color: "black", fontSize: 24, fontWeight: "bold" }}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InitialOnboardingScreen;
