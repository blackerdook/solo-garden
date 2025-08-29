// components/PlantAssistant.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Message = { sender: 'user' | 'assistant'; text: string };

// --- Backend ---
const BACKEND_URL = 'http://172.20.10.5:5050';

/* === Theme tokens (match app) === */
const ACCENT = '#2a7c4f';
const BG = '#F6F8F7';
const CARD = '#FFFFFF';
const INK = '#0F1A14';
const BORDER = '#E6EEE9';

const PlantAssistant: React.FC = () => {
  const insets = useSafeAreaInsets();
  const KAV_OFFSET = Platform.OS === 'ios' ? insets.bottom : 0;

  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  // slide-up sheet animation
  const slide = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [visible]);
  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [600, 0] });

  const listRef = useRef<FlatList<Message>>(null);
  const scrollToEnd = () => listRef.current?.scrollToEnd({ animated: true });

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    scrollToEnd();

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'assistant', text: data?.reply ?? 'Okay.' }]);
      setTimeout(scrollToEnd, 50);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: 'Error: Could not connect to assistant.' },
      ]);
      setTimeout(scrollToEnd, 50);
    }
  };

  const openChat = () => {
    setVisible(true);
    setMessages(prev =>
      prev.length
        ? prev
        : [{ sender: 'assistant', text: "Kia ora! I'm your Plant Assistant 🌿\nHow can I help?" }],
    );
  };

  const Launcher = useMemo(
    () => (
      <Pressable
        onPress={openChat}
        style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.98 }] }]}
        accessibilityRole="button"
        accessibilityLabel="Open Plant Assistant"
      >
        <Ionicons name="chatbubble-ellipses" size={22} color="#fff" />
      </Pressable>
    ),
    []
  );

  return (
    <>
      {Launcher}

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.backdrop}>
          <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.headerIcon}>🌱</Text>
                <Text style={styles.headerTitle}>Plant Assistant</Text>
              </View>
              <Pressable
                onPress={() => setVisible(false)}
                style={({ pressed }) => [styles.headerClose, pressed && { opacity: 0.9 }]}
                accessibilityRole="button"
                accessibilityLabel="Close chat"
              >
                <Ionicons name="close" size={20} color="#7C8A80" />
              </Pressable>
            </View>

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={KAV_OFFSET}
            >
              {/* Messages */}
              <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(_, i) => String(i)}
                contentContainerStyle={styles.messages}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.bubble,
                      item.sender === 'user' ? styles.bubbleUser : styles.bubbleBot,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        item.sender === 'user' ? styles.bubbleTextUser : styles.bubbleTextBot,
                      ]}
                    >
                      {item.text}
                    </Text>
                  </View>
                )}
                onContentSizeChange={scrollToEnd}
                onLayout={scrollToEnd}
              />

              {/* Input row – sits just above keyboard */}
              <View style={[styles.inputRow, { paddingBottom: (insets.bottom || 0) + 4}]}>
                <TextInput
                  style={styles.input}
                  value={input}
                  onChangeText={setInput}
                  placeholder="Type a message…"
                  placeholderTextColor="#9AA3A7"
                  multiline
                />
                <Pressable
                  onPress={sendMessage}
                  style={({ pressed }) => [styles.sendBtn, pressed && { opacity: 0.9 }]}
                  accessibilityRole="button"
                  accessibilityLabel="Send message"
                >
                  <Ionicons name="send" size={18} color="#fff" />
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // floating launcher
  fab: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: '#478453ff', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#64cc7715',
    shadowColor: '#304e31ff', shadowOpacity: 0.28, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  // modal + sheet
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: {
    height: '78%', backgroundColor: BG,
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    borderWidth: 1, borderColor: BORDER, overflow: 'hidden',
  },

  // header
  header: {
    height: 52, backgroundColor: CARD, borderBottomWidth: 1, borderColor: BORDER,
    paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerIcon: { fontSize: 18 },
  headerTitle: { fontSize: 15.5, fontWeight: '900', color: ACCENT },
  headerClose: {
    width: 34, height: 34, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F6F8F7', borderWidth: 1, borderColor: BORDER,
  },

  // messages
  messages: { paddingHorizontal: 14, paddingVertical: 12 },
  bubble: { maxWidth: '82%', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 9, marginBottom: 8 },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: ACCENT },
  bubbleBot: { alignSelf: 'flex-start', backgroundColor: CARD, borderWidth: 1, borderColor: BORDER },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  bubbleTextUser: { color: '#fff', fontWeight: '600' },
  bubbleTextBot: { color: INK },

  // input
  inputRow: {
    paddingHorizontal: 10, paddingTop: 10,marginTop: 270,backgroundColor: CARD,
    borderTopWidth: 1, borderColor: BORDER,
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
  },
  input: {
    flex: 1, minHeight: 44, maxHeight: 110,
    borderRadius: 12, borderWidth: 1, borderColor: '#DDE7E2',
    paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 15, color: INK, backgroundColor: '#F8FBF9',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: ACCENT,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#2a7c4f', shadowOpacity: 0.22, shadowRadius: 10, shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
});

export default PlantAssistant;
