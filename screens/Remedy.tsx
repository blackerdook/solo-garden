import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type RemedyType = {
  name: string;
  description: string;
  icon: 'leaf-outline' | 'flame-outline' | 'flower-outline' | 'cloud-outline' | 'snow-outline';
};

const remedies: RemedyType[] = [
  {
    name: 'Aloe Vera',
    description: 'Soothes burns and skin irritation.',
    icon: 'leaf-outline',
  },
  {
    name: 'Ginger',
    description: 'Aids digestion and reduces nausea.',
    icon: 'flame-outline',
  },
  {
    name: 'Lavender',
    description: 'Calms anxiety and promotes sleep.',
    icon: 'flower-outline',
  },
  {
    name: 'Chamomile',
    description: 'Helps with sleep and digestion.',
    icon: 'cloud-outline',
  },
  {
    name: 'Peppermint',
    description: 'Relieves headaches and muscle pain.',
    icon: 'snow-outline',
  },
];

const Remedy = () => {
  const [search, setSearch] = useState('');

  const filteredRemedies = remedies.filter((remedy) =>
    remedy.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 Natural Remedies</Text>
      <Text style={styles.subtitle}>Discover the healing power of plants.</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#555" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search remedies..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.cardContainer} showsVerticalScrollIndicator={false}>
        {filteredRemedies.map((item, index) => (
          <View key={index} style={styles.card}>
            <Ionicons name={item.icon} size={30} color="#2a7c4f" />
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardText}>{item.description}</Text>
          </View>
        ))}
        {filteredRemedies.length === 0 && (
          <Text style={styles.noResults}>No remedies found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Remedy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2a7c4f',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  cardContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#2a7c4f',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
    fontStyle: 'italic',
  },
});
