// Home.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabase'; // ensure this path points to your Supabase client

const SP = 16;
const ACCENT = '#2a7c4f';
const BG = '#F6F8F7';
const CARD = '#FFFFFF';
const INK = '#0F1A14';
const MUTED = '#6E7B73';

type Task = { id: string; title: string; done: boolean };

type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
type Guide = {
  sow: string; position: string; spacing: string; soil: string; water: string;
  feed: string; pests: string; harvest: string; notes?: string;
};
type PlantRow = {
  id: string;
  name: string;
  season: Season;
  image_url: string | null;
  summary: string;
  guide: Guide;
};

function getNZSeason(d = new Date()): Season {
  // Southern Hemisphere (NZ): Dec–Feb Summer, Mar–May Autumn, Jun–Aug Winter, Sep–Nov Spring
  const m = d.getMonth(); // 0=Jan
  if (m >= 11 || m <= 1) return 'Summer';   // Dec, Jan, Feb
  if (m >= 2 && m <= 4) return 'Autumn';    // Mar, Apr, May
  if (m >= 5 && m <= 7) return 'Winter';    // Jun, Jul, Aug
  return 'Spring';                           // Sep, Oct, Nov
}

export default function Home() {
  const nav = useNavigation<any>();

  // Time/day-night widget
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60 * 1000);
    return () => clearInterval(t);
  }, []);
  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const isDay = hours >= 6 && hours < 18;
  const weather = { temp: '22°C', desc: 'Partly Cloudy' }; // mock
  const dateStr = time.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Tasks (mock)
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Water Aloe Vera', done: false },
    { id: '2', title: 'Mist Peace Lily', done: true },
    { id: '3', title: 'Check basil soil moisture', done: false },
  ]);
  const openCount = useMemo(() => tasks.filter(t => !t.done).length, [tasks]);
  const toggleTask = (id: string) =>
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));

  // === Seasonal random plant from Supabase ===
  const season = getNZSeason(time);
  const [randPlant, setRandPlant] = useState<PlantRow | null>(null);
  const [randLoading, setRandLoading] = useState<boolean>(true);
  const [randError, setRandError] = useState<string | null>(null);

  const loadRandomPlant = useCallback(async () => {
    try {
      setRandLoading(true);
      setRandError(null);

      // Fetch a batch for the current season, then pick one at random client-side
      const { data, error } = await supabase
        .from('seasonal_plants')
        .select('id, name, season, image_url, summary, guide')
        .eq('season', season)
        .order('name', { ascending: true })
        .limit(50);

      if (error) throw error;
      const list = (data ?? []) as PlantRow[];
      if (list.length === 0) {
        setRandPlant(null);
      } else {
        const i = Math.floor(Math.random() * list.length);
        setRandPlant(list[i]);
      }
    } catch (e: any) {
      setRandError(e?.message ?? 'Failed to load seasonal plant');
      setRandPlant(null);
    } finally {
      setRandLoading(false);
    }
  }, [season]);

  useEffect(() => {
    loadRandomPlant();
  }, [loadRandomPlant]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* Decorative blobs */}
        <View style={styles.blobTop} pointerEvents="none" />
        <View style={styles.blobMid} pointerEvents="none" />

        <ScrollView
          contentContainerStyle={{ padding: SP, paddingBottom: SP * 3 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text style={styles.title}>🌿 Welcome back</Text>
          <Text style={styles.subtitle}>Grow steady. Small, daily care adds up.</Text>

          {/* Today Widget */}
          <View style={styles.widgetCard}>
            {/* subtle background accents */}
            <View style={styles.widgetBlobTL} pointerEvents="none" />
            <View
              style={[styles.widgetBlobBR, isDay ? styles.dayBlob : styles.nightBlob]}
              pointerEvents="none"
            />

            <Text style={styles.widgetDate}>{dateStr}</Text>

            <View style={styles.widgetTimeRow}>
              <Text style={styles.widgetTimeNumber}>{hour12}</Text>
              <Text style={styles.widgetTimeColon}>:</Text>
              <Text style={styles.widgetTimeNumber}>{minutes}</Text>
              <Text style={[styles.widgetAmPm, isDay ? styles.ampmDay : styles.ampmNight]}>
                {ampm}
              </Text>
            </View>

            <View style={styles.widgetMetaRow}>
              <View style={styles.weatherChip}>
                <Text style={styles.weatherChipText}>
                  {isDay ? '☀️' : '🌙'} {weather.temp}
                </Text>
              </View>
              <Text style={styles.widgetWeatherDesc}>{weather.desc}</Text>
              <View style={[styles.dayNightDot, isDay ? styles.dotDay : styles.dotNight]} />
              <Text style={styles.widgetMetaText}>{isDay ? 'Daylight' : 'Night'} · NZ</Text>
            </View>
          </View>

          {/* Today’s tasks */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Today’s Tasks</Text>
              <Text style={styles.cardMeta}>
                {openCount === 0 ? 'All done 🎉' : `${openCount} open`}
              </Text>
            </View>

            {tasks.length === 0 ? (
              <View style={styles.emptyTasks}>
                <Text style={styles.emptyTitle}>No tasks yet</Text>
                <Text style={styles.emptySub}>Add a plant or create a reminder.</Text>
              </View>
            ) : (
              tasks.map((t, idx) => (
                <View key={t.id}>
                  <Pressable
                    onPress={() => toggleTask(t.id)}
                    style={({ pressed }) => [
                      styles.taskRow,
                      pressed && { opacity: 0.9, transform: [{ scale: 0.997 }] },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`${t.title} ${t.done ? 'completed' : 'open'}`}
                  >
                    <View style={[styles.checkbox, t.done && styles.checkboxOn]}>
                      {t.done ? <Text style={styles.checkboxTick}>✓</Text> : null}
                    </View>
                    <Text style={[styles.taskText, t.done && styles.taskTextDone]}>
                      {t.title}
                    </Text>
                  </Pressable>
                  {idx < tasks.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            )}
          </View>

          {/* Seasonal tip card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Seasonal Tip</Text>
              <Text style={styles.cardMeta}>{season}</Text>
            </View>

            {randLoading ? (
              <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                <ActivityIndicator size="small" />
              </View>
            ) : randError ? (
              <Text style={{ color: '#C1111E', marginBottom: 8 }}>{randError}</Text>
            ) : !randPlant ? (
              <Text style={{ color: MUTED, marginBottom: 8 }}>No seasonal plants found.</Text>
            ) : (
              <>
                <Text style={styles.cardSub}>
                  Try growing <Text style={{ fontWeight: '900', color: INK }}>{randPlant.name}</Text>{' '}
                  this {season.toLowerCase()}.
                </Text>

                <View style={styles.tipWrap}>
                  <View style={styles.tipImage} />
                  <View style={styles.tipText}>
                    <Text style={styles.tipTitle}>{randPlant.name}</Text>
                    <Text style={styles.tipDesc} numberOfLines={3}>
                      {randPlant.summary}
                    </Text>
                    <View style={styles.pillsRow}>
                      <TagPill text={season} />
                      <TagPill text="NZ garden" />
                    </View>

                    {/* Shuffle as a small utility button */}
                    <Pressable
                      style={[styles.secondaryBtn, { marginTop: 12 }]}
                      onPress={loadRandomPlant}
                    >
                      <Text style={styles.secondaryBtnText}>Shuffle</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Full-width Seasonal Plants button at bottom */}
                <Pressable
                  style={[styles.primaryBtn, { marginTop: 16 }]}
                  onPress={() => nav.navigate('SeasonalPlants')}
                >
                  <Text style={styles.primaryBtnText}>Seasonal Plants</Text>
                </Pressable>
              </>
            )}
          </View>

          {/* Learn more */}
          <View style={[styles.card, { paddingBottom: SP }]}>
            <Text style={styles.cardTitle}>Need help choosing a plant?</Text>
            <Text style={styles.cardSub}>Browse species, care needs, and growing tips.</Text>
            <Pressable
              style={[styles.secondaryBtn, { marginTop: 10 }]}
              onPress={() => nav.navigate('Plants')}
            >
              <Text style={styles.secondaryBtnText}>Explore Plants</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---------- small UI bits ---------- */

function TagPill({ text }: { text: string }) {
  return (
    <View style={styles.tagPill}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  root: { flex: 1 },

  emptyTasks: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ACCENT,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13.5,
    color: '#6E7B73',
    marginTop: 2,
    textAlign: 'center',
  },

  // soft decorative blobs
  blobTop: {
    position: 'absolute',
    top: -90, left: -40,
    width: 240, height: 240,
    borderRadius: 120,
    backgroundColor: '#E6F2EA',
    opacity: 0.85,
  },
  blobMid: {
    position: 'absolute',
    top: 140, right: -70,
    width: 200, height: 200,
    borderRadius: 100,
    backgroundColor: '#F0FAF3',
    opacity: 0.75,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: ACCENT,
    letterSpacing: 0.2,
  },
  subtitle: { fontSize: 13.5, color: MUTED, marginTop: 4, marginBottom: 12 },

  // ===== WIDGET (new styles) =====
  widgetCard: {
    position: 'relative',
    backgroundColor: CARD,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E6EEE9',
    overflow: 'hidden',
    alignItems: 'flex-start',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 3 },
    }),
  },

  // subtle decorative blobs inside the card
  widgetBlobTL: {
    position: 'absolute',
    top: -40,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: '#F3FAF6',
  },
  widgetBlobBR: {
    position: 'absolute',
    bottom: -30,
    right: -20,
    width: 160,
    height: 160,
    borderRadius: 999,
    opacity: 0.55,
  },
  dayBlob: { backgroundColor: '#E6F4EC' },
  nightBlob: { backgroundColor: '#E9EEF5' },

  widgetDate: {
    fontSize: 13,
    color: MUTED,
    fontWeight: '700',
  },

  widgetTimeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  widgetTimeNumber: {
    fontSize: 40,
    lineHeight: 44,
    color: INK,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  widgetTimeColon: {
    fontSize: 40,
    lineHeight: 44,
    color: INK,
    fontWeight: '900',
    marginHorizontal: 2,
  },
  widgetAmPm: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    color: '#fff',
  },
  ampmDay: { backgroundColor: ACCENT },
  ampmNight: { backgroundColor: '#3A4A63' },

  widgetMetaRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  weatherChip: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#F2F7F4',
    borderWidth: 1,
    borderColor: '#E3ECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherChipText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#2B3B34',
  },
  widgetWeatherDesc: {
    fontSize: 13.5,
    fontWeight: '700',
    color: MUTED,
  },
  dayNightDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginLeft: 2,
    marginRight: -2,
  },
  dotDay: { backgroundColor: '#2a7c4f' },
  dotNight: { backgroundColor: '#3A4A63' },
  widgetMetaText: {
    fontSize: 12.5,
    color: MUTED,
    fontWeight: '700',
  },

  // ===== CARDS / LISTS =====
  card: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: SP,
    borderWidth: 1,
    borderColor: '#E6EEE9',
    marginBottom: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 2 },
    }),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: '900', color: INK },
  cardMeta: { fontSize: 13, color: MUTED, fontWeight: '700' },
  cardSub: { fontSize: 13.5, color: MUTED, marginTop: 4 },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CFE2D7',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxOn: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  checkboxTick: { color: '#fff', fontWeight: '900', fontSize: 14 },
  taskText: { color: INK, fontSize: 15, flex: 1 },
  taskTextDone: { color: '#92A29A', textDecorationLine: 'line-through' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#E6EEE9' },

  tipWrap: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 12,
  },
  tipImage: {
    width: 104,
    height: 104,
    borderRadius: 14,
    backgroundColor: '#EAF5EF', // placeholder block for future images
  },
  tipText: { flex: 1 },
  tipTitle: { color: INK, fontWeight: '900', fontSize: 15, marginBottom: 2 },
  tipDesc: { color: '#2B3B34' },
  pillsRow: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  tagPill: {
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 999,
    backgroundColor: '#F2F7F4',
    borderWidth: 1,
    borderColor: '#E3ECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: { fontSize: 12, color: '#486B5B', fontWeight: '700' },

  primaryBtn: {
    height: 46,
    borderRadius: 14,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    ...Platform.select({
      ios: { shadowColor: '#2a7c4f', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 3 },
    }),
  },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 0.2 },

  secondaryBtn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE7E2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FBF9',
    flex: 1,
  },
  secondaryBtnText: { color: ACCENT, fontSize: 14.5, fontWeight: '900' },
});
