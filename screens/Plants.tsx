import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PlantStackParamList } from '../navigation/PlantStack';

const API_KEY = 'sk-2V8M689425f03ad9e11730';
const BASE_URL = 'https://perenual.com/api';

type PlantItem = {
  id: number;
  common_name: string;
  scientific_name: string;
  default_image?: {
    original_url: string;
    thumbnail: string;
  } | null;
};

type NavigationProp = NativeStackNavigationProp<PlantStackParamList, 'PlantsScreen'>;

const fetchPlants = async (query: string): Promise<PlantItem[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/species-list`, {
      params: {
        key: API_KEY,
        q: query,
      },
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Perenual API error:', error);
    return [];
  }
};

const PlantsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [plants, setPlants] = useState<PlantItem[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    const getPlants = async () => {
      setLoading(true);
      const searchTerm = query.trim() === '' ? 'tomato' : query;
      const data = await fetchPlants(searchTerm);
      if (isActive) {
        setPlants(data);
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      if (query.length === 0 || query.length >= 3) {
        getPlants();
      }
    }, 500);

    return () => {
      clearTimeout(delayDebounce);
      isActive = false;
    };
  }, [query]);

  const renderItem = ({ item }: { item: PlantItem }) => (
    <TouchableOpacity
      style={styles.plantCard}
      onPress={() => navigation.navigate('PlantDetail', { plantId: item.id })}
    >
      {item.default_image?.thumbnail ? (
        <Image source={{ uri: item.default_image.thumbnail }} style={styles.plantImage} />
      ) : (
        <View style={[styles.plantImage, styles.placeholderImage]}>
          <Text style={{ fontSize: 10, color: '#aaa' }}>No Image</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.common_name || 'Unnamed Plant'}</Text>
        <Text style={styles.scientificName}>{item.scientific_name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a plant..."
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity
            style={styles.clearIconContainer}
            onPress={() => setQuery('')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearIcon}>×</Text>
          </TouchableOpacity>
        )}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#228B22" />
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No plants found.</Text>
          }
        />
      )}
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
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    padding: 10,
    paddingRight: 35, // space for the clear button
    backgroundColor: '#fff',
    borderRadius: 8,
    fontSize: 16,
  },
  clearIconContainer: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    // touch target size
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    fontSize: 22,
    color: '#888',
  },
  plantCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  scientificName: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#3A7717',
    marginTop: 2,
  },
});
