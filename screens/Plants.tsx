import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import { fetchPlants } from '../Api/OpenFarmApi'; 
const PlantsScreen = () => {
  const [plants, setPlants] = useState<PlantItem[]>([]);
  const [query, setQuery] = useState('');


  type PlantItem = {
  id: string;
  attributes: {
  name: string;
  description?: string;
  main_image_path?: string;
  };
  };

  useEffect(() => {
    const getPlants = async () => {
      const data = await fetchPlants(query);
      setPlants(data);
    };

    getPlants();
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a plant..."
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.plantCard}>
            <Text style={styles.name}>{item.attributes.name}</Text>
            <Text style={styles.description}>
              {item.attributes.description || 'No description available.'}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default PlantsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#f4f4f4',
  },
  input: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  plantCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
});
