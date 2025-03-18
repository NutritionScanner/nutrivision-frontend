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
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { detectFruitVegetable } from "../api/api";
import { Camera, Upload, Leaf, ChevronLeft } from "lucide-react-native";

const { width } = Dimensions.get("window");

const FruitVegetableDetectionScreen = ({ navigation }: any) => {
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
          return "#333";
        case "good":
          return "#555";
        case "average":
          return "#777";
        case "poor":
          return "#999";
        default:
          return "#000";
      }
    };

    return (
      <View style={[styles.healthBadge, { backgroundColor: getBadgeColor() }]}>
        <Text style={styles.healthBadgeText}>{rating}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Fruit & Veggie Analysis</Text>
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
                <Leaf color="#000" size={24} style={styles.leafIcon} />
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

            <TouchableOpacity style={styles.moreDetailsButton}>
              <Text style={styles.moreDetailsText}>More Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  backButtonContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 30,
  },
  headerContainer: {
    width: "100%",
    marginBottom: 30,
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
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
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  galleryButton: {
    backgroundColor: "#000",
  },
  cameraButton: {
    backgroundColor: "#333",
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
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: "#ddd",
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
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#eee",
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
    color: "#000",
  },
  healthBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
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
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 20,
  },
  nutritionGridItem: {
    alignItems: "center",
    width: "22%",
  },
  nutritionGridLabel: {
    color: "#666",
    fontSize: 12,
    marginBottom: 5,
  },
  nutritionGridValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  nutritionSummary: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 20,
  },
  moreDetailsButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  moreDetailsText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default FruitVegetableDetectionScreen;
