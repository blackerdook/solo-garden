import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';

const API_KEY = 'sk-2V8M689425f03ad9e11730';
const BASE_URL = 'https://perenual.com/api';

type RouteParams = {
  PlantDetail: {
    plantId: number;
  };
};

type PlantDetail = {
  common_name?: string;
  scientific_name?: string;
  other_name?: string[];
  description?: string;
  watering?: string;
  sunlight?: string[] | string;
  cycle?: string;
  hardiness?: { min: string; max: string };
  default_image?: {
    original_url: string;
  };
  cone?: boolean;
  leaf?: boolean;
  growth_rate?: string;
  care_level?: string;
};

const PlantDetailScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'PlantDetail'>>();
  const { plantId } = route.params;

  const [plant, setPlant] = useState<PlantDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlantDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/species/details/${plantId}`, {
          params: { key: API_KEY },
        });
        setPlant(response.data);
      } catch (err) {
        console.error('Plant detail fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetail();
  }, [plantId]);

  if (loading || !plant) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {plant.default_image?.original_url && (
        <Image source={{ uri: plant.default_image.original_url }} style={styles.image} />
      )}
      <Text style={styles.title}>{plant.common_name || 'Unknown Plant'}</Text>
      <Text style={styles.subtitle}>{plant.scientific_name || 'N/A'}</Text>
      <Text style={styles.text}>
        Also Known As: {plant.other_name?.length ? plant.other_name.join(', ') : 'N/A'}
      </Text>

      <Text style={styles.sectionTitle}>Description:</Text>
      <Text style={styles.text}>{plant.description || 'No description available.'}</Text>

      <Text style={styles.sectionTitle}>Cycle:</Text>
      <Text style={styles.text}>{plant.cycle || 'N/A'}</Text>

      <Text style={styles.sectionTitle}>Watering:</Text>
      <Text style={styles.text}>{plant.watering || 'N/A'}</Text>

      <Text style={styles.sectionTitle}>Sun:</Text>
      <Text style={styles.text}>
        {Array.isArray(plant.sunlight) ? plant.sunlight.join(', ') : plant.sunlight || 'N/A'}
      </Text>

      <Text style={styles.sectionTitle}>Hardiness Zone:</Text>
      <Text style={styles.text}>
        {plant.hardiness?.min || '?'} - {plant.hardiness?.max || '?'}
      </Text>

      <Text style={styles.sectionTitle}>Cones:</Text>
      <Text style={styles.text}>{plant.cone ? 'Yes' : 'No'}</Text>

      <Text style={styles.sectionTitle}>Leaf:</Text>
      <Text style={styles.text}>{plant.leaf ? 'Yes' : 'No'}</Text>

      <Text style={styles.sectionTitle}>Growth Rate:</Text>
      <Text style={styles.text}>{plant.growth_rate || 'N/A'}</Text>

      <Text style={styles.sectionTitle}>Care Level:</Text>
      <Text style={styles.text}>{plant.care_level || 'N/A'}</Text>
    </ScrollView>
  );
};

export default PlantDetailScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 14,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    marginTop: 4,
  },
});
