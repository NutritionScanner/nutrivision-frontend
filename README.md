### **README.md for NutriVision Frontend**  

```markdown
# 🍏 NutriVision - AI-Powered Nutrition Tracker

NutriVision is a mobile application that helps users track calories and get AI-generated nutritional insights for food items. It leverages **OpenFoodFacts**, **Gemini AI**, and **Hugging Face food detection models** to provide accurate nutrition details.

## 📱 Features

- 📷 **Food Recognition** - Detects food items using AI models.
- 📊 **Nutritional Insights** - Provides AI-generated nutrition summaries.
- 🔍 **Barcode Scanning** - Fetches nutrition details from OpenFoodFacts.
- 🔥 **Calorie Tracking** - Estimates calorie intake for better health management.
- 💡 **AI-Powered Analysis** - Uses Gemini AI for enhanced insights.

---

## 🚀 Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** FastAPI (Python)
- **Database:** Firebase Firestore
- **AI/ML Models:** Hugging Face Models, Gemini AI
- **Third-party APIs:** OpenFoodFacts API

---

## 🤖 AI & ML Models Used

NutriVision uses **Hugging Face models** for food detection:

- 🥦 **Fruits & Vegetables Detection:** [`jazzmacedo/fruits-and-vegetables-detector-36`](https://huggingface.co/jazzmacedo/fruits-and-vegetables-detector-36)
- 🍕 **General Food Item Recognition:** [`nateraw/food`](https://huggingface.co/nateraw/food)

---

## 📥 Installation & Setup

Follow these steps to clone and set up NutriVision on your system.

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/<your-username>/nutrivision-frontend.git
cd nutrivision-frontend
```

### **2️⃣ Install Dependencies**
```sh
yarn install  # or npm install
```

### **3️⃣ Run the Application**
```sh
expo start
```
- **Android:** Scan the QR code in the Expo Go app.
- **iOS:** Use an iOS emulator (Xcode required).

---

## 🔧 Environment Variables

Create a `.env` file in the root directory and add:

```env
API_BASE_URL=https://your-backend-url.com
OPENFOODFACTS_API_KEY=your_api_key
GEMINI_AI_API_KEY=your_api_key
```

> **Note:** Replace `your_api_key` with actual API keys.

---

## 🔗 API Endpoints

The frontend communicates with the **NutriVision Backend** via FastAPI:

- **Packaged Food Nutrition**: `GET /nutrition/{barcode}`
- **Fruit & Vegetable Detection**: `POST /food-detection/fruit-vegetable`
- **General Food Item Detection**: `POST /food-detection/food-item`

---

## 🤝 Contributing

We welcome contributions! Follow these steps to contribute:

### **1️⃣ Fork the Repository**
Click the "Fork" button on GitHub.

### **2️⃣ Clone Your Fork**
```sh
git clone https://github.com/<your-username>/nutrivision-frontend.git
cd nutrivision-frontend
```

### **3️⃣ Create a New Branch**
```sh
git checkout -b feature/new-feature
```

### **4️⃣ Make Changes & Commit**
```sh
git add .
git commit -m "Added new feature"
```

### **5️⃣ Push Changes**
```sh
git push origin feature/new-feature
```

### **6️⃣ Create a Pull Request (PR)**
Go to the original repository and submit a **Pull Request**.

---

## 📜 License

This project is licensed under the MIT License.

---