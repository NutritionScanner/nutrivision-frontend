// App.tsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { auth } from "./src/firebaseConfig";

export default function App() {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    // Small delay to ensure Firebase is properly initialized
    const initFirebase = async () => {
      try {
        // Wait for Firebase Auth to initialize
        await new Promise((resolve) => setTimeout(resolve, 100));
        setIsFirebaseInitialized(true);
      } catch (error) {
        console.error("Firebase initialization error:", error);
        setIsFirebaseInitialized(true); // Still continue even if there's an error
      }
    };

    initFirebase();
  }, []);

  if (!isFirebaseInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return <AppNavigator />;
}
