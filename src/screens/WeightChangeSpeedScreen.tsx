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
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

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

  const handleConfirm = () => {
    if (speed !== null) {
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
                  style={styles.optionItem}
                  onPress={() => selectSpeed(parseFloat(item))}
                >
                  <Text style={styles.optionText}>{item} kg/week</Text>
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
  optionText: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
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
