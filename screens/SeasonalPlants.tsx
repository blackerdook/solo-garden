// screens/SeasonalPlants.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabase'; // assumes you export a Supabase client from this path

/* === Theme tokens === */
const SP = 16;
const ACCENT = '#2a7c4f';
const BG = '#F6F8F7';
const CARD = '#FFFFFF';
const INK = '#0F1A14';
const MUTED = '#6E7B73';

type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

type Guide = {
  sow: string;
  position: string;
  spacing: string;
  soil: string;
  water: string;
  feed: string;
  pests: string;
  harvest: string;
  notes?: string;
};

type PlantRow = {
  id: string;
  name: string;
  season: Season;
  image_url: string | null;
  summary: string;
  guide: Guide; // jsonb in Supabase
};

const SEASONS: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];

export default function SeasonalPlants() {
  const nav = useNavigation<any>();
  const [season, setSeason] = useState<Season>('Spring');
  const [search, setSearch] = useState('');
  const [plants, setPlants] = useState<PlantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PlantRow | null>(null);

  // simple debounce to avoid spamming queries as user types
  const searchRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      fetchPlants(false).catch(() => {});
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season, search]);

  useEffect(() => {
    fetchPlants(false).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPlants = async (isRefresh: boolean) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      // Build filters: by season + optional search across name/summary
      const term = search.trim();
      let query = supabase
        .from('seasonal_plants')
        .select('id, name, season, image_url, summary, guide')
        .eq('season', season)
        .order('name', { ascending: true });

      if (term.length > 0) {
        // Search in name OR summary (case-insensitive)
        query = query.or(
          `name.ilike.%${term}%,summary.ilike.%${term}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      // Defender: ensure guide object shape
      const safe = (data ?? []).map((row: any) => ({
        ...row,
        guide: {
          sow: row?.guide?.sow ?? '',
          position: row?.guide?.position ?? '',
          spacing: row?.guide?.spacing ?? '',
          soil: row?.guide?.soil ?? '',
          water: row?.guide?.water ?? '',
          feed: row?.guide?.feed ?? '',
          pests: row?.guide?.pests ?? '',
          harvest: row?.guide?.harvest ?? '',
          notes: row?.guide?.notes ?? '',
        } as Guide,
      })) as PlantRow[];

      setPlants(safe);
    } catch (e: any) {
      console.error('seasonal_plants fetch error', e);
      setError(e?.message ?? 'Failed to load plants');
      if (__DEV__) Alert.alert('Error', e?.message ?? String(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => fetchPlants(true);

  // Client-side extra filter (keeps UI snappy if you want chip/tag filters later)
  const list = useMemo(() => plants, [plants]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* Soft blobs */}
        <View style={styles.blobTop} pointerEvents="none" />
        <View style={styles.blobMid} pointerEvents="none" />

        <ScrollView
          contentContainerStyle={{ paddingBottom: SP * 2 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header + Back */}
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => nav.goBack()}
              style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.85 }]}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color={ACCENT} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Seasonal Plants</Text>
              <Text style={styles.subtitle}>What to grow now in Aotearoa NZ</Text>
            </View>
          </View>

          {/* Season chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {SEASONS.map(s => {
              const active = season === s;
              return (
                <Pressable
                  key={s}
                  onPress={() => setSeason(s)}
                  style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && { opacity: 0.92 }]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{s}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Search */}
          <View style={styles.searchWrap}>
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${season.toLowerCase()} plants…`}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              placeholderTextColor="#9AA3A7"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} style={styles.clearBtn} hitSlop={8}>
                <Text style={{ fontSize: 16, color: '#7C8A80' }}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Content */}
          <View style={{ gap: 10, paddingHorizontal: SP, marginTop: 8 }}>
            {loading && plants.length === 0 ? (
              <View style={styles.center}><ActivityIndicator size="large" /></View>
            ) : error ? (
              <View style={styles.center}>
                <Text style={styles.errText}>Error: {error}</Text>
                <Pressable onPress={onRefresh} style={[styles.sortBtn, { marginTop: 10 }]}>
                  <Text style={styles.sortBtnText}>Retry</Text>
                </Pressable>
              </View>
            ) : list.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.noResults}>No plants found</Text>
                <Text style={styles.noResultsSub}>Try another term or season.</Text>
              </View>
            ) : (
              list.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => setSelected(p)}
                  style={({ pressed }) => [styles.card, pressed && { opacity: 0.98, transform: [{ scale: 0.997 }] }]}
                  accessibilityRole="button"
                  accessibilityLabel={`${p.name}. ${p.summary}`}
                >
                  {/* Blank image placeholder (swap with <Image> later if you add URLs) */}
                  <View style={styles.thumbWrap}>
                    <View style={[styles.thumb, { backgroundColor: '#EAF5EF' }]} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{p.name}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>{p.summary}</Text>
                  </View>

                  <Text style={styles.chev}>{'›'}</Text>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>

        {/* Popup sheet with detailed growing guide */}
        {selected && (
          <Pressable style={styles.backdrop} onPress={() => setSelected(null)}>
            <Pressable style={styles.sheet} onPress={() => {}}>
              <View style={styles.grabber} />
              {/* Image placeholder in sheet */}
              <View style={styles.sheetHeader}>
                <View style={[styles.sheetThumb, { backgroundColor: '#EAF5EF' }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetTitle}>{selected.name}</Text>
                  <Text style={styles.sheetSubtitle}>{selected.season} · NZ growing guide</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <GuideRow label="Sow / Plant" value={selected.guide.sow} />
              <GuideRow label="Position / Sun" value={selected.guide.position} />
              <GuideRow label="Spacing" value={selected.guide.spacing} />
              <GuideRow label="Soil" value={selected.guide.soil} />
              <GuideRow label="Watering" value={selected.guide.water} />
              <GuideRow label="Feeding" value={selected.guide.feed} />
              <GuideRow label="Pests & Diseases" value={selected.guide.pests} />
              <GuideRow label="Harvest" value={selected.guide.harvest} />
              {selected.guide.notes ? <GuideRow label="Notes" value={selected.guide.notes} /> : null}

              <Pressable style={styles.primaryBtn} onPress={() => setSelected(null)}>
                <Text style={styles.primaryBtnText}>Close</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

/* ---------- small components ---------- */
function GuideRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  root: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32 },
  errText: { color: '#C1111E', fontWeight: '800' },

  // blobs
  blobTop: {
    position: 'absolute',
    top: -80, left: -40,
    width: 220, height: 220,
    borderRadius: 110,
    backgroundColor: '#E6F2EA',
    opacity: 0.85,
  },
  blobMid: {
    position: 'absolute',
    top: 120, right: -60,
    width: 180, height: 180,
    borderRadius: 90,
    backgroundColor: '#F0FAF3',
    opacity: 0.75,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SP,
    paddingTop: 6,
    paddingBottom: 4,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7E7DE',
    backgroundColor: '#EAF5EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  title: { fontSize: 26, fontWeight: '800', color: ACCENT, letterSpacing: 0.2 },
  subtitle: { fontSize: 13.5, color: MUTED, marginTop: 2 },

  chipsRow: { paddingHorizontal: SP, paddingVertical: 8 },
  chip: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#EAF5EF',
    borderWidth: 1,
    borderColor: '#D7E7DE',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  chipText: { fontSize: 13, color: '#2E5141', fontWeight: '700' },
  chipTextActive: { color: '#fff' },

  searchWrap: {
    height: 48,
    backgroundColor: CARD,
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5EEE8',
    marginHorizontal: SP,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 1 },
    }),
  },
  searchInput: { fontSize: 16, color: INK },
  clearBtn: { position: 'absolute', right: 12, top: 12 },

  // cards
  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E7EFEA',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
      android: { elevation: 2 },
    }),
  },
  thumbWrap: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#EAF5EF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumb: { width: '100%', height: '100%' },
  cardTitle: { fontSize: 16.5, fontWeight: '800', color: INK },
  cardDesc: { fontSize: 13.5, color: MUTED, marginTop: 2, maxWidth: '92%' },
  chev: { fontSize: 28, color: '#9a9a9a', paddingHorizontal: 4, lineHeight: 28 },

  emptyWrap: { alignItems: 'center', marginTop: 36, gap: 8 },
  noResults: { color: '#5F6B66', fontSize: 15, fontWeight: '800' },
  noResultsSub: { color: '#92A29A', fontSize: 13 },

  // popup sheet
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 1000,
    ...Platform.select({ android: { elevation: 50 } }),
  },
  sheet: {
    width: '100%',
    backgroundColor: CARD,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: SP,
    paddingBottom: SP + 12,
    borderWidth: 1,
    borderColor: '#E7EFEA',
    zIndex: 1001,
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDE7E2',
    marginBottom: 10,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  sheetThumb: { width: 120, height: 120, borderRadius: 14, backgroundColor: '#EAF5EF' },
  sheetTitle: { fontSize: 20, fontWeight: '900', color: INK, letterSpacing: 0.2 },
  sheetSubtitle: { fontSize: 13.5, color: MUTED, marginTop: 2 },

  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#E6EEE9', marginVertical: 12 },

  infoLabel: {
    fontSize: 12.5,
    fontWeight: '900',
    color: ACCENT,
    marginBottom: 4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  infoValue: { fontSize: 15, color: '#21372D', lineHeight: 22 },

  // utility button reused for Retry
  sortBtn: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: '#E5EEE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortBtnText: { fontSize: 12.5, fontWeight: '800', color: ACCENT, letterSpacing: 0.4 },
  primaryBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 2,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '800', color: ACCENT, textAlign: 'center' },
});
