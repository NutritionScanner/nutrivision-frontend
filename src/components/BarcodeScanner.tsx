import React, { useEffect, useRef, useState } from "react";
import {
  CameraView,
  useCameraPermissions,
  CameraType,
  BarcodeScanningResult,
} from "expo-camera";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  AntDesign,
  FontAwesome6,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { fetchNutritionData } from "../api/api";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

// Type definitions
interface NutritionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}

type NutriscoreType = "A" | "B" | "C" | "D" | "E" | "UNKNOWN";

const BarcodeScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isPermissionLoading, setIsPermissionLoading] = useState(true);
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nutritionModalVisible, setNutritionModalVisible] = useState(false);
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [nutritionData, setNutritionData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (!permission || !permission.granted) {
        const result = await requestPermission();
        if (!result.granted) {
          Alert.alert(
            "Camera Permission Denied",
            "Camera access is required to scan barcodes."
          );
        }
      }
      setIsPermissionLoading(false);
    })();
  }, []);

  if (isPermissionLoading || !permission) {
    return (
      <View style={styles.container}>
        <Text>Checking camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Camera permission is required to use the barcode scanner.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={[styles.button, styles.buttonSubmit]}
        >
          <Text style={styles.textStyle}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);

    try {
      const nutritionData = await fetchNutritionData(data);

      if (nutritionData) {
        setNutritionData(nutritionData);
        setNutritionModalVisible(true);
      } else {
        Alert.alert("Error", "No nutrition data found.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch nutrition data for this product.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (manualCode.length < 8) {
      Alert.alert("Error", "Please enter a valid barcode");
      return;
    }
    setManualModalVisible(false);
    setLoading(true);
    try {
      const data = await fetchNutritionData(manualCode);
      setNutritionData(data);
      setNutritionModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "Unable to fetch nutrition data for this product.");
    } finally {
      setLoading(false);
    }
    setManualCode("");
  };

  const getNutriscoreColor = (score: string): string => {
    const colors: Record<NutriscoreType, string> = {
      A: "#00C851",
      B: "#7CB342",
      C: "#FFB300",
      D: "#FF8F00",
      E: "#FF3547",
      UNKNOWN: "#6C757D",
    };
    const normalizedScore = score?.toUpperCase() as NutriscoreType;
    return colors[normalizedScore] || colors.UNKNOWN;
  };

  const NutritionCard: React.FC<NutritionCardProps> = ({
    icon,
    label,
    value,
    unit = "",
    color = "#4A90E2",
  }) => (
    <View style={[styles.nutritionCard, { borderLeftColor: color }]}>
      <View style={styles.cardIcon}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardValue}>
          {value}
          <Text style={styles.cardUnit}>{unit}</Text>
        </Text>
      </View>
    </View>
  );

  const renderNutritionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={nutritionModalVisible}
      onRequestClose={() => setNutritionModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.enhancedModalView}>
          {/* Header */}
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.modalHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.headerContent}>
              <Ionicons name="nutrition" size={28} color="white" />
              <Text style={styles.modalHeaderTitle}>Nutrition Facts</Text>
              <TouchableOpacity
                onPress={() => setNutritionModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Product Name */}
            <View style={styles.productSection}>
              <Text style={styles.productName}>
                {nutritionData?.name || "Unknown Product"}
              </Text>
              {nutritionData?.nutriscore && (
                <View
                  style={[
                    styles.nutriscoreBadge,
                    {
                      backgroundColor: getNutriscoreColor(
                        nutritionData.nutriscore
                      ),
                    },
                  ]}
                >
                  <Text style={styles.nutriscoreText}>
                    Nutri-Score {nutritionData.nutriscore.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* Nutrition Cards */}
            <View style={styles.nutritionGrid}>
              <NutritionCard
                icon="flame"
                label="Calories"
                value={nutritionData?.calories || "N/A"}
                unit=" kcal"
                color="#FF6B6B"
              />
              <NutritionCard
                icon="fitness"
                label="Protein"
                value={nutritionData?.protein || "N/A"}
                unit="g"
                color="#4ECDC4"
              />
              <NutritionCard
                icon="water"
                label="Fats"
                value={nutritionData?.fats || "N/A"}
                unit="g"
                color="#45B7D1"
              />
              <NutritionCard
                icon="leaf"
                label="Carbs"
                value={nutritionData?.carbs || "N/A"}
                unit="g"
                color="#96CEB4"
              />
            </View>

            {/* Ingredients Section */}
            {nutritionData?.ingredients && (
              <View style={styles.ingredientsSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="list" size={20} color="#667eea" />
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                </View>
                <View style={styles.ingredientsContainer}>
                  <Text style={styles.ingredientsText}>
                    {nutritionData.ingredients}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => setNutritionModalVisible(false)}
            >
              <Ionicons name="bookmark-outline" size={20} color="#667eea" />
              <Text style={styles.secondaryButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => setNutritionModalVisible(false)}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.primaryButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={ref}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "upc_a", "upc_e", "qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          {loading && <ActivityIndicator size="large" color="white" />}
        </View>
        <View style={styles.shutterContainer}>
          <Pressable onPress={() => setScanned(false)}>
            <AntDesign name="scan1" size={32} color="white" />
          </Pressable>
          <Pressable onPress={() => setManualModalVisible(true)}>
            <MaterialIcons name="keyboard" size={32} color="white" />
          </Pressable>
          <Pressable onPress={toggleCameraFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </CameraView>

      {renderNutritionModal()}

      {/* Manual Barcode Entry Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={manualModalVisible}
        onRequestClose={() => setManualModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Barcode Manually</Text>
            <TextInput
              style={styles.input}
              onChangeText={setManualCode}
              value={manualCode}
              placeholder="Enter barcode number"
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setManualModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSubmit]}
                onPress={handleManualSubmit}
              >
                <Text style={styles.textStyle}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  overlay: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  // Enhanced Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  enhancedModalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    minHeight: height * 0.6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    flex: 1,
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productSection: {
    paddingVertical: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  productName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 28,
  },
  nutriscoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  nutriscoreText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  nutritionGrid: {
    paddingVertical: 20,
    gap: 12,
  },
  nutritionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    color: "#6C757D",
    fontWeight: "500",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
  },
  cardUnit: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6C757D",
  },
  ingredientsSection: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginLeft: 8,
  },
  ingredientsContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  ingredientsText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#495057",
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#667eea",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#667eea",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: "#667eea",
    fontWeight: "600",
    fontSize: 16,
  },
  // Original Modal Styles (for manual entry)
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: "45%",
  },
  buttonSubmit: {
    backgroundColor: "#2196F3",
  },
  buttonCancel: {
    backgroundColor: "#ff4444",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BarcodeScanner;
