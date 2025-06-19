import {
  CameraView,
  useCameraPermissions,
  CameraType,
  CameraMode,
  BarcodeScanningResult,
} from "expo-camera";
import { useRef, useState, useEffect } from "react"; // ✅ useEffect imported
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
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  nutriscore: string;
  ingredients: string;
}

export default function BarcodeScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isPermissionLoading, setIsPermissionLoading] = useState(true); // ✅ new state
  const ref = useRef<CameraView>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [manualCode, setManualCode] = useState("");

  // ✅ Request camera permission on mount
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

  // ✅ While waiting for permission
  if (isPermissionLoading || !permission) {
    return (
      <View style={styles.container}>
        <Text>Checking camera permissions...</Text>
      </View>
    );
  }

  // ✅ If permission was explicitly denied
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

  const formatNutritionData = (data: NutritionData) => {
    return (
      `Product: ${data.name}\n` +
      `Calories: ${data.calories} kcal\n` +
      `Protein: ${data.protein}g\n` +
      `Fats: ${data.fats}g\n` +
      `Carbs: ${data.carbs}g\n` +
      `Nutriscore: ${data.nutriscore.toUpperCase()}\n\n` +
      `Ingredients:\n${data.ingredients}`
    );
  };

  const fetchNutritionData = async (barcode: string) => {
    setLoading(true);
    console.log("Fetching data for barcode:", barcode); // Debug log
    try {
      // Replace 127.0.0.1 with your computer's IP address
      const url = `http://10.0.2.2:8000/nutrition/${barcode}`;
      console.log("API URL:", url); // Debug log
      const response = await axios.get<NutritionData>(url);
      console.log("API Response:", response.data); // Debug log
      Alert.alert("Nutrition Information", formatNutritionData(response.data), [
        {
          text: "OK",
          onPress: () => {
            setScanned(false);
            setLoading(false);
          },
        },
      ]);
    } catch (error) {
      console.error("API Error:", error); // Debug log
      Alert.alert("Error", "Unable to fetch nutrition data for this product.", [
        {
          text: "Try Again",
          onPress: () => {
            setScanned(false);
            setLoading(false);
          },
        },
      ]);
    }
    setLoading(false);
  };

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (scanned || loading) return;
    setScanned(true);
    await fetchNutritionData(data);
  };

  const handleManualSubmit = async () => {
    if (manualCode.length < 8) {
      Alert.alert("Error", "Please enter a valid barcode");
      return;
    }
    setModalVisible(false);
    await fetchNutritionData(manualCode);
    setManualCode("");
  };

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
          {loading && (
            <Text style={styles.loadingText}>Fetching nutrition data...</Text>
          )}
        </View>
        <View style={styles.shutterContainer}>
          <Pressable onPress={() => setScanned(false)}>
            <AntDesign name="scan1" size={32} color="white" />
          </Pressable>
          <Pressable onPress={() => setModalVisible(true)}>
            <MaterialIcons name="keyboard" size={32} color="white" />
          </Pressable>
          <Pressable
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
          >
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </CameraView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
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
                onPress={() => setModalVisible(false)}
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
}

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
  loadingText: {
    color: "white",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 5,
  },
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
    fontSize: 18,
    fontWeight: "bold",
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
