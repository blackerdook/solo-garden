import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';


type TaskItemProps = { task: string };

const HomeScreen = () => {
  const username = 'jhon doe';
  const xp = 1280;
  const rank = 'Sprout';
  const totalPlants = 12;
  const xpProgress = 0.64;

  const TaskItem = ({ task }: TaskItemProps) => (
    <Text style={styles.cardItem}>• {task}</Text>
  );

  return (
    <ImageBackground
  source={require('../assets/bg1.jpg')} 
  style={styles.background}
  resizeMode="cover"
>
  <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>👋 Welcome back, {username}!</Text>

      {/* Garden Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌱 Your Garden Stats</Text>
        <Text style={styles.cardItem}>• Total Plants: {totalPlants}</Text>
        <Text style={styles.cardItem}>
          • Rank: <Text style={styles.badge}>{rank}</Text>
        </Text>
        <Text style={styles.cardItem}>• XP: {xp}</Text>

        {/* Progress Bar */}
        <View style={styles.customProgressBar}>
          <View style={[styles.filledProgress, { width: `${xpProgress * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {Math.round(xpProgress * 100)}% to next rank
        </Text>
      </View>

      {/* Today's Tasks */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Today’s Tasks</Text>
        <TaskItem task="Water Aloe Vera" />
        <TaskItem task="Harvest Basil Leaves" />
        <TaskItem task="Repot the Snake Plant" />
        <TouchableOpacity style={styles.doneButton}>
          <Text style={styles.doneButtonText}>✓ Mark All as Done</Text>
        </TouchableOpacity>
      </View>

      {/* Journal Highlights */}
      <View style={[styles.card, styles.journalCard]}>
        <Text style={styles.cardTitle}>📖 Journal Highlights</Text>
        <Text style={styles.cardItem}>• “Lavender bloomed today 🌸”</Text>
        <Text style={styles.cardItem}>• “Cilantro sprouting 🌿”</Text>
        <TouchableOpacity>
          <Text style={styles.link}>→ View Full Journal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </BlurView>
</ImageBackground>

  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2e7d32',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  journalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1b5e20',
  },
  cardItem: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#dcedc8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
    fontWeight: '600',
    color: '#558b2f',
  },
  doneButton: {
    marginTop: 14,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#1e88e5',
    marginTop: 14,
    fontWeight: '500',
    fontSize: 16,
  },
  progressBar: {
    marginTop: 10,
    height: 10,
  },
  progressLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },
  customProgressBar: {
  width: '100%',
  height: 10,
  backgroundColor: '#c8e6c9',
  borderRadius: 5,
  overflow: 'hidden',
  marginTop: 10,
},
filledProgress: {
  height: '100%',
  backgroundColor: '#4CAF50',
}

});
