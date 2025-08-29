import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type Task = { id: string; label: string; done: boolean };
type Plant = { id: string; name: string; uri?: string };

const FILTERS = ['All', 'Open', 'Done'] as const;
type Filter = (typeof FILTERS)[number];

const Journal = () => {
  const navigation = useNavigation();

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', label: 'Water basil', done: false },
    { id: '2', label: 'Repot snake plant', done: true },
  ]);

  // Use fixed URIs but include id + name so delete/labels work
  const [plants, setPlants] = useState<Plant[]>([
    { id: 'p1', name: 'Plant 1', uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe08_42VsSt0UaDuC6Eq-CMRlpqETyJif8tA&s' },
    { id: 'p2', name: 'Plant 2', uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8qjwjJybg3R1xxz8OpPEZ6zwdIO0SbNNjvA&s' },
    { id: 'p3', name: 'Plant 3', uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-qfKUakCc0tleWWEfBM8pK56UPxYD6LvRwA&s' },
    { id: 'p4', name: 'Plant 4', uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYVNx-ZZJwFyCPDeRrg782dDEsldefjpZXnw&s' },
  ]);

  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  // Add Plant popup state (not required to be functional, but Save will add)
  const [showAddModal, setShowAddModal] = useState(false);
  const [plantNameInput, setPlantNameInput] = useState('');
  const [plantImageInput, setPlantImageInput] = useState('');

  // ---- Task handlers
  const addTask = () => {
    const label = newTask.trim();
    if (!label) return;
    setTasks((t) => [{ id: Date.now().toString(), label, done: false }, ...t]);
    setNewTask('');
  };
  const toggleTask = (id: string) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const deleteTask = (id: string) =>
    setTasks((t) => t.filter((x) => x.id !== id));

  const filteredTasks = useMemo(() => {
    if (filter === 'All') return tasks;
    if (filter === 'Open') return tasks.filter((t) => !t.done);
    return tasks.filter((t) => t.done);
  }, [tasks, filter]);

  // ---- Plant handlers
  const openAddPlant = () => {
    setPlantNameInput('');
    setPlantImageInput('');
    setShowAddModal(true);
  };

  const saveNewPlant = () => {
    // You said it doesn't have to be functional, but this will add if both fields provided.
    const name = plantNameInput.trim();
    const uri = plantImageInput.trim();
    if (!name || !uri) {
      setShowAddModal(false);
      return;
    }
    const id = `np-${Date.now()}`;
    setPlants((p) => [{ id, name, uri }, ...p]);
    setShowAddModal(false);
  };

  const deletePlant = (id: string) => {
    setPlants((p) => p.filter((x) => x.id !== id));
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* background blobs */}
      <View style={styles.blobTop} pointerEvents="none" />
      <View style={styles.blobRight} pointerEvents="none" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Plant Journal</Text>
        </View>

        {/* Tasks */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>Tasks</Text>
              <View style={styles.badge}>
                <Ionicons name="list-outline" size={12} color={TOKENS.accent} />
                <Text style={styles.badgeText}>{tasks.length}</Text>
              </View>
            </View>

            <View style={styles.row}>
              {FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <Pressable
                    key={f}
                    onPress={() => setFilter(f)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {f}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Add task input */}
          <View style={styles.addRow}>
            <Ionicons name="ellipse-outline" size={18} color="#7B8A84" />
            <TextInput
              placeholder="Add a new task…"
              placeholderTextColor="#97A59E"
              value={newTask}
              onChangeText={setNewTask}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={addTask}
            />
            <TouchableOpacity onPress={addTask} style={styles.addBtn} accessibilityLabel="Add task">
              <Ionicons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Task list */}
          {filteredTasks.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="leaf-outline" size={24} color="#AEB8B2" />
              <Text style={styles.emptyText}>No tasks</Text>
              <Text style={styles.emptySub}>
                {filter === 'Open' ? 'All caught up!' : 'Try a different filter or add one above.'}
              </Text>
            </View>
          ) : (
            <View style={styles.taskList}>
              {filteredTasks.map((t) => (
                <View key={t.id} style={styles.taskRow}>
                  <Pressable
                    style={[styles.checkbox, t.done && styles.checkboxOn]}
                    onPress={() => toggleTask(t.id)}
                    hitSlop={8}
                  >
                    {t.done && <Ionicons name="checkmark" size={12} color={TOKENS.accent} />}
                  </Pressable>

                  <Pressable style={styles.taskLabelWrap} onPress={() => toggleTask(t.id)}>
                    <Text
                      numberOfLines={1}
                      style={[styles.taskText, t.done && styles.taskTextDone]}
                    >
                      {t.label}
                    </Text>
                  </Pressable>

                  {/* Delete button */}
                  <Pressable
                    onPress={() => deleteTask(t.id)}
                    hitSlop={8}
                    style={styles.trashBtn}
                    accessibilityLabel="Delete task"
                  >
                    <Ionicons name="trash-outline" size={16} color={TOKENS.muted} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* My Plants */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>My Plants</Text>
          <View style={styles.row}>
            <View style={styles.countPill}>
              <Ionicons name="leaf-outline" size={12} color={TOKENS.accent} />
              <Text style={styles.countPillText}>{plants.length}</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtnSmall}
              onPress={openAddPlant}
              accessibilityLabel="Add plant"
            >
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardTall}>
          {plants.length === 0 ? (
            <View style={[styles.empty, { height: 140 }]}>
              <Ionicons name="image-outline" size={24} color="#AEB8B2" />
              <Text style={styles.emptyText}>No plants saved</Text>
              <Text style={styles.emptySub}>Add plants from the Plants tab.</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {plants.map((p) => (
                <View key={p.id} style={styles.tile}>
                  {p.uri ? (
                    <Image source={{ uri: p.uri }} style={styles.tileImg} />
                  ) : (
                    <View style={[styles.tileImg, styles.tilePlaceholder]}>
                      <Ionicons name="leaf-outline" size={20} color="#8EA69A" />
                    </View>
                  )}

                  {/* Delete Plant */}
                  <TouchableOpacity
                    style={styles.deletePlantBtn}
                    onPress={() => deletePlant(p.id)}
                    accessibilityLabel={`Delete ${p.name}`}
                  >
                    <Ionicons name="trash-outline" size={14} color="#fff" />
                  </TouchableOpacity>

                  <View style={styles.grad} />
                  <View style={styles.labelWrap}>
                    <Text numberOfLines={1} style={styles.labelText}>
                      {p.name}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ===== Add Plant Popup (modal overlay) ===== */}
      {showAddModal && (
        <Pressable style={styles.modalBackdrop} onPress={() => setShowAddModal(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Add a Plant</Text>
            <Text style={styles.modalSub}>Enter a name and image URL</Text>

            <TextInput
              placeholder="Plant name"
              placeholderTextColor="#9AA6A1"
              value={plantNameInput}
              onChangeText={setPlantNameInput}
              style={styles.modalInput}
              autoCapitalize="words"
            />
            <TextInput
              placeholder="Image URL (https://...)"
              placeholderTextColor="#9AA6A1"
              value={plantImageInput}
              onChangeText={setPlantImageInput}
              style={styles.modalInput}
              autoCapitalize="none"
              keyboardType="url"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnGhost]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalBtnGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={saveNewPlant}>
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      )}
      {/* ===== /Add Plant Popup ===== */}
    </SafeAreaView>
  );
};
/* ===========================
   Styled Tokens
=========================== */
const TOKENS = {
  accent: '#2a7c4f',
  bg: '#F6F8F7',
  card: '#FFFFFF',
  ink: '#0F1A14',
  muted: '#6F7B74',
  radius: 16,
  space: 16,
};

/* ===========================
   Styles
=========================== */
const styles = StyleSheet.create({
  /* Layout / Page */
  safe: { flex: 1, backgroundColor: TOKENS.bg },
  scroll: { flex: 1 },
  scrollContent: { padding: TOKENS.space, paddingBottom: TOKENS.space * 2 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  // decorative blobs
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

  /* Back button + header */
  backButton: {
    backgroundColor: TOKENS.accent,
    borderRadius: 20,
    padding: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
    ...Platform.select({
      ios: { shadowColor: TOKENS.accent, shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },
  header: { marginBottom: 6 },
  title: { fontSize: 22, fontWeight: '900', color: TOKENS.ink, letterSpacing: 0.2 },

  /* Cards */
  card: {
    backgroundColor: TOKENS.card,
    borderRadius: TOKENS.radius,
    padding: TOKENS.space,
    borderWidth: 1,
    borderColor: '#E5ECE8',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 1 },
    }),
  },
  cardTall: {
    backgroundColor: TOKENS.card,
    borderRadius: TOKENS.radius,
    padding: TOKENS.space,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5ECE8',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 1 },
    }),
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },

  /* Chips / Badges */
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
    backgroundColor: '#EAF5EF', borderWidth: 1, borderColor: '#D7E7DE',
  },
  badgeText: { fontSize: 12, fontWeight: '900', color: TOKENS.accent },

  chip: {
    height: 30, paddingHorizontal: 12, borderRadius: 999,
    backgroundColor: '#EAF5EF', borderWidth: 1, borderColor: '#D7E7DE',
    alignItems: 'center', justifyContent: 'center',
  },
  chipActive: { backgroundColor: TOKENS.accent, borderColor: TOKENS.accent },
  chipText: { fontSize: 12.5, color: '#2E5141', fontWeight: '800' },
  chipTextActive: { color: '#fff' },

  /* Typography */
  cardTitle: { fontSize: 16, fontWeight: '900', color: TOKENS.ink, letterSpacing: 0.2 },

  /* Inputs */
  addRow: {
    marginTop: 10,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: { flex: 1, fontSize: 15, color: TOKENS.ink },
  addBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: TOKENS.accent, alignItems: 'center', justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: TOKENS.accent, shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 },
    }),
  },

  /* Tasks */
  taskList: { marginTop: 8 },
  taskRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, gap: 10,
  },
  checkbox: {
    width: 18, height: 18, borderRadius: 5,
    borderWidth: 1.4, borderColor: 'rgba(15,23,42,0.45)',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxOn: { backgroundColor: '#EAF7EF', borderColor: TOKENS.accent },
  taskLabelWrap: { flex: 1 },
  taskText: { color: TOKENS.ink, fontWeight: '700' },
  taskTextDone: { textDecorationLine: 'line-through', opacity: 0.6 },
  trashBtn: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F0F3F2', borderWidth: 1, borderColor: '#E6EEE9',
  },

  /* Section header above plants */
  sectionHeader: {
    marginTop: 14, marginBottom: 6,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  sectionLabel: { fontSize: 14, color: TOKENS.muted, fontWeight: '800', letterSpacing: 0.3 },
  countPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
    backgroundColor: '#EAF5EF', borderWidth: 1, borderColor: '#D7E7DE',
  },
  countPillText: { fontSize: 12, color: TOKENS.accent, fontWeight: '900' },
  addBtnSmall: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: TOKENS.accent, alignItems: 'center', justifyContent: 'center',
    marginLeft: 8,
    ...Platform.select({
      ios: { shadowColor: TOKENS.accent, shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 1 },
    }),
  },

  /* Plants grid */
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  tile: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5ECE8',
    backgroundColor: '#fff',
    position: 'relative',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 1 },
    }),
  },
  tileImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  tilePlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2F5F3' },
  grad: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 48, backgroundColor: 'rgba(0,0,0,0.22)' },
  labelWrap: {
    position: 'absolute',
    left: 6, right: 6, bottom: 6,
    paddingVertical: 4, paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  labelText: { color: '#fff', fontWeight: '900', fontSize: 12, textAlign: 'center', letterSpacing: 0.2 },
  deletePlantBtn: {
    position: 'absolute',
    top: 6, right: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderRadius: 10,
    zIndex: 10,
  },

  /* Empty states */
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 4 },
  emptyText: { fontWeight: '900', color: '#3B4B44' },
  emptySub: { color: '#82918A', fontSize: 12.5 },

  /* --- Modal (Add Plant) --- */
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 6 },
    }),
  },
  modalTitle: { fontSize: 18, fontWeight: '900', color: TOKENS.ink },
  modalSub: { fontSize: 12.5, color: TOKENS.muted, marginTop: 2, marginBottom: 10 },
  modalInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6EEE9',
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    marginBottom: 8,
    fontSize: 14.5,
    color: TOKENS.ink,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  modalBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: TOKENS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: { color: '#fff', fontWeight: '800', fontSize: 14.5 },
  modalBtnGhost: {
    backgroundColor: '#F3F5F4',
    borderWidth: 1,
    borderColor: '#E2EAE5',
  },
  modalBtnGhostText: { color: '#32433B', fontWeight: '800', fontSize: 14.5 },
});

export default Journal;
