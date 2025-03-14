import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  Summary: {
    speed: number;
    goalType: string;
    goalWeight: number;
    currentWeight: number;
  };
  GoalWeight: undefined;
  Home:undefined;
  Signup:undefined;
};

type SummaryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Summary"
>;

const SummaryScreen = () => {
  const navigation = useNavigation<SummaryScreenNavigationProp>();
  const route = useRoute();
  const { speed, goalType, goalWeight, currentWeight } = route.params as {
    speed: number;
    goalType: string;
    goalWeight: number;
    currentWeight: number;
  };

  const weightDifference = Math.abs(goalWeight - currentWeight);

  return (
    <View style={styles.container}>
      {/* Top Row */}
      <View style={styles.topRowContainer}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>&lt;</Text>
        </TouchableOpacity>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={styles.progress} />
          </View>
        </View>
      </View>

      {/* Medal Image */}
      <Image source={require("../../assets/medal.png")} style={styles.badge} />

      {/* Motivational Message */}
      <Text style={styles.motivationText}>You Got This! 💪</Text>

      <Text style={styles.descriptionText}>
        We'll help you {goalType} {weightDifference} kg at a pace of {speed}{" "}
        kg/week. With some discipline, this is{" "}
        <Text style={styles.boldText}>realistic and sustainable</Text>—a goal
        you can absolutely achieve.
      </Text>

      <Text style={styles.smallStepsText}>
        Small steps lead to big changes.
      </Text>

      {/* Continue Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
        style={styles.continueButton}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  topRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
  },
  progressBarContainer: {
    flex: 1,
    marginLeft: 15,
  },
  progressBarBackground: {
    height: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
  },
  progress: {
    width: "100%", // Updated to 100% completion
    height: "100%",
    backgroundColor: "black",
    borderRadius: 8,
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    color: "white",
    fontSize: 20,
    marginLeft: -2,
    marginTop: -2,
  },
  badge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  motivationText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 20,
  },
  boldText: {
    fontWeight: "bold",
  },
  smallStepsText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 40,
  },
  continueText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default SummaryScreen;
