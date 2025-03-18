import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

type RootStackParamList = {
  GoalWeight: { goalType: string; goalWeight: number; currentWeight: number };
  SummaryScreen: {
    speed: number;
    goalType: string;
    goalWeight: number;
    currentWeight: number;
  };
  WeightChangeSpeedScreen: {
    goalType: string;
    goalWeight: number;
    currentWeight: number;
  };
};

const WeightChangeSpeedScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { goalType, goalWeight, currentWeight } = route.params as {
    goalType: string;
    goalWeight: number;
    currentWeight: number;
  };

  const [speed, setSpeed] = useState<number | null>(1);
  const [modalVisible, setModalVisible] = useState(false);

  const minSpeed = 0.1;
  const maxSpeed = 3;

  const speedOptions = Array.from(
    { length: Math.round((maxSpeed - minSpeed) / 0.1) + 1 },
    (_, i) => (minSpeed + i * 0.1).toFixed(1)
  );

  // Load saved speed data when component mounts
  useEffect(() => {
    loadSavedSpeed();
  }, []);

  const loadSavedSpeed = async () => {
    try {
      const savedSpeed = await AsyncStorage.getItem("weightChangeSpeed");
      if (savedSpeed !== null) {
        setSpeed(parseFloat(savedSpeed));
        console.log("Loaded weight change speed:", savedSpeed);
      }
    } catch (error) {
      console.error("Error loading saved speed data:", error);
    }
  };

  const saveSpeedData = async (speed: number) => {
    try {
      await AsyncStorage.setItem("weightChangeSpeed", speed.toString());

      // Calculate estimated time to reach goal based on speed and weight difference
      const weightDifference = Math.abs(goalWeight - currentWeight);
      const estimatedWeeks = (weightDifference / speed).toFixed(1);
      await AsyncStorage.setItem("estimatedWeeks", estimatedWeeks);

      // Also save the speed category for reference
      const speedCategory = getSpeedCategory(speed).label;
      await AsyncStorage.setItem("speedCategory", speedCategory);

      // Log the saved data for debugging
      console.log("Saved Speed Data:");
      console.log("Weight Change Speed:", speed);
      console.log("Estimated Weeks:", estimatedWeeks);
      console.log("Speed Category:", speedCategory);

      // Retrieve previously saved data for consolidated debug output
      try {
        const goalWeight = await AsyncStorage.getItem("goalWeight");
        const goalType = await AsyncStorage.getItem("goalType");
        const weightDifference = await AsyncStorage.getItem("weightDifference");

        console.log("\nAll Saved User Data:");
        console.log("Goal Weight:", goalWeight);
        console.log("Goal Type:", goalType);
        console.log("Weight Difference:", weightDifference);
        console.log("Weight Change Speed:", speed);
        console.log("Estimated Weeks:", estimatedWeeks);
        console.log("Speed Category:", speedCategory);
      } catch (error) {
        console.error("Error retrieving consolidated data:", error);
      }
    } catch (error) {
      console.error("Error saving speed data:", error);
      Alert.alert("Error", "Failed to save your speed selection.");
    }
  };

  const handleConfirm = () => {
    if (speed !== null) {
      // Save speed data to AsyncStorage
      saveSpeedData(speed);

      // Navigate to next screen
      navigation.navigate("SummaryScreen", {
        speed,
        goalType,
        goalWeight,
        currentWeight,
      });
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const selectSpeed = (value: number) => {
    setSpeed(value);
    setModalVisible(false);
  };

  const getSpeedCategory = (speed: number) => {
    if (speed <= 0.2) return { label: "Slow & Steady", color: "green" };
    if (speed <= 0.9) return { label: "Moderate", color: "orange" }; // orange
    return { label: "Aggressive", color: "#B22222" }; // Dark Red
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRowContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>&lt;</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>
      </View>

      <Text style={styles.title}>
        How fast do you want to {goalType} the weight?
      </Text>

      <TouchableOpacity
        style={styles.selector}
        onPress={toggleModal}
        activeOpacity={0.7}
      >
        <Text style={styles.selectorText}>
          {speed ? `${speed} kg/week` : "Select speed"}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      {speed !== null && (
        <Text
          style={[
            styles.categoryText,
            { color: getSpeedCategory(speed).color },
          ]}
        >
          {getSpeedCategory(speed).label}
        </Text>
      )}

      {/* Estimated time calculation */}
      {speed !== null && (
        <Text style={styles.estimatedTime}>
          Estimated time to reach goal:{" "}
          {(Math.abs(goalWeight - currentWeight) / speed).toFixed(1)} weeks
        </Text>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleModal}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={speedOptions}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    speed === parseFloat(item) && styles.selectedOption,
                  ]}
                  onPress={() => selectSpeed(parseFloat(item))}
                >
                  <Text
                    style={[
                      styles.optionText,
                      speed === parseFloat(item) && styles.selectedOptionText,
                    ]}
                  >
                    {item} kg/week
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={true}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <TouchableOpacity
        disabled={speed === null}
        onPress={handleConfirm}
        style={styles.confirmButton}
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
    marginTop: 20,
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
    width: "75%",
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
  },
  title: {
    color: "black",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 120,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  selector: {
    marginTop: 50,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    fontSize: 20,
    color: "black",
  },
  dropdownArrow: {
    fontSize: 16,
    color: "gray",
  },
  categoryText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  estimatedTime: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 15,
    maxHeight: height * 0.6,
    padding: 10,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectedOption: {
    backgroundColor: "#F8F8F8",
  },
  optionText: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
  },
  selectedOptionText: {
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 60,
    padding: 22,
    backgroundColor: "black",
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

export default WeightChangeSpeedScreen;
