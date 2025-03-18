import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  HeightSelection: { age: number };
  CurrentWeight: {
    age: number;
    height: number;
    heightImperial: { feet: number; inches: number };
  };
};

type HeightSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "HeightSelection"
>;

const HeightSelectionScreen = () => {
  const navigation = useNavigation<HeightSelectionScreenNavigationProp>();
  const [unit, setUnit] = useState<"Imperial" | "Metric">("Imperial");

  // Imperial state
  const [feet, setFeet] = useState<number>(5); // Default to 5 feet
  const [inches, setInches] = useState<number>(10); // Default to 10 inches
  const [showFeetPicker, setShowFeetPicker] = useState<boolean>(false);
  const [showInchesPicker, setShowInchesPicker] = useState<boolean>(false);

  // Metric state
  const [centimeters, setCentimeters] = useState<number>(175); // Default to 175 cm
  const [showCmPicker, setShowCmPicker] = useState<boolean>(false);

  // AsyncStorage Keys
  const HEIGHT_KEY = "userHeight";
  const UNIT_KEY = "heightUnit";

  // FlatList refs for scrolling to selected value
  const feetListRef = useRef<FlatList>(null);
  const inchesListRef = useRef<FlatList>(null);
  const cmListRef = useRef<FlatList>(null);

  // Helper function to convert cm to feet and inches
  const convertCmToImperial = (cm: number) => {
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inch = Math.round(totalInches % 12);
    return { feet: ft, inches: inch };
  };

  // Helper function to convert feet and inches to cm
  const convertImperialToCm = (ft: number, inch: number) => {
    return Math.round(ft * 30.48 + inch * 2.54);
  };

  useEffect(() => {
    const loadHeightData = async () => {
      try {
        const savedUnit = await AsyncStorage.getItem(UNIT_KEY);
        if (savedUnit) setUnit(savedUnit as "Imperial" | "Metric");

        const savedHeightData = await AsyncStorage.getItem(HEIGHT_KEY);
        if (savedHeightData) {
          const parsedData = JSON.parse(savedHeightData);

          if (parsedData.imperial) {
            setFeet(parsedData.imperial.feet);
            setInches(parsedData.imperial.inches);
          }

          if (parsedData.metric) {
            setCentimeters(parsedData.metric);
          }
        }
      } catch (error) {
        console.error("Error loading height data:", error);
      }
    };
    loadHeightData();
  }, []);

  // Save height and unit to AsyncStorage
  const saveHeightData = async () => {
    try {
      await AsyncStorage.setItem(UNIT_KEY, unit);

      // Calculate and store both formats
      const heightImperial =
        unit === "Imperial"
          ? { feet, inches }
          : convertCmToImperial(centimeters);

      const heightMetric =
        unit === "Metric" ? centimeters : convertImperialToCm(feet, inches);

      await AsyncStorage.setItem(
        HEIGHT_KEY,
        JSON.stringify({
          imperial: heightImperial,
          metric: heightMetric,
        })
      );

      console.log("Height data saved successfully!");
    } catch (error) {
      console.error("Error saving height data:", error);
    }
  };

  const clearHeightData = async () => {
    try {
      await AsyncStorage.removeItem(UNIT_KEY);
      await AsyncStorage.removeItem(HEIGHT_KEY);
      console.log("Storage cleared!");
    } catch (error) {
      console.error("Error clearing height data:", error);
    }
  };

  // Check if input is valid
  const isImperialValid = () => {
    return feet >= 3 && feet <= 7 && inches >= 0 && inches <= 11;
  };

  const isMetricValid = () => {
    return centimeters >= 100 && centimeters <= 320;
  };

  // Confirm button handler
  const handleConfirm = async () => {
    // Calculate height in both formats
    const heightInCm =
      unit === "Imperial" ? convertImperialToCm(feet, inches) : centimeters;

    const heightImperial = {
      feet: unit === "Imperial" ? feet : convertCmToImperial(centimeters).feet,
      inches:
        unit === "Imperial" ? inches : convertCmToImperial(centimeters).inches,
    };

    await saveHeightData();

    // Navigate to next screen with height in cm and imperial format
    navigation.navigate("CurrentWeight", {
      age: 0,
      height: heightInCm,
      heightImperial: heightImperial,
    });
    console.log("Height in cm:", heightInCm);
    console.log("Height imperial:", heightImperial);
  };

  // Create range arrays
  const feetOptions = [3, 4, 5, 6, 7];
  const inchesOptions = Array.from({ length: 12 }, (_, i) => i);
  const cmOptions = Array.from({ length: 221 }, (_, i) => i + 100);

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
      <Text style={styles.title}>How tall are you?</Text>

      {/* Unit Toggle with Labels */}
      <View style={styles.toggleContainer}>
        <Text
          style={[
            styles.toggleLabel,
            unit === "Imperial" && styles.activeToggleLabel,
          ]}
        >
          Imperial
        </Text>
        <Switch
          value={unit === "Metric"}
          onValueChange={(value) => {
            setUnit(value ? "Metric" : "Imperial");
            setShowFeetPicker(false);
            setShowInchesPicker(false);
            setShowCmPicker(false);
          }}
          trackColor={{ false: "#000", true: "#000" }}
          thumbColor={"#fff"}
          style={styles.switch}
        />
        <Text
          style={[
            styles.toggleLabel,
            unit === "Metric" && styles.activeToggleLabel,
          ]}
        >
          Metric
        </Text>
      </View>

      {/* Height Selection Area */}
      {unit === "Imperial" ? (
        <View style={styles.imperialContainer}>
          <TouchableOpacity
            style={[styles.valueDisplay, styles.imperialValueDisplay]}
            onPress={() => {
              setShowFeetPicker(!showFeetPicker);
              setShowInchesPicker(false);
            }}
          >
            <Text style={styles.valueText}>{feet} feet</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.valueDisplay, styles.imperialValueDisplay]}
            onPress={() => {
              setShowInchesPicker(!showInchesPicker);
              setShowFeetPicker(false);
            }}
          >
            <Text style={styles.valueText}>{inches} inches</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {showFeetPicker && (
            <View style={[styles.pickerContainer, { left: width * 0.1 }]}>
              <FlatList
                ref={feetListRef}
                data={feetOptions}
                keyExtractor={(item) => `ft-${item}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.pickerItem,
                      feet === item && styles.selectedPickerItem,
                    ]}
                    onPress={() => {
                      setFeet(item);
                      setShowFeetPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        feet === item && styles.selectedPickerItemText,
                      ]}
                    >
                      {item} feet
                    </Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                initialScrollIndex={feetOptions.indexOf(feet)}
                getItemLayout={(data, index) => ({
                  length: 50,
                  offset: 50 * index,
                  index,
                })}
              />
            </View>
          )}

          {showInchesPicker && (
            <View style={[styles.pickerContainer, { right: width * 0.1 }]}>
              <FlatList
                ref={inchesListRef}
                data={inchesOptions}
                keyExtractor={(item) => `in-${item}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.pickerItem,
                      inches === item && styles.selectedPickerItem,
                    ]}
                    onPress={() => {
                      setInches(item);
                      setShowInchesPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        inches === item && styles.selectedPickerItemText,
                      ]}
                    >
                      {item} inches
                    </Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                initialScrollIndex={inchesOptions.indexOf(inches)}
                getItemLayout={(data, index) => ({
                  length: 50,
                  offset: 50 * index,
                  index,
                })}
              />
            </View>
          )}
        </View>
      ) : (
        <View style={styles.metricContainer}>
          <TouchableOpacity
            style={[styles.valueDisplay, styles.metricValueDisplay]}
            onPress={() => setShowCmPicker(!showCmPicker)}
          >
            <Text style={styles.valueText}>{centimeters} cm</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {showCmPicker && (
            <View style={styles.pickerContainer}>
              <FlatList
                ref={cmListRef}
                data={cmOptions}
                keyExtractor={(item) => `cm-${item}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.pickerItem,
                      centimeters === item && styles.selectedPickerItem,
                    ]}
                    onPress={() => {
                      setCentimeters(item);
                      setShowCmPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        centimeters === item && styles.selectedPickerItemText,
                      ]}
                    >
                      {item} cm
                    </Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                initialScrollIndex={cmOptions.indexOf(centimeters)}
                getItemLayout={(data, index) => ({
                  length: 50,
                  offset: 50 * index,
                  index,
                })}
              />
            </View>
          )}
        </View>
      )}

      {/* Confirm Button */}
      <TouchableOpacity
        disabled={unit === "Imperial" ? !isImperialValid() : !isMetricValid()}
        onPress={handleConfirm}
        style={[
          styles.confirmButton,
          {
            backgroundColor:
              unit === "Imperial"
                ? isImperialValid()
                  ? "black"
                  : "#777"
                : isMetricValid()
                  ? "black"
                  : "#777",
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
    backgroundColor: "#e0e0e0",
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
    marginTop: 150,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  toggleLabel: {
    fontSize: 18,
    marginHorizontal: 10,
    color: "#777",
  },
  activeToggleLabel: {
    color: "black",
    fontWeight: "500",
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  imperialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
  },
  metricContainer: {
    alignItems: "center",
  },
  valueDisplay: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imperialValueDisplay: {
    width: "45%",
  },
  metricValueDisplay: {
    width: "80%",
  },
  valueText: {
    fontSize: 18,
    color: "black",
  },
  dropdownIcon: {
    fontSize: 14,
    color: "#777",
  },
  pickerContainer: {
    position: "absolute",
    top: 50,
    width: "45%",
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white",
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pickerItem: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedPickerItem: {
    backgroundColor: "black",
  },
  pickerItemText: {
    fontSize: 16,
    color: "black",
  },
  selectedPickerItemText: {
    color: "white",
  },
  confirmButton: {
    marginTop: 40,
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 20,
    position: "absolute",
    bottom: 320,
    left: 20,
    right: 20,
  },
  confirmText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default HeightSelectionScreen;
