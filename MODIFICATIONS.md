Modifications & Additions
1️⃣ Add Gender Selection Screen
📌 File: src/screens/GenderSelectionScreen.tsx
This screen allows users to pick Male, Female, or Other with a confirm button.

2️⃣ Add Age Selection Screen
📌 File: src/screens/AgeSelectionScreen.tsx
Users will enter their age and proceed.

3️⃣ Add Height Selection Screen
📌 File: src/screens/HeightSelectionScreen.tsx
Users will select height using a toggle switch (Imperial / Metric).

4️⃣ Add Current Weight Selection Screen
📌 File: src/screens/CurrentWeightScreen.tsx
Users will enter their current weight (lbs/kg).

5️⃣ Add Goal Weight Selection Screen
📌 File: src/screens/GoalWeightScreen.tsx
Users will enter their goal weight, and we display a gain/loss message dynamically.

6️⃣ Add Weight Change Speed Selection Screen
📌 File: src/screens/WeightChangeSpeedScreen.tsx
Users pick weight change speed (0.1lbs/week to 4lbs/week).

7️⃣ Add Summary Confirmation Screen
📌 File: src/screens/SummaryScreen.tsx
Displays a summary of selections before moving to HomeScreen.

Navigation Setup
📌 Modify: src/navigation/AppNavigator.tsx
Add new screens to your navigation stack.

Global Styles
📌 Modify: src/styles/globalStyles.ts
Define button styles, text styles, and progress bar styles.