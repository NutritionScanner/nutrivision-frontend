import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const { width, height } = Dimensions.get("window");

type RootStackParamList = {
  WeightChangeSpeed: { goalWeight: number; goalType: string, currentWeight: number };
  GoalWeight: { currentWeight: number };
};

type GoalWeightScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "GoalWeight"
>;

type GoalWeightScreenRouteProp = RouteProp<RootStackParamList, "GoalWeight">;

interface Props {
  route: GoalWeightScreenRouteProp;
}

const GoalWeightScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<GoalWeightScreenNavigationProp>();
  const { currentWeight } = route.params;

  const [goalWeight, setGoalWeight] = useState<number | null>(currentWeight);
  const [modalVisible, setModalVisible] = useState(false);

  // Allowable range: ±35 kg from current weight
  const minGoalWeight = currentWeight - 35;
  const maxGoalWeight = currentWeight + 35;

  // Generate weight options
  const weightOptions = Array.from(
    { length: maxGoalWeight - minGoalWeight + 1 },
    (_, i) => minGoalWeight + i
  );

  const handleConfirm = () => {
    if (goalWeight !== null) {
      const goalType = goalWeight > currentWeight ? "gain" : "lose";
      navigation.navigate("WeightChangeSpeed", {
        goalWeight,
        goalType,
        currentWeight,
      });
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const selectWeight = (weight: number) => {
    setGoalWeight(weight);
    setModalVisible(false);
  };

  // Calculate weight difference
  const weightDifference = goalWeight ? goalWeight - currentWeight : 0;

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

      <Text style={styles.title}>What's your goal weight?</Text>

      <TouchableOpacity
        style={styles.weightSelector}
        onPress={toggleModal}
        activeOpacity={0.7}
      >
        <Text style={styles.weightText}>
          {goalWeight ? `${goalWeight} kg` : "Select goal weight"}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      {/* Weight Difference Message */}
      {goalWeight !== currentWeight && (
        <Text
          style={[
            styles.weightChangeText,
            weightDifference > 0 ? styles.gainText : styles.lossText,
          ]}
        >
          You will {weightDifference > 0 ? "gain" : "lose"}{" "}
          {Math.abs(weightDifference)} kg
        </Text>
      )}

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
                    goalWeight === item && styles.selectedOption,
                  ]}
                  onPress={() => selectWeight(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      goalWeight === item && styles.selectedOptionText,
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

      <TouchableOpacity
        disabled={goalWeight === null}
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
    paddingBottom: 20,
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
  weightChangeText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },
  gainText: {
    color: "green",
  },
  lossText: {
    color: "red",
  },
});

export default GoalWeightScreen;
