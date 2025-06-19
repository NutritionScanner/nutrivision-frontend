import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

type RootStackParamList = {
  HeightSelection: undefined;
  WeightSelection: {
    height: number;
    heightImperial: { feet: number; inches: number };
  };
  GoalWeight: {
    currentWeight: number;
    height: number;
    heightImperial: { feet: number; inches: number };
  };
};

type CurrentWeightScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "WeightSelection"
>;

type CurrentWeightScreenRouteProp = RouteProp<
  RootStackParamList,
  "WeightSelection"
>;

const CurrentWeightScreen = () => {
  const navigation = useNavigation<CurrentWeightScreenNavigationProp>();
  const route = useRoute<CurrentWeightScreenRouteProp>();

  // Extract height data from route params
  const { height, heightImperial } = route.params || {
    height: 0,
    heightImperial: { feet: 0, inches: 0 },
  };

  const [selectedWeight, setSelectedWeight] = useState<number | null>(72);
  const [modalVisible, setModalVisible] = useState(false);

  // AsyncStorage key
  const WEIGHT_KEY = "userWeight";

  // Load saved weight on component mount
  useEffect(() => {
    const loadSavedWeight = async () => {
      try {
        const savedWeight = await AsyncStorage.getItem(WEIGHT_KEY);
        if (savedWeight !== null) {
          setSelectedWeight(Number(savedWeight));
          console.log("Loaded weight from storage:", savedWeight);
        }
      } catch (error) {
        console.error("Error loading weight data:", error);
      }
    };

    loadSavedWeight();
  }, []);

  // Save weight to AsyncStorage
  const saveWeightData = async (weight: number) => {
    try {
      await AsyncStorage.setItem(WEIGHT_KEY, weight.toString());
      console.log("Weight saved successfully:", weight);
    } catch (error) {
      console.error("Error saving weight data:", error);
    }
  };

  // Generate weight options from 40kg to 150kg
  const weightOptions = Array.from({ length: 111 }, (_, i) => 40 + i);

  const handleConfirm = async () => {
    if (selectedWeight !== null) {
      // Save weight to AsyncStorage before navigating
      await saveWeightData(selectedWeight);

      // Navigate to next screen with all necessary data
      navigation.navigate("GoalWeight", {
        currentWeight: selectedWeight,
        height: height,
        heightImperial: heightImperial,
      });
      console.log("Current weight:", selectedWeight);
      console.log("Height in cm:", height);
      console.log("Height imperial:", heightImperial);
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const selectWeight = (weight: number) => {
    setSelectedWeight(weight);
    setModalVisible(false);
  };

  // Helper function to clear storage (for testing)
  const clearWeightData = async () => {
    try {
      await AsyncStorage.removeItem(WEIGHT_KEY);
      console.log("Weight data cleared!");
    } catch (error) {
      console.error("Error clearing weight data:", error);
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
      <Text style={styles.title}>What's your current weight?</Text>

      {/* Weight Selection */}
      <TouchableOpacity
        style={styles.weightSelector}
        onPress={toggleModal}
        activeOpacity={0.7}
      >
        <Text style={styles.weightText}>
          {selectedWeight ? `${selectedWeight} kg` : "Select weight"}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      {/* Weight Selection Modal */}
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
              data={weightOptions}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    selectedWeight === item && styles.selectedOption,
                  ]}
                  onPress={() => selectWeight(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedWeight === item && styles.selectedOptionText,
                    ]}
                  >
                    {item} kg
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.listContent}
              initialScrollIndex={weightOptions.indexOf(selectedWeight ?? 72)}
              getItemLayout={(data, index) => ({
                length: 51, // Item height plus padding
                offset: 51 * index,
                index,
              })}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Confirm Button */}
      <TouchableOpacity
        disabled={selectedWeight === null}
        onPress={handleConfirm}
        style={[
          styles.confirmButton,
          {
            backgroundColor: selectedWeight === null ? "#999" : "black",
          },
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
    width: "50%",
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
  title: {
    color: "black",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 120,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  weightSelector: {
    marginTop: 50,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weightText: {
    fontSize: 20,
    color: "black",
  },
  dropdownArrow: {
    fontSize: 16,
    color: "gray",
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
  listContent: {
    paddingHorizontal: 10,
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

export default CurrentWeightScreen;
