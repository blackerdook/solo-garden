import React, { useMemo, useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TextInput, Pressable, Image,
  RefreshControl, ActivityIndicator, SafeAreaView, Platform
} from 'react-native';
import { useRemedies } from '../hooks/useRemedies';
import { useTermsGate } from '../hooks/useTermsGate';

type RemedyItem = ReturnType<typeof useRemedies>['items'][number];

const CHIP_OPTIONS = ['Sleep','Anxiety','Headache','Cold','Digestion','Skin','Inflammation','Immune','Dizziness','Nausea','Pain'];

export default function Remedy() {
  const { items, loading, refreshing, error, search, setSearch, refresh } = useRemedies('');
  const { loading: tcLoading, error: tcError, needsAcceptance, terms, accept } = useTermsGate('remedies');

  const [selected, setSelected] = useState<RemedyItem | null>(null);
  const [chip, setChip] = useState<string | null>(null);
  const [sort, setSort] = useState<'az' | 'za'>('az');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items.filter((r) => {
      const usesArr = Array.isArray(r.uses) ? r.uses : [];
      const matchQ =
        !q ||
        r.name?.toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q) ||
        usesArr.some((u) => u.toLowerCase().includes(q));
      const matchChip =
        !chip || usesArr.some((u) => u.toLowerCase().includes(chip.toLowerCase()));
      return matchQ && matchChip;
    });

    list = list.sort((a, b) => {
      const an = (a.name ?? '').toLowerCase();
      const bn = (b.name ?? '').toLowerCase();
      return sort === 'az' ? an.localeCompare(bn) : bn.localeCompare(an);
    });

    return list;
  }, [items, search, chip, sort]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* Decorative blobs */}
        <View style={styles.blobTop} pointerEvents="none" />
        <View style={styles.blobMid} pointerEvents="none" />

        {/* Header */}
        <Text style={styles.title}>🌿 Natural Remedies</Text>
        <Text style={styles.subtitle}>Discover gentle, plant-based support.</Text>

        {/* Tools */}
        <View style={styles.toolsWrap}>
          {/* Search */}
          <View style={styles.searchWrap}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search remedies, uses, or symptoms…"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              placeholderTextColor="#9AA3A7"
            />
            {search.length > 0 && (
              <Pressable
                onPress={() => setSearch('')}
                style={styles.clearBtn}
                hitSlop={8}
                accessibilityLabel="Clear search"
              >
                <Text style={{ fontSize: 16, color: '#7C8A80' }}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Chips + Sort */}
          <View style={styles.rowBetween}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
            >
              {CHIP_OPTIONS.map((c) => {
                const active = chip === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setChip(active ? null : c)}
                    style={({ pressed }) => [
                      styles.chip,
                      active && styles.chipActive,
                      pressed && { opacity: 0.9 },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              onPress={() => setSort((s) => (s === 'az' ? 'za' : 'az'))}
              style={styles.sortBtn}
              accessibilityLabel="Toggle sort"
            >
              <Text style={styles.sortBtnText}>{sort === 'az' ? 'A–Z' : 'Z–A'}</Text>
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        >
          {loading && items.length === 0 ? (
            <View style={styles.center}><ActivityIndicator size="large" /></View>
          ) : error ? (
            <View style={styles.center}><Text style={styles.error}>Error: {error}</Text></View>
          ) : filtered.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.noResults}>No remedies found</Text>
              <Text style={styles.noResultsSub}>Try a different term or clear filters.</Text>
              <Pressable onPress={() => { setSearch(''); setChip(null); }} style={styles.clearAllBtn}>
                <Text style={styles.clearAllText}>Clear all</Text>
              </Pressable>
            </View>
          ) : (
            filtered.map((item) => (
              <Pressable
                key={String(item.id)}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                onPress={() => setSelected(item)}
                accessibilityRole="button"
                accessibilityLabel={`${item.name ?? ''}. ${item.description ?? ''}`}
              >
                <View style={styles.thumbWrap}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.thumb} />
                  ) : (
                    <View style={[styles.thumb, { backgroundColor: '#EAF5EF' }]} />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.name ?? 'Unnamed'}</Text>
                  {!!item.description && (
                    <Text style={styles.cardDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                  <View style={styles.tinyChipsRow}>
                    {(Array.isArray(item.uses) ? item.uses.slice(0, 3) : []).map((u) => (
                      <View style={styles.tinyChip} key={u}>
                        <Text style={styles.tinyChipText}>{u}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={styles.chev}>{'›'}</Text>
              </Pressable>
            ))
          )}
        </ScrollView>

        {/* Bottom-sheet popup with full info */}
        {selected && (
          <Pressable style={styles.backdrop} onPress={() => setSelected(null)}>
            <Pressable style={styles.sheet} onPress={() => {}}>
              <View style={styles.grabber} />
              <View style={styles.sheetHeader}>
                {selected.image ? (
                  <Image source={{ uri: selected.image }} style={styles.sheetThumb} />
                ) : (
                  <View style={[styles.sheetThumb, { backgroundColor: '#EAF5EF' }]} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetTitle}>{selected.name ?? 'Unnamed'}</Text>
                  {!!selected.description && (
                    <Text style={styles.sheetSubtitle}>{selected.description}</Text>
                  )}
                </View>
              </View>

              <View style={styles.divider} />

              {Array.isArray(selected.uses) && selected.uses.length > 0 && (
                <InfoBlock label="Uses" value={'• ' + selected.uses.join('\n• ')} />
              )}
              {!!selected.preparation && <InfoBlock label="Preparation" value={selected.preparation} />}
              {!!selected.dosage && <InfoBlock label="Dosage" value={selected.dosage} />}
              {!!selected.warnings && <InfoBlock label="Warnings" value={selected.warnings} warning />}

              <Pressable style={styles.primaryBtn} onPress={() => setSelected(null)}>
                <Text style={styles.primaryBtnText}>Close</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        )}

        {/* === T&C Gate Overlay (BLOCKING) === */}
        {!tcLoading && needsAcceptance && (
          <View style={styles.tcBackdrop} pointerEvents="auto">
            <View style={styles.tcCard}>
              <Text style={styles.tcTitle}>Accept Terms & Conditions</Text>
              <Text style={styles.tcBody}>
                {terms?.content ?? 'You need to accept the Terms & Conditions before using Remedies.'}
              </Text>
              {tcError ? <Text style={styles.error}>Error: {tcError}</Text> : null}
              <View style={{ height: 10 }} />
              <Pressable
                style={styles.primaryBtn}
                onPress={async () => {
                  try { await accept(); } catch {}
                }}
              >
                <Text style={styles.primaryBtnText}>I Accept</Text>
              </Pressable>
              <View style={{ height: 8 }} />
              <Pressable
                style={styles.secondaryBtn}
                onPress={() => { /* optional: navigate to a full terms screen */ }}
              >
                <Text style={styles.secondaryBtnText}>View Full Terms</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function InfoBlock({
  label,
  value,
  warning,
}: {
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <View style={styles.infoBlock}>
      <Text style={[styles.infoLabel, warning && { color: '#C1111E' }]}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

/* === Theme tokens to match the rest of your app === */
const SP = 16;
const ACCENT = '#2a7c4f';
const BG = '#F6F8F7';
const CARD = '#FFFFFF';
const INK = '#0F1A14';
const MUTED = '#6E7B73';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  root: { flex: 1, paddingTop: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#C1111E', fontSize: 15, fontWeight: '800', marginTop: 8 },

  // soft decorative blobs
  blobTop: {
    position: 'absolute',
    top: -80, left: -40,
    width: 220, height: 220,
    borderRadius: 110,
    backgroundColor: '#E6F2EA',
    opacity: 0.8,
  },
  blobMid: {
    position: 'absolute',
    top: 120, right: -60,
    width: 180, height: 180,
    borderRadius: 90,
    backgroundColor: '#F0FAF3',
    opacity: 0.7,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: ACCENT,
    marginLeft: SP,
    letterSpacing: 0.2,
    marginTop: 6,
  },
  subtitle: {
    fontSize: 13.5,
    color: MUTED,
    marginLeft: SP + 23,
    marginTop: 4,
    marginBottom: 10,
  },

  toolsWrap: { paddingHorizontal: SP, gap: 10 },

  // Search
  searchWrap: {
    height: 48,
    backgroundColor: CARD,
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5EEE8',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 1 },
    }),
  },
  searchInput: { fontSize: 16, color: INK },
  clearBtn: { position: 'absolute', right: 12, top: 12 },

  // chips + sort
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chipsRow: { paddingRight: 8 },
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

  // List
  cardsContainer: { paddingHorizontal: SP, paddingTop: 12, paddingBottom: SP * 2, gap: 12 },
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
  cardPressed: { transform: [{ scale: 0.997 }], opacity: 0.98 },
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
  cardDesc: { fontSize: 13.5, color: MUTED, marginTop: 2 },
  tinyChipsRow: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  tinyChip: {
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#F2F7F4',
    borderWidth: 1,
    borderColor: '#E3ECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyChipText: { fontSize: 11, color: '#486B5B', fontWeight: '700' },
  chev: { fontSize: 28, color: '#9a9a9a', paddingHorizontal: 4, lineHeight: 28 },

  emptyWrap: { alignItems: 'center', marginTop: 36, gap: 8 },
  noResults: { color: '#5F6B66', fontSize: 15, fontWeight: '800' },
  noResultsSub: { color: '#92A29A', fontSize: 13 },
  clearAllBtn: {
    marginTop: 4,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#EAF5EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearAllText: { color: ACCENT, fontWeight: '800' },

  // Modal/Sheet (on top)
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
    paddingBottom: SP + 10,
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
  sheetThumb: { width: 150, height: 150, borderRadius: 14, backgroundColor: '#EAF5EF' },
  sheetTitle: { fontSize: 20, fontWeight: '900', color: INK, letterSpacing: 0.2 },
  sheetSubtitle: { fontSize: 13.5, color: MUTED },

  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#E6EEE9', marginVertical: 12 },

  infoBlock: { marginTop: 10 },
  infoLabel: { fontSize: 12.5, fontWeight: '900', color: ACCENT, marginBottom: 4, letterSpacing: 0.3, textTransform: 'uppercase' },
  infoValue: { fontSize: 15, color: '#21372D', lineHeight: 22 },

  primaryBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 14,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#2a7c4f', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 3 },
    }),
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.2 },

  // T&C overlay
  tcBackdrop: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    ...Platform.select({ android: { elevation: 70 } }),
  },
  tcCard: {
    width: '86%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6EEE9',
  },
  tcTitle: { fontSize: 18, fontWeight: '800', color: '#2a7c4f', marginBottom: 6 },
  tcBody: { fontSize: 14.5, color: '#21372D' },

  secondaryBtn: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDE7E2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FBF9',
  },
  secondaryBtnText: { color: '#2a7c4f', fontSize: 15, fontWeight: '800' },
});
