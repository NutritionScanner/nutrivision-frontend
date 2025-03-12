import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  AgeSelection: undefined;
  HeightSelection: { age: number };
};

type AgeSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AgeSelection"
>;

const AgeSelectionScreen = () => {
  const navigation = useNavigation<AgeSelectionScreenNavigationProp>();
  const [age, setAge] = useState<string>("");

  const handleConfirm = () => {
    if (age && !isNaN(Number(age))) {
      navigation.navigate("HeightSelection", { age: Number(age) });
    }
  };

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

      {/* Title */}
      <Text style={styles.title}>What is your Age?</Text>

      {/* Age Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        placeholderTextColor="gray"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      {/* Confirm Button */}
      <TouchableOpacity
        disabled={!age || isNaN(Number(age))}
        onPress={handleConfirm}
        style={[
          styles.confirmButton,
          { backgroundColor: age && !isNaN(Number(age)) ? "black" : "gray" },
        ]}
      >
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 15 },
  topRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  progressBar: {
    height: 16,
    backgroundColor: "lightgray",
    flex: 1,
    borderRadius: 8,
    marginLeft: 15,
    justifyContent: "center",
  },
  progress: {
    width: "35%", // 40% progress indicates we're on the Age Selection step
    height: "100%",
    backgroundColor: "black",
    borderRadius: 8,
  },
  backButton: {
    width: 27,
    height: 30,
    borderRadius: 17,
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
  input: {
    marginTop: 40,
    marginHorizontal: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    fontSize: 18,
    color: "black",
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

export default AgeSelectionScreen;
