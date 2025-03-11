import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { detectFruitVegetable } from "../api/api";
import { LinearGradient } from "expo-linear-gradient";
import { Camera, Upload, Leaf } from "lucide-react-native";

const { width } = Dimensions.get("window");

const FruitVegetableDetectionScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      handleImageUpload(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Sorry, we need camera permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      handleImageUpload(result.assets[0].uri);
    }
  };

  const handleImageUpload = async (uri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    setLoading(true);
    try {
      const data = await detectFruitVegetable(formData);
      setNutritionData(data);
    } catch (error) {
      Alert.alert("Error", "Unable to detect fruit/vegetable.");
    } finally {
      setLoading(false);
    }
  };

  const HealthRatingBadge = ({ rating }: { rating: string }) => {
    const getBadgeColor = () => {
      switch (rating.toLowerCase()) {
        case "excellent":
          return "#4CAF50";
        case "good":
          return "#2196F3";
        case "average":
          return "#FFC107";
        case "poor":
          return "#FF5722";
        default:
          return "#9E9E9E";
      }
    };

    return (
      <View style={[styles.healthBadge, { backgroundColor: getBadgeColor() }]}>
        <Text style={styles.healthBadgeText}>{rating}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#E8F5E9", "#C8E6C9"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Fruit & Veggie Tracker</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.galleryButton]}
            onPress={pickImage}
          >
            <Upload color="white" size={24} />
            <Text style={styles.actionButtonText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.cameraButton]}
            onPress={takePhoto}
          >
            <Camera color="white" size={24} />
            <Text style={styles.actionButtonText}>Camera</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              blurRadius={loading ? 5 : 0}
            />
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#ffffff" />
              </View>
            )}
          </View>
        )}

        {nutritionData && !loading && (
          <View style={styles.nutritionContainer}>
            <View style={styles.nutritionHeader}>
              <View style={styles.titleContainer}>
                <Leaf color="#4CAF50" size={24} style={styles.leafIcon} />
                <Text style={styles.nutritionTitle}>
                  {nutritionData.food_item}
                </Text>
              </View>
              <HealthRatingBadge rating={nutritionData.health_rating} />
            </View>

            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionGridItem}>
                <Text style={styles.nutritionGridLabel}>Calories</Text>
                <Text style={styles.nutritionGridValue}>
                  {nutritionData.calories} kcal
                </Text>
              </View>
              <View style={styles.nutritionGridItem}>
                <Text style={styles.nutritionGridLabel}>Protein</Text>
                <Text style={styles.nutritionGridValue}>
                  {nutritionData.protein}g
                </Text>
              </View>
              <View style={styles.nutritionGridItem}>
                <Text style={styles.nutritionGridLabel}>Carbs</Text>
                <Text style={styles.nutritionGridValue}>
                  {nutritionData.carbohydrates}g
                </Text>
              </View>
              <View style={styles.nutritionGridItem}>
                <Text style={styles.nutritionGridLabel}>Fiber</Text>
                <Text style={styles.nutritionGridValue}>
                  {nutritionData.fiber}g
                </Text>
              </View>
            </View>

            <Text style={styles.nutritionSummary}>{nutritionData.summary}</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerContainer: {
    width: "100%",
    marginBottom: 30,
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E7D32",
    letterSpacing: 1,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    paddingVertical: 15,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  galleryButton: {
    backgroundColor: "#4CAF50",
  },
  cameraButton: {
    backgroundColor: "#2196F3",
  },
  actionButtonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    width: width - 40,
    height: width - 40,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  nutritionContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nutritionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  leafIcon: {
    marginRight: 10,
  },
  nutritionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  healthBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  healthBadgeText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  nutritionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  nutritionGridItem: {
    alignItems: "center",
    width: "22%",
  },
  nutritionGridLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 5,
  },
  nutritionGridValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  nutritionSummary: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default FruitVegetableDetectionScreen;
