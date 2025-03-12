import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  CurrentWeightScreen: undefined;
  GoalWeightScreen: { currentWeight: number; goalWeight: number };
  WeightChangeSpeedScreen:undefined;
};

type GoalWeightScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GoalWeightScreen'
>;

interface GoalWeightScreenProps {
  route: {
    params: {
      currentWeight: number;
    };
  };
}

const GoalWeightScreen: React.FC<GoalWeightScreenProps> = ({ route }) => {
  const navigation = useNavigation<GoalWeightScreenNavigationProp>();
  const { currentWeight } = route.params;
  const [goalWeight, setGoalWeight] = useState<number>(currentWeight);
  const [modalVisible, setModalVisible] = useState(false);
  const [weightChangeMessage, setWeightChangeMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#000000');

  // Generate weight options (range around current weight)
  const minWeight = Math.max(80, currentWeight - 50); // Don't go below 80 lbs
  const maxWeight = currentWeight + 50;
  const weightOptions = Array.from(
    { length: maxWeight - minWeight + 1 },
    (_, i) => minWeight + i
  );

  useEffect(() => {
    updateWeightChangeMessage();
  }, [goalWeight]);

  const updateWeightChangeMessage = () => {
    const weightDifference = goalWeight - currentWeight;
    
    if (weightDifference === 0) {
      setWeightChangeMessage('You will maintain your current weight');
      setMessageColor('#000000'); // Black for maintenance
    } else if (weightDifference > 0) {
      setWeightChangeMessage(`You will gain ${weightDifference} lbs`);
      setMessageColor('#4CAF50'); // Green for gain
    } else {
      setWeightChangeMessage(`You will lose ${Math.abs(weightDifference)} lbs`);
      setMessageColor('#F44336'); // Red for loss
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const selectWeight = (weight: number) => {
    setGoalWeight(weight);
    setModalVisible(false);
  };

  const handleContinue = () => {
    navigation.navigate("WeightChangeSpeedScreen");
  };

  return (
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
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>What's your goal weight?</Text>

      {/* Weight Change Message */}
      <Text style={[styles.weightChangeText, { color: messageColor }]}>
        {weightChangeMessage}
      </Text>

      {/* Weight Selection */}
      <TouchableOpacity
        style={styles.weightSelector}
        onPress={toggleModal}
        activeOpacity={0.7}
      >
        <Text style={styles.weightText}>{goalWeight} lbs</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      {/* Weight Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleModal}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={weightOptions}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    goalWeight === item && styles.selectedOption,
                  ]}
                  onPress={() => selectWeight(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      goalWeight === item && styles.selectedOptionText,
                    ]}
                  >
                    {item} lbs
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.listContent}
              initialScrollIndex={weightOptions.findIndex(w => w === goalWeight)}
              getItemLayout={(data, index) => ({
                length: 50,
                offset: 50 * index,
                index,
              })}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Continue Button */}
      <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  progressBar: {
    height: 16,
    backgroundColor: '#F5F5F5',
    flex: 1,
    borderRadius: 8,
    marginLeft: 15,
    justifyContent: 'center',
  },
  progress: {
    width: '70%', // Adjust based on your flow's progress
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 8,
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: 'white',
    fontSize: 20,
    marginLeft: -2,
    marginTop: -2,
  },
  title: {
    color: 'black',
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 100,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  weightChangeText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontWeight: '500',
  },
  weightSelector: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightText: {
    fontSize: 20,
    color: 'black',
  },
  dropdownArrow: {
    fontSize: 16,
    color: 'gray',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    maxHeight: height * 0.6,
    padding: 10,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedOption: {
    backgroundColor: '#F8F8F8',
  },
  optionText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  continueButton: {
    marginTop: 60,
    padding: 22,
    backgroundColor: 'black',
    borderRadius: 50,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GoalWeightScreen;