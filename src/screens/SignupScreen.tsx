import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  UserCredential,
  User,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { StackNavigationProp } from "@react-navigation/stack";
import { useGoogleAuth } from "../utils/googleAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createUser} from "../api/api"


export type RootStackParamList = {
  Home: undefined;
  BarcodeScanner: undefined;
  FoodDetection: undefined;
  FruitVegetableDetection: undefined;
  Login: undefined;
  Signup: undefined;
};

type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Signup"
>;

type Props = {
  navigation: SignupScreenNavigationProp;
};

// Define the return type from Google Auth
interface GoogleAuthResult {
  user: User;
  // Add any other properties returned by handleGoogleSignIn if needed
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Google Sign-In hook
  const { promptAsync, handleGoogleSignIn, response } = useGoogleAuth();

  // When the Google auth response updates, try signing in
  useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type === "success") {
        setLoading(true);
        try {
          // Cast the result to the expected type
          const result = (await handleGoogleSignIn()) as unknown as GoogleAuthResult;

          // Now TypeScript knows the structure of result
          if (result && result.user) {
            const { user } = result;

            // Save user data to Firestore
            await saveUserToMongoDB({
              uid: user.uid,
              email: user.email || "",
              name: user.displayName || "",
              photoUrl: user.photoURL || "",
              authProvider: "google",
            });

            navigation.navigate("Home");
          } else {
            Alert.alert(
              "Google Sign-In Error",
              "Unable to sign in with Google."
            );
          }
        } catch (error) {
          console.error("Google sign-in error:", error);
          Alert.alert("Error", "An error occurred during Google sign-in.");
        } finally {
          setLoading(false);
        }
      }
    };
    signInWithGoogle();
  }, [response]);

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    if (text.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      setPasswordError("");
    }
  };

  // Function to save user data to Firestore
  const saveUserToMongoDB = async (userData: {
    uid: string;
    email: string;
    name: string;
    photoUrl?: string;
    authProvider: string;
  }) => {
    try {
      // Fetch all additional user data from AsyncStorage
      const [
        gender,
        age,
        height,
        heightImperial,
        currentWeight,
        goalWeight,
        goalType,
        weightDifference,
        weightChangeSpeed,
      ] = await Promise.all([
        AsyncStorage.getItem("gender"),
        AsyncStorage.getItem("age"),
        AsyncStorage.getItem("height"),
        AsyncStorage.getItem("heightImperial"),
        AsyncStorage.getItem("currentWeight"),
        AsyncStorage.getItem("goalWeight"),
        AsyncStorage.getItem("goalType"),
        AsyncStorage.getItem("weightDifference"),
        AsyncStorage.getItem("weightChangeSpeed"),
      ]);

      // Parse numerical values
      const parsedAge = age ? parseInt(age, 10) : null;
      const parsedHeight = height ? parseFloat(height) : null;
      const parsedHeightImperial = heightImperial
        ? JSON.parse(heightImperial)
        : null;
      const parsedCurrentWeight = currentWeight
        ? parseFloat(currentWeight)
        : null;
      const parsedGoalWeight = goalWeight ? parseFloat(goalWeight) : null;
      const parsedWeightDifference = weightDifference
        ? parseFloat(weightDifference)
        : null;
      const parsedWeightChangeSpeed = weightChangeSpeed
        ? parseFloat(weightChangeSpeed)
        : null;

      // Create complete user object
      const completeUserData = {
        ...userData,
        gender: gender || null,
        age: parsedAge,
        height: parsedHeight,
        heightImperial: parsedHeightImperial,
        currentWeight: parsedCurrentWeight,
        goalWeight: parsedGoalWeight,
        goalType: goalType || null,
        weightDifference: parsedWeightDifference,
        weightChangeSpeed: parsedWeightChangeSpeed,
        createdAt: new Date(),
      };




      console.log("User saved to Firestore:", userData.uid);
      return userData.uid;
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
      throw error;
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !name) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (emailError || passwordError) return; // Prevent signup if validation errors exist

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data to Firestore
      // Replace the existing saveUserToMongoDB function with:
      const saveUserToMongoDB = async (userData: {
        uid: string;
        email: string;
        name: string;
        photoUrl?: string;
        authProvider: string;
      }) => {
        try {
          // Fetch additional data from AsyncStorage
          const [
            gender,
            age,
            height,
            heightImperial,
            currentWeight,
            goalWeight,
            goalType,
            weightDifference,
            weightChangeSpeed,
          ] = await Promise.all([
            AsyncStorage.getItem("gender"),
            AsyncStorage.getItem("age"),
            AsyncStorage.getItem("height"),
            AsyncStorage.getItem("heightImperial"),
            AsyncStorage.getItem("currentWeight"),
            AsyncStorage.getItem("goalWeight"),
            AsyncStorage.getItem("goalType"),
            AsyncStorage.getItem("weightDifference"),
            AsyncStorage.getItem("weightChangeSpeed"),
          ]);

          // Create complete user object
          const completeUserData = {
            ...userData,
            metrics: {
              gender: gender || null,
              age: age ? parseInt(age, 10) : null,
              height: height ? parseFloat(height) : null,
              heightImperial: heightImperial
                ? JSON.parse(heightImperial)
                : null,
              currentWeight: currentWeight ? parseFloat(currentWeight) : null,
              goalWeight: goalWeight ? parseFloat(goalWeight) : null,
              goalType: goalType || null,
              weightDifference: weightDifference
                ? parseFloat(weightDifference)
                : null,
              weightChangeSpeed: weightChangeSpeed
                ? parseFloat(weightChangeSpeed)
                : null,
            },
            createdAt: new Date().toISOString(),
          };

          // Call your MongoDB API
          await createUser(completeUserData);
          console.log("User saved to MongoDB");
          return userData.uid;
        } catch (error) {
          console.error("Error saving user:", error);
          throw error;
        }
      };

      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>{"<"}</Text>
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Enter your details to get started
            </Text>
          </View>

          {/* Name field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Full Name<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Email field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Email<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="you@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={validateEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          {/* Password field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Password<Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  passwordError ? styles.inputError : null,
                ]}
                placeholder="Create a password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={validatePassword}
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Text style={styles.eyeIconText}>
                  {passwordVisible ? "👁️" : "👁️‍🗨️"}
                </Text>
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          {/* Confirm Password field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Confirm Password<Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!confirmPasswordVisible}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                <Text style={styles.eyeIconText}>
                  {confirmPasswordVisible ? "👁️" : "👁️‍🗨️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={loading}
          >
            <View style={styles.googleButtonContent}>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
    paddingTop: 60, // Add extra padding at the top for the back button
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
    marginBottom: 8,
  },
  required: {
    color: "black",
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "black",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    height: 50,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "black",
    flex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
  },
  eyeIconText: {
    fontSize: 18,
  },
  inputError: {
    borderColor: "black",
    borderWidth: 2,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "black",
    fontWeight: "500",
  },
  signupButton: {
    backgroundColor: "black",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signupButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#666",
  },
  googleButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleButtonText: {
    fontSize: 16,
    color: "black",
    fontWeight: "500",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default SignupScreen;
