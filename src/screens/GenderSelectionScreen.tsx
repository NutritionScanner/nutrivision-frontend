import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  GenderSelection: undefined;
  AgeSelection: undefined;
};

type GenderSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "GenderSelection"
>;

const GenderSelectionScreen = () => {
  const navigation = useNavigation<GenderSelectionScreenNavigationProp>();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

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
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>
      </View>

      {/* Title - Centered with padding */}
      <Text style={styles.title}>What is your Gender?</Text>

      {/* Gender Options - Added padding */}
      {["Male", "Female", "Other"].map((gender) => (
        <TouchableOpacity
          key={gender}
          onPress={() => setSelectedGender(gender)}
          style={[
            styles.genderButton,
            selectedGender === gender
              ? styles.selectedButton
              : styles.unselectedButton,
          ]}
        >
          <Text
            style={[
              styles.genderText,
              selectedGender === gender ? styles.selectedText : {},
            ]}
          >
            {gender}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Confirm Button - Added padding */}
      <TouchableOpacity
        disabled={!selectedGender}
        onPress={() => navigation.navigate("AgeSelection")}
        style={[
          styles.confirmButton,
          { backgroundColor: selectedGender ? "black" : "gray" },
        ]}
      >
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  topRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20, // Added marginTop to move both back button and progress bar down
    paddingHorizontal: 10,
  },
  progressBar: {
    height: 16,
    backgroundColor: "#F5F5F5",
    flex: 1,
    borderRadius: 8,
    marginLeft: 15,
    justifyContent: "center",
  },
  progress: {
    width: "20%", // Adjust based on your flow's progress
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
    fontSize: 24,
    marginLeft: -2,
    marginTop: -4,
  },
  title: {
    color: "black",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 140,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  genderButton: {
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginHorizontal: 20,
  },
  selectedButton: {
    backgroundColor: "#F5F5F5",
  },
  unselectedButton: {
    backgroundColor: "white",
  },
  genderText: {
    color: "black",
    fontSize: 18,
  },
  selectedText: {
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 40,
    padding: 20,
    borderRadius: 50,
    alignItems: "center",
    marginHorizontal: 20,
  },
  confirmText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GenderSelectionScreen;
