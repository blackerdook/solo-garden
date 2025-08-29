import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTermsGate } from '../hooks/useTermsGate'; // ← we’ll reuse this to read T&C content
import { supabase } from '../supabase'; // if your path differs, adjust import

const SP = 16;
const ACCENT = '#2a7c4f';
const BG = '#F6F8F7';
const CARD = '#FFFFFF';
const MUTED = '#6F7B74';
const INK = '#0F1A14';

export default function Settings() {
  const navigation = useNavigation<any>();

  // Toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);

  // T&C viewer (read-only)
  const [showTerms, setShowTerms] = useState(false);
  const { terms, loading: termsLoading, error: termsError } = useTermsGate('app'); // use the "app" key in your terms table

  const termsText = useMemo(() => {
    if (termsLoading) return 'Loading terms…';
    if (termsError) return `Error loading terms: ${termsError}`;
    return terms?.content ?? 'No Terms & Conditions found.';
  }, [terms, termsLoading, termsError]);

  const onSendFeedback = async () => {
    const email = 'support@example.com';
    const subject = encodeURIComponent('Leafy: Feedback');
    const body = encodeURIComponent('Hi team,\n\nI’d like to share some feedback:\n');
    const url = `mailto:${email}?subject=${subject}&body=${body}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) Linking.openURL(url);
    else Alert.alert('Could not open email app');
  };

  const onRateApp = async () => {
    // Put your real store link here
    const url = Platform.select({
      ios: 'https://apps.apple.com/',
      android: 'https://play.google.com/store',
    })!;
    Linking.openURL(url);
  };

  const onSignOut = async () => {
    try {
      await supabase.auth.signOut();
      Alert.alert('Signed out');
      // optionally navigate to an auth screen if you have one
    } catch (e: any) {
      Alert.alert('Sign out failed', e.message ?? String(e));
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          style={styles.headerBtn}
        >
          <Ionicons name="chevron-back" size={22} color={INK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerBtn} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: SP, paddingBottom: SP * 2 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <RowSwitch
              title="Dark Mode"
              subtitle="Switch between light and dark themes"
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <RowSwitch
              title="Push Notifications"
              subtitle="Get reminders and updates about your plants"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
            <View style={styles.divider} />
            <RowSoon
              title="Quiet Hours"
              subtitle="Silence notifications overnight"
            />
          </View>
        </View>

        {/* Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controls</Text>
          <View style={styles.card}>
            <RowSwitch
              title="Haptics"
              subtitle="Vibration feedback for taps"
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
            />
            <View style={styles.divider} />
            <RowSwitch
              title="Sounds"
              subtitle="Play subtle sounds for actions"
              value={soundsEnabled}
              onValueChange={setSoundsEnabled}
            />
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <RowNav
              title="Edit Profile"
              subtitle="Name, photo, and preferences"
              onPress={() => navigation.navigate('Profile')} // adjust if your route differs
            />
            <View style={styles.divider} />
            <RowNav
              title="Manage Data"
              subtitle="Export or clear local cache"
              onPress={() => Alert.alert('Manage Data', 'Coming soon')}
            />
            <View style={styles.divider} />
            <RowNav
              title="Sign Out"
              subtitle="Log out of your account"
              onPress={onSignOut}
            />
          </View>
        </View>

        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <View style={styles.card}>
            <RowNav title="Send Feedback" subtitle="Tell us what to improve" onPress={onSendFeedback} />
            <View style={styles.divider} />
            <RowNav title="Rate App" subtitle="Love it? Leave a review" onPress={onRateApp} />
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.card}>
            <RowNav
              title="Terms & Conditions"
              subtitle="Read the terms for using the app"
              onPress={() => setShowTerms(true)}
            />
            <View style={styles.divider} />
            <RowNav
              title="Privacy Policy"
              subtitle="How we handle your data"
              onPress={() => Alert.alert('Privacy Policy', 'Add your policy link or screen')}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <RowStatic title="Version" value="1.0.0" />
            <View style={styles.divider} />
            <RowStatic title="Build" value="100" />
          </View>
        </View>
      </ScrollView>

      {/* Terms modal */}
      <Modal
        visible={showTerms}
        animationType="slide"
        onRequestClose={() => setShowTerms(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
          {/* Modal header */}
          <View style={[styles.header, { borderBottomColor: '#E6EEE9' }]}>
            <TouchableOpacity
              onPress={() => setShowTerms(false)}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              style={styles.headerBtn}
            >
              <Ionicons name="chevron-down" size={22} color={INK} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Terms & Conditions</Text>
            <View style={styles.headerBtn} />
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: SP }}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.card, { padding: SP }]}>
              <Text style={styles.termsText}>{termsText}</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------- Small row components ---------- */
function RowSwitch({
  title, subtitle, value, onValueChange,
}: { title: string; subtitle?: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? ACCENT : '#ccc'}
        trackColor={{ true: '#BFE3CC', false: '#E0E0E0' }}
      />
    </View>
  );
}

function RowNav({
  title, subtitle, onPress,
}: { title: string; subtitle?: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row} activeOpacity={0.8}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9AA3A7" />
    </TouchableOpacity>
  );
}

function RowStatic({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.rowStatic}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
}

function RowSoon({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      <View style={styles.pillMuted}>
        <Text style={styles.pillMutedText}>Soon</Text>
      </View>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SP,
    backgroundColor: BG,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5ECE8',
  },
  headerBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: INK },

  container: { flex: 1 },

  section: { marginBottom: SP * 1.25 },
  sectionTitle: {
    fontSize: 14,
    color: MUTED,
    marginBottom: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    padding: SP,
    borderWidth: 1,
    borderColor: '#E5ECE8',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 1 },
    }),
  },

  row: {
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowStatic: {
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowText: { flex: 1, paddingRight: 12 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: INK },
  rowSub: { marginTop: 2, fontSize: 12.5, color: MUTED },

  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#E8EDEB', marginVertical: 10 },

  pillMuted: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#F0F3F2' },
  pillMutedText: { fontSize: 12, color: MUTED, fontWeight: '800', letterSpacing: 0.4 },

  valueText: { fontSize: 15, color: '#38453E', fontWeight: '700' },

  termsText: { color: INK, fontSize: 14.5, lineHeight: 21 },
});
