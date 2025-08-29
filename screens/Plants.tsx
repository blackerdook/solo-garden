import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Platform,
  RefreshControl,
  Animated,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PlantStackParamList } from '../navigation/PlantStack';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = 'sk-2V8M689425f03ad9e11730';
const BASE_URL = 'https://perenual.com/api';

type PlantItem = {
  id: number;
  common_name: string;
  scientific_name: string;
  default_image?: { original_url: string; thumbnail: string } | null;
};

type NavigationProp = NativeStackNavigationProp<PlantStackParamList, 'PlantsScreen'>;

const SP = 14;
const RAD = 16;
const ACCENT = '#2a7c4f';
const BG = '#F6F8F7';
const INK = '#0F1A14';
const MUTED = '#6F7B74';

const fetchPlants = async (query: string): Promise<PlantItem[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/species-list`, {
      params: { key: API_KEY, q: query },
    });
    return response.data?.data ?? [];
  } catch (error) {
    console.error('Perenual API error:', error);
    return [];
  }
};

const PlantsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [plants, setPlants] = useState<PlantItem[]>([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'az' | 'za'>('az');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headerSubtitle = useMemo(
    () => (query.trim() ? `Results for “${query.trim()}”` : 'Trending now'),
    [query]
  );

  // subtle skeleton shimmer
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  const load = async (term: string, isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError(null);
    const searchTerm = term.trim() === '' ? 'tomato' : term;
    const data = await fetchPlants(searchTerm);
    if (data.length === 0 && searchTerm.length >= 3) setError('Nothing matched your search.');
    setPlants(data);
    setLoading(false);
    setRefreshing(false);
  };

  // initial + debounced search
  useEffect(() => {
    let isActive = true;
    const t = setTimeout(() => {
      if (query.length === 0 || query.length >= 3) isActive && load(query);
    }, 450);
    return () => {
      isActive = false;
      clearTimeout(t);
    };
  }, [query]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load(query, true);
  };

  const filtered = useMemo(() => {
    const list = [...plants];
    return list.sort((a, b) =>
      sort === 'az'
        ? (a.common_name || '').localeCompare(b.common_name || '')
        : (b.common_name || '').localeCompare(a.common_name || '')
    );
  }, [plants, sort]);

  const renderItem = ({ item }: { item: PlantItem }) => (
    <Pressable
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
      onPress={() => navigation.navigate('PlantDetail', { plantId: item.id })}
      android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
      accessibilityRole="button"
      accessibilityLabel={`${item.common_name ?? 'Unnamed plant'} • ${item.scientific_name}`}
    >
      {item.default_image?.thumbnail ? (
        <Image source={{ uri: item.default_image.thumbnail }} style={styles.tileImg} />
      ) : (
        <View style={[styles.tileImg, styles.placeholder]}>
          <Ionicons name="leaf-outline" size={28} color="#96A39B" />
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      )}

      <View style={styles.overlay} />
      <View style={styles.meta}>
        <Text numberOfLines={1} style={styles.commonName}>
          {item.common_name || 'Unnamed Plant'}
        </Text>
        <Text numberOfLines={1} style={styles.scientificName}>
          {item.scientific_name}
        </Text>
      </View>
    </Pressable>
  );

  const renderSkeleton = () => (
    <View style={{ paddingHorizontal: SP }}>
      <View style={styles.skeletonRow}>
        {Array.from({ length: 2 }).map((_, i) => (
          <Animated.View key={i} style={[styles.skeletonCard, { opacity: pulse }]} />
        ))}
      </View>
      <View style={styles.skeletonRow}>
        {Array.from({ length: 2 }).map((_, i) => (
          <Animated.View key={`b-${i}`} style={[styles.skeletonCard, { opacity: pulse }]} />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Decorative blobs */}
      <View style={styles.blobTop} pointerEvents="none" />
      <View style={styles.blobRight} pointerEvents="none" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🌱 Discover plants</Text>
        <Text style={styles.subtitle}>
          {headerSubtitle} • {filtered.length} found
        </Text>
      </View>

      {/* Tools: search + sort only */}
      <View style={styles.tools}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color="#7B8A84" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search by name…"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            placeholderTextColor="#97A59E"
          />
          {query.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={20} color="#9a9a9a" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sortRow}>
          <Pressable onPress={() => setSort((s) => (s === 'az' ? 'za' : 'az'))} style={styles.sortBtn}>
            <Ionicons name={sort === 'az' ? 'arrow-down' : 'arrow-up'} size={14} color={ACCENT} />
            <Text style={styles.sortBtnText}>{sort === 'az' ? 'A–Z' : 'Z–A'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Results */}
      {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ gap: SP }}
          contentContainerStyle={{ paddingHorizontal: SP, paddingBottom: SP * 2, gap: SP }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ACCENT} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="leaf-outline" size={40} color="#AEB8B2" />
              <Text style={styles.emptyText}>{error ? 'No plants found' : 'Nothing here yet'}</Text>
              <Text style={styles.emptySub}>
                {error ? 'Try a broader term.' : 'Search for a plant to get started.'}
              </Text>
              {query.length > 0 && (
                <Pressable style={styles.clearAllBtn} onPress={() => setQuery('')}>
                  <Text style={styles.clearAllText}>Clear search</Text>
                </Pressable>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default PlantsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  blobTop: {
    position: 'absolute',
    top: -70, left: -40,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#E7F1EC', opacity: 0.9,
  },
  blobRight: {
    position: 'absolute',
    top: 120, right: -60,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: '#F0FAF3', opacity: 0.8,
  },

  header: { paddingHorizontal: SP, paddingTop: 8, paddingBottom: 6 },
  title: { fontSize: 26, fontWeight: '900', color: ACCENT, letterSpacing: 0.2 },
  subtitle: { marginTop: 2, fontSize: 12.5, color: MUTED },

  tools: { paddingHorizontal: SP, gap: 10 },

  searchWrap: {
    backgroundColor: '#fff',
    borderRadius: 14,
    height: 48,
    paddingLeft: 38,
    paddingRight: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3ECE6',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 1 },
    }),
  },
  searchIcon: { position: 'absolute', left: 12, top: 14 },
  input: { fontSize: 16, color: INK },
  clearBtn: { position: 'absolute', right: 10, top: 12 },

  // Sort only (chips removed)
  sortRow: { alignItems: 'flex-end' },
  sortBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    height: 34, paddingHorizontal: 12, borderRadius: 10,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E3ECE6', marginBottom: 6,
  },
  sortBtnText: { fontSize: 12.5, fontWeight: '900', color: ACCENT, letterSpacing: 0.3 },

  // grid tiles
  tile: {
    flex: 1,
    borderRadius: RAD,
    overflow: 'hidden',
    backgroundColor: '#E9EFEA',
    height: 200,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 },
    }),
  },
  tilePressed: { opacity: 0.96, transform: [{ scale: 0.997 }] },
  tileImg: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F2F5F3' },
  placeholderText: { fontSize: 12, color: '#96A39B' },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.20)' },
  meta: { position: 'absolute', left: 10, right: 10, bottom: 8 },
  commonName: { color: '#fff', fontWeight: '900', fontSize: 14.5, letterSpacing: 0.2 },
  scientificName: { color: '#EAF2EE', fontSize: 12, fontStyle: 'italic', marginTop: 1 },

  // skeletons
  skeletonRow: { flexDirection: 'row', gap: SP, marginBottom: SP },
  skeletonCard: { flex: 1, height: 200, borderRadius: RAD, backgroundColor: '#E7EFEA', marginTop: SP },

  // states
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 8 },
  emptyText: { fontSize: 15, fontWeight: '900', color: '#3B4B44' },
  emptySub: { fontSize: 12.5, color: '#82918A' },
  clearAllBtn: {
    marginTop: 6, paddingHorizontal: 12, height: 32, borderRadius: 999,
    backgroundColor: '#EAF5EF', alignItems: 'center', justifyContent: 'center',
  },
  clearAllText: { color: ACCENT, fontWeight: '900' },
});
