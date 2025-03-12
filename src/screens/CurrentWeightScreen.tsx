import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
const { width, height } = Dimensions.get("window");

type RootStackParamList = {
  HeightSelection: undefined;
  WeightSelection: undefined;
  GoalWeight: { currentWeight: number }; // Change "weight" to "currentWeight"
};

type WeightSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "WeightSelection"
>;

const WeightSelectionScreen = () => {
  const navigation = useNavigation<WeightSelectionScreenNavigationProp>();
  const [selectedWeight, setSelectedWeight] = useState<number | null>(72);
  const [modalVisible, setModalVisible] = useState(false);

  // Generate weight options from 40kg to 150kg
  const weightOptions = Array.from({ length: 111 }, (_, i) => 40 + i);

  const handleConfirm = () => {
    if (selectedWeight !== null) {
      navigation.navigate("GoalWeight", { currentWeight: selectedWeight });
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const selectWeight = (weight: number) => {
    setSelectedWeight(weight);
    setModalVisible(false);
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
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Confirm Button */}
      <TouchableOpacity
        disabled={selectedWeight === null}
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
    width: "50%", // 50% progress indicates we're on the Weight Selection step
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

export default WeightSelectionScreen;
