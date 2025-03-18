import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  Summary: {
    speed: number;
    goalType: string;
    goalWeight: number;
    currentWeight: number;
  };
  GoalWeight: undefined;
  Home: undefined;
  Signup: undefined;
};

type SummaryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Summary"
>;

const SummaryScreen = () => {
  const navigation = useNavigation<SummaryScreenNavigationProp>();
  const route = useRoute();
  const { speed, goalType, goalWeight, currentWeight } = route.params as {
    speed: number;
    goalType: string;
    goalWeight: number;
    currentWeight: number;
  };

  const weightDifference = Math.abs(goalWeight - currentWeight);
  const timeToGoal = Math.ceil(weightDifference / speed);
  const isWeightLoss = goalType === "lose";

  // Calculate estimated completion date
  const getEstimatedDate = () => {
    const today = new Date();
    const completionDate = new Date(today);
    completionDate.setDate(today.getDate() + timeToGoal * 7); // weeks to days
    return completionDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <ScrollView style={styles.scrollView}>
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
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={styles.progress} />
            </View>
          </View>
        </View>

        {/* Medal Image */}
        <Image
          source={require("../../assets/medal.png")}
          style={styles.badge}
        />

        {/* Personal Journey Title */}
        <Text style={styles.journeyTitle}>Your Personalized Journey</Text>

        {/* Motivational Message */}
        <Text style={styles.motivationText}>
          {isWeightLoss
            ? "Transformation Starts Today! 💪"
            : "Building Strength Starts Now! 💪"}
        </Text>

        {/* Goal Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Your Goal Summary</Text>

          <View style={styles.goalDetail}>
            <Text style={styles.goalLabel}>Current</Text>
            <Text style={styles.goalValue}>{currentWeight} kg</Text>
          </View>

          <View style={styles.goalDetail}>
            <Text style={styles.goalLabel}>Target</Text>
            <Text style={styles.goalValue}>{goalWeight} kg</Text>
          </View>

          <View style={styles.goalDetail}>
            <Text style={styles.goalLabel}>Weekly Pace</Text>
            <Text style={styles.goalValue}>{speed} kg/week</Text>
          </View>

          <View style={styles.goalDetail}>
            <Text style={styles.goalLabel}>Estimated Timeline</Text>
            <Text style={styles.goalValue}>{timeToGoal} weeks</Text>
          </View>

          <View style={styles.goalDetail}>
            <Text style={styles.goalLabel}>Target Date</Text>
            <Text style={styles.goalValue}>{getEstimatedDate()}</Text>
          </View>
        </View>

        <Text style={styles.descriptionText}>
          We've designed a plan to help you {goalType} {weightDifference} kg at
          a sustainable pace. With your commitment to {speed} kg/week, you'll
          reach your goal in about {timeToGoal} weeks.
          {"\n\n"}
          <Text style={styles.boldText}>
            This is both realistic and achievable
          </Text>{" "}
          with our guided approach combining nutrition, activity, and lifestyle
          changes.
        </Text>

        {/* Health Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Health Benefits You'll Gain:</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitDot}>•</Text>
            <Text style={styles.benefitText}>
              Increased energy throughout the day
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitDot}>•</Text>
            <Text style={styles.benefitText}>Improved sleep quality</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitDot}>•</Text>
            <Text style={styles.benefitText}>
              {isWeightLoss
                ? "Better mobility and joint health"
                : "Increased strength and endurance"}
            </Text>
          </View>
        </View>

        <Text style={styles.smallStepsText}>
          Remember: Consistency beats perfection. Small daily steps lead to
          remarkable transformations.
        </Text>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={styles.continueButton}
        >
          <Text style={styles.continueText}>Start Your Journey</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 100,
    paddingBottom: 40,
    alignItems: "center",
  },
  topRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
  },
  progressBarContainer: {
    flex: 1,
    marginLeft: 15,
  },
  progressBarBackground: {
    height: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
  },
  progress: {
    width: "100%", // Updated to 100% completion
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
    marginLeft: -2,
    marginTop: -2,
  },
  badge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  journeyTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  motivationText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "black",
  },
  summaryCard: {
    width: width - 40,
    backgroundColor: "#F8F8F8",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  goalDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  goalLabel: {
    fontSize: 16,
    color: "#555",
  },
  goalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  boldText: {
    fontWeight: "bold",
    color: "black",
  },
  benefitsSection: {
    width: width - 40,
    marginBottom: 25,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  benefitDot: {
    fontSize: 16,
    marginRight: 8,
    color: "black",
    fontWeight: "bold",
  },
  benefitText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  smallStepsText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  continueButton: {
    backgroundColor: "black",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 10,
    width: width - 80,
    alignItems: "center",
  },
  continueText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default SummaryScreen;
