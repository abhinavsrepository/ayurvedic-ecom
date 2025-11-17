import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const doctors = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    specialty: 'Ayurvedic Physician',
    experience: '15 years',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Dr. Rajesh Kumar',
    specialty: 'Panchakarma Specialist',
    experience: '20 years',
    rating: 4.9,
  },
];

export default function ConsultScreen() {
  return (
    <ScrollView style={styles.container}>
      {doctors.map((doctor) => (
        <View key={doctor.id} style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👨‍⚕️</Text>
          </View>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <Text style={styles.experience}>{doctor.experience} experience</Text>
          <Text style={styles.rating}>⭐ {doctor.rating}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Book Consultation</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#10b981',
    marginBottom: 4,
  },
  experience: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
