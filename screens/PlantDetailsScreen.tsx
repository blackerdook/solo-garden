import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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
  default_image?: { original_url: string };
  cone?: boolean;
  leaf?: boolean;
  growth_rate?: string;
  care_level?: string;
};

const DetailSection = ({ title, value, icon }: { title: string; value: string; icon?: string }) => (
  <View style={styles.detailBlock}>
    <View style={styles.detailRow}>
      {icon && <Ionicons name={icon as any} size={18} color="#228B22" style={{ marginRight: 6 }} />}
      <Text style={styles.sectionTitle}>{title}:</Text>
    </View>
    <Text style={styles.sectionValue}>{value}</Text>
  </View>
);

const PlantDetailScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'PlantDetail'>>();
  const navigation = useNavigation();
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Custom back button overlay */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="chevron-back" size={22} color="#111" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <ImageBackground
          source={{ uri: plant.default_image?.original_url }}
          style={styles.headerImage}
          imageStyle={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
        >
          <View style={styles.overlay} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.plantName}>{plant.common_name || 'Unknown Plant'}</Text>
            <Text style={styles.plantSciName}>{plant.scientific_name || 'N/A'}</Text>
          </View>
        </ImageBackground>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          {plant.other_name?.length ? (
            <Text style={styles.altName}>Also Known As: {plant.other_name.join(', ')}</Text>
          ) : null}

          <DetailSection title="Description" value={plant.description || 'No description available.'} />
          <DetailSection title="Cycle" value={plant.cycle || 'N/A'} />
          <DetailSection title="Watering" value={plant.watering || 'N/A'} icon="water-outline" />
          <DetailSection
            title="Sun"
            value={Array.isArray(plant.sunlight) ? plant.sunlight.join(', ') : plant.sunlight || 'N/A'}
            icon="sunny-outline"
          />
          <DetailSection
            title="Hardiness Zone"
            value={`${plant.hardiness?.min || '?'} - ${plant.hardiness?.max || '?'}`}
            icon="thermometer-outline"
          />
          <DetailSection title="Cones" value={plant.cone ? 'Yes' : 'No'} />
          <DetailSection title="Leaf" value={plant.leaf ? 'Yes' : 'No'} />
          <DetailSection title="Growth Rate" value={plant.growth_rate || 'N/A'} />
          <DetailSection title="Care Level" value={plant.care_level || 'N/A'} />
        </View>
      </ScrollView>
    </View>
  );
};

export default PlantDetailScreen;

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    top: Platform.select({ ios: 40, android: 28 }),
    left: 14,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  headerImage: {
    height: 260,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTextContainer: {
    zIndex: 2,
  },
  plantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  plantSciName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#e0e0e0',
    marginTop: 2,
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  altName: {
    fontSize: 14,
    color: '#555',
    marginBottom: 18,
  },
  detailBlock: {
    marginBottom: 18, // More breathing space between sections
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  sectionValue: {
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
  },
});
