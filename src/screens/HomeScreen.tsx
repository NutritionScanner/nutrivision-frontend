import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { StackNavigationProp } from "@react-navigation/stack";
import Svg, { Circle } from "react-native-svg";
import { ScrollView } from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

interface CircularProgressProps {
  value: number;
  maxValue: number;
  title: string;
  color?: string;
}

const CircularProgress = ({
  value,
  maxValue,
  title,
  color = "#333",
}: CircularProgressProps) => {
  const progress = (value / maxValue) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.progressContainer}>
      <Svg height="100" width="100" viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#e0e0e0"
          strokeWidth="8"
          fill="transparent"
        />
        <Circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.progressText}>
        {value}/{maxValue}
      </Text>
      <Text style={styles.progressTitle}>{title}</Text>
    </View>
  );
};

// Dynamic Greeting Function
const getDynamicGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good Morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good Afternoon";
  } else if (currentHour >= 17 && currentHour < 21) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

type RootStackParamList = {
  Home: undefined;
  BarcodeScanner: undefined;
  FoodDetection: undefined;
  FruitVegetableDetection: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const greeting = getDynamicGreeting();
  const [userName, setUserName] = useState("User"); // Replace with actual user name from your auth system

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email) {
      const nameFromEmail = currentUser.email.split("@")[0];
      setUserName(
        nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
      );
    }
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            // Navigation will be handled automatically by the auth state listener
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header with profile and greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate("Profile")}
            >
              <Icon name="person" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Icon name="log-out-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Summary</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Icon name="flame-outline" size={24} color="#333" />
              <Text style={styles.summaryValue}>1500</Text>
              <Text style={styles.summaryLabel}>Calories</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Icon name="barbell-outline" size={24} color="#333" />
              <Text style={styles.summaryValue}>45</Text>
              <Text style={styles.summaryLabel}>Protein (g)</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Icon name="water-outline" size={24} color="#333" />
              <Text style={styles.summaryValue}>3/8</Text>
              <Text style={styles.summaryLabel}>Water (cups)</Text>
            </View>
          </View>
        </View>

        {/* Feature Title */}
        <Text style={styles.sectionTitle}>Nutrition Tools</Text>

        {/* Feature Cards */}
        <View style={styles.cardsContainer}>
          {/* Barcode Scanner Card */}
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate("BarcodeScanner")}
            activeOpacity={0.8}
          >
            <View style={styles.cardIconContainer}>
              <Icon name="barcode-outline" size={24} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Scan Barcode</Text>
              <Text style={styles.cardDesc}>
                Get instant nutritional information
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          {/* Food Detection */}
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate("FoodDetection")}
            activeOpacity={0.8}
          >
            <View style={styles.cardIconContainer}>
              <Icon name="fast-food-outline" size={24} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Detect Food</Text>
              <Text style={styles.cardDesc}>AI-powered meal analysis</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          {/* Fruit/Vegetable Detection */}
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => navigation.navigate("FruitVegetableDetection")}
            activeOpacity={0.8}
          >
            <View style={styles.cardIconContainer}>
              <Icon name="leaf-outline" size={24} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Fruits & Vegetables</Text>
              <Text style={styles.cardDesc}>
                Get precise nutritional values
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Progress Section */}
        <Text style={styles.sectionTitle}>Daily Goals</Text>
        <View style={styles.progressSection}>
          <CircularProgress
            value={1500}
            maxValue={2000}
            title="Calories"
            color="#333"
          />
          <CircularProgress value={3} maxValue={8} title="Water" color="#333" />
          <CircularProgress
            value={5}
            maxValue={8}
            title="Protein"
            color="#333"
          />
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.recentActivityContainer}>
          <View style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              <Icon name="restaurant-outline" size={20} color="#fff" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Breakfast</Text>
              <Text style={styles.activityDesc}>
                Oatmeal with fruits • 320 calories
              </Text>
            </View>
            <Text style={styles.activityTime}>8:30 AM</Text>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              <Icon name="cafe-outline" size={20} color="#fff" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Snack</Text>
              <Text style={styles.activityDesc}>
                Protein shake • 180 calories
              </Text>
            </View>
            <Text style={styles.activityTime}>11:00 AM</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#000",
  },
  greeting: {
    fontSize: 14,
    color: "#aaa",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    margin: 20,
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ translateY: -20 }],
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  summaryContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  cardDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  progressSection: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  progressContainer: {
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 8,
  },
  progressTitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  recentActivityContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  activityContent: {
    flex: 1,
    marginLeft: 15,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  activityDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#999",
  },
});

export default HomeScreen;
