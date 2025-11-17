import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

const questions = [
  {
    id: 1,
    text: 'My body frame is:',
    options: ['Thin, light', 'Medium', 'Large, heavy'],
  },
  {
    id: 2,
    text: 'My skin is generally:',
    options: ['Dry, rough', 'Warm, oily', 'Cool, moist'],
  },
  {
    id: 3,
    text: 'My sleep pattern:',
    options: ['Light, interrupted', 'Sound, moderate', 'Deep, long'],
  },
  {
    id: 4,
    text: 'Under stress I:',
    options: ['Become anxious', 'Become irritable', 'Withdraw'],
  },
  {
    id: 5,
    text: 'My appetite is:',
    options: ['Variable', 'Strong', 'Steady'],
  },
];

export default function QuizScreen({ navigation }: any) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate dosha
      const vata = newAnswers.filter((a) => a === 0).length;
      const pitta = newAnswers.filter((a) => a === 1).length;
      const kapha = newAnswers.filter((a) => a === 2).length;

      let dominant = 'Vata';
      if (pitta > vata && pitta > kapha) dominant = 'Pitta';
      if (kapha > vata && kapha > pitta) dominant = 'Kapha';

      Alert.alert(
        'Your Dosha Type',
        `Dominant: ${dominant}\n\nVata: ${vata}\nPitta: ${pitta}\nKapha: ${kapha}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  const question = questions[currentQ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progress}>
        <Text style={styles.progressText}>
          Question {currentQ + 1} of {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQ + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>{question.text}</Text>

        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => handleAnswer(index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  progress: {
    padding: 20,
    backgroundColor: '#fff',
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  card: {
    margin: 16,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    color: '#111827',
  },
  option: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
});
