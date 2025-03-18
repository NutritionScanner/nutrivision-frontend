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
import { detectFoodItem } from "../api/api";
import { Camera, Upload, ChevronLeft } from "lucide-react-native";
import { StackNavigationProp } from "@react-navigation/stack";

const { width } = Dimensions.get("window");

// Define the navigation type
type RootStackParamList = {
  Home: undefined;
  FoodDetection: undefined;
  // Add other screens as needed
};

type FoodDetectionScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const FoodDetectionScreen = ({ navigation }: FoodDetectionScreenProps) => {
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
      const data = await detectFoodItem(formData);
      setNutritionData(data);
    } catch (error) {
      Alert.alert("Error", "Unable to detect food item.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const HealthRatingBadge = ({ rating }: { rating: string }) => {
    // Use grayscale colors for the health rating badges
    const getBadgeColor = () => {
      switch (rating.toLowerCase()) {
        case "excellent":
          return "#000000";
        case "good":
          return "#333333";
        case "average":
          return "#666666";
        case "poor":
          return "#999999";
        default:
          return "#CCCCCC";
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
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <ChevronLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Nutrition Tracker</Text>
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
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            )}
          </View>
        )}

        {nutritionData && !loading && (
          <View style={styles.nutritionContainer}>
            <View style={styles.nutritionHeader}>
              <Text
                style={styles.nutritionTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {nutritionData.food_item}
              </Text>
              <HealthRatingBadge rating={nutritionData.health_rating} />
            </View>

            <View style={styles.divider} />

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
                <Text style={styles.nutritionGridLabel}>Fats</Text>
                <Text style={styles.nutritionGridValue}>
                  {nutritionData.fats}g
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.nutritionSummary}>{nutritionData.summary}</Text>
          </View>
        )}

        {!image && !nutritionData && (
          <View style={styles.placeholderContainer}>
            <Camera color="#CCCCCC" size={80} />
            <Text style={styles.placeholderText}>
              Take a photo or upload an image to analyze food nutrition
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerContainer: {
    width: "100%",
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    flex: 1,
  },
  backButton: {
    position: "absolute",
    left: 0,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  galleryButton: {
    backgroundColor: "#000000",
  },
  cameraButton: {
    backgroundColor: "#000000",
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
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: "#F0F0F0",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  nutritionContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  nutritionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  nutritionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    flex: 1,
  },
  healthBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 8,
  },
  healthBadgeText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    width: "100%",
    marginVertical: 15,
  },
  nutritionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nutritionGridItem: {
    alignItems: "center",
    width: "22%",
  },
  nutritionGridLabel: {
    color: "#666666",
    fontSize: 12,
    marginBottom: 5,
  },
  nutritionGridValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  nutritionSummary: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
    textAlign: "left",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: "#999999",
    textAlign: "center",
    marginTop: 20,
    maxWidth: 250,
  },
});

export default FoodDetectionScreen;
