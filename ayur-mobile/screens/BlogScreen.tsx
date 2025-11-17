import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const articles = [
  {
    id: 1,
    title: 'Understanding Your Dosha Type',
    category: 'Basics',
    readTime: '5 min',
  },
  {
    id: 2,
    title: 'Morning Ayurvedic Rituals',
    category: 'Lifestyle',
    readTime: '7 min',
  },
  {
    id: 3,
    title: 'Seasonal Eating Guide',
    category: 'Nutrition',
    readTime: '10 min',
  },
];

export default function BlogScreen() {
  return (
    <ScrollView style={styles.container}>
      {articles.map((article) => (
        <TouchableOpacity key={article.id} style={styles.card}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>📚</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.category}>{article.category}</Text>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.readTime}>{article.readTime} read</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 60,
  },
  content: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  readTime: {
    fontSize: 12,
    color: '#6b7280',
  },
});
