import React, { useRef, useState } from 'react';
import { CameraView, useCameraPermissions, CameraType, BarcodeScanningResult } from 'expo-camera';
import { Button, Pressable, StyleSheet, Text, View, Alert, Modal, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AntDesign, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { fetchNutritionData } from '../api/api';

const BarcodeScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nutritionModalVisible, setNutritionModalVisible] = useState(false); // Separate state for nutrition modal
  const [manualModalVisible, setManualModalVisible] = useState(false); // Separate state for manual barcode modal
  const [manualCode, setManualCode] = useState('');
  const [nutritionData, setNutritionData] = useState<any>(null);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);

    try {
      const nutritionData = await fetchNutritionData(data);

      if (nutritionData) {
        // Format the nutrition data into a string
        const formattedData = formatNutritionData(nutritionData);
        setNutritionData(formattedData);
        setNutritionModalVisible(true); // Show nutrition data modal
      } else {
        Alert.alert('Error', 'No nutrition data found.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch nutrition data for this product.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (manualCode.length < 8) {
      Alert.alert('Error', 'Please enter a valid barcode');
      return;
    }
    setManualModalVisible(false);
    setLoading(true);
    try {
      const data = await fetchNutritionData(manualCode);
      setNutritionData(formatNutritionData(data));
      setNutritionModalVisible(true); // Show nutrition data modal
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch nutrition data for this product.');
    } finally {
      setLoading(false);
    }
    setManualCode('');
  };

  // Format the nutrition data as a string
  const formatNutritionData = (data: any) => {
    return `Product: ${data.name}\n` +
           `Calories: ${data.calories} kcal\n` +
           `Protein: ${data.protein}g\n` +
           `Fats: ${data.fats}g\n` +
           `Carbs: ${data.carbs}g\n` +
           `Nutriscore: ${data.nutriscore.toUpperCase()}\n\n` +
           `Ingredients:\n${data.ingredients}`;
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={ref}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'upc_a', 'upc_e', 'qr'],
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

      {/* Nutrition Information Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={nutritionModalVisible}
        onRequestClose={() => setNutritionModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nutrition Information</Text>
            {nutritionData ? (
              <Text style={styles.modalText}>{nutritionData}</Text>
            ) : (
              <Text style={styles.modalText}>No data available</Text>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setNutritionModalVisible(false)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSubmit]}
                onPress={() => setNutritionModalVisible(false)}
              >
                <Text style={styles.textStyle}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  shutterContainer: {
    position: 'absolute',
    bottom: 44,
    left: 0,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  overlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '45%',
  },
  buttonSubmit: {
    backgroundColor: '#2196F3',
  },
  buttonCancel: {
    backgroundColor: '#ff4444',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BarcodeScanner;
