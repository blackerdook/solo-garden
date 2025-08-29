import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showBeetCard, setShowBeetCard] = useState(false);

  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View style={{ flex: 1, backgroundColor: '#0E0F0E' }} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIconWrap}>
            <Ionicons name="camera-outline" size={36} color="#2a7c4f" />
          </View>
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionText}>
            Enable your camera to identify plants and capture garden moments.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const onCapturePress = () => {
    // Demo: Instead of capturing an image, just show the beet card
    setShowBeetCard(true);
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        {/* Top HUD */}
        <SafeAreaView>
          <View style={styles.topBar}>
            <View style={styles.badge}>
              <Ionicons name="leaf-outline" size={14} color="#2a7c4f" />
              <Text style={styles.badgeText}>Identify</Text>
            </View>
          </View>
        </SafeAreaView>

        {/* Bottom HUD */}
        <View style={styles.bottomWrap}>
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.sideBtn} accessibilityLabel="Open gallery (placeholder)">
              <Ionicons name="images-outline" size={22} color="#E6EEE9" />
            </TouchableOpacity>

            <Pressable onPress={onCapturePress} style={({ pressed }) => [styles.captureWrap, pressed && { opacity: 0.9 }]}>
              <View style={styles.captureOuter}>
                <View style={styles.captureInner} />
              </View>
            </Pressable>

            <TouchableOpacity onPress={toggleCameraFacing} style={styles.sideBtn} accessibilityLabel="Flip camera">
              <Ionicons name="sync-outline" size={20} color="#E6EEE9" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>

      {/* Plant Info Bottom Sheet */}
      {showBeetCard && (
        <Pressable style={styles.sheetBackdrop} onPress={() => setShowBeetCard(false)}>
          <Pressable style={styles.sheet} onPress={() => {}} accessibilityViewIsModal>
            <View style={styles.grabber} />
            {/* Header */}
            <View style={styles.sheetHeader}>
              <Image
                source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy0z4tzOzlcKKFrozL_7ke1YFMVRcgRCPmQQ&s',
                }}
                style={styles.sheetImage}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetTitle}>Beet</Text>
                <Text style={styles.sheetSubtitle}>Beta vulgaris</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Body */}
            <InfoRow label="Description" value="Root vegetable prized for its edible taproot and leafy greens. Great for salads, roasting, and juicing." />
            <InfoRow label="Cycle" value="Biennial (grown as annual)" />
            <InfoRow label="Watering" value="Keep soil evenly moist; ~2.5 cm per week" />
            <InfoRow label="Sunlight" value="Full sun to partial shade (4–6+ hrs)" />
            <InfoRow label="Soil" value="Loose, well-drained, pH 6.0–7.0" />
            <InfoRow label="Spacing" value="7–10 cm apart; rows 30 cm" />
            <InfoRow label="Harvest" value="50–70 days (roots 3–5 cm)" />
            <InfoRow label="Care Level" value="Easy" />

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowBeetCard(false)}>
              <Text style={styles.primaryBtnText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}
    </View>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

/* === Theme === */
const ACCENT = '#2a7c4f';
const BG_DARK = 'rgba(0,0,0,0.28)';

const styles = StyleSheet.create({
  /* ===== Layout ===== */
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },

  /* ===== HUD: Top ===== */
  topBar: {
    marginTop: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 12.5, letterSpacing: 0.2 },
  iconBtn: {
    backgroundColor: BG_DARK,
    borderRadius: 22,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  /* ===== HUD: Bottom ===== */
  bottomWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingBottom: 26,
  },
  sideBtn: {
    width: 46, height: 46,
    borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: BG_DARK,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  // Capture control (ring-in-ring)
  captureWrap: { alignItems: 'center', justifyContent: 'center' },
  captureOuter: {
    width: 82, height: 82, borderRadius: 41,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 6 },
    }),
  },
  captureInner: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff',
  },

  /* ===== Permission ===== */
  permissionContainer: {
    flex: 1, backgroundColor: '#F6F8F7', alignItems: 'center', justifyContent: 'center',
    padding: 20,
  },
  permissionCard: {
    width: '88%', maxWidth: 500, backgroundColor: '#fff', borderRadius: 18, padding: 20,
    alignItems: 'center', gap: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } },
      android: { elevation: 6 },
    }),
  },
  permissionIconWrap: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#E7F1EC',
    alignItems: 'center', justifyContent: 'center',
  },
  permissionTitle: { fontSize: 18, fontWeight: '900', color: '#0F1A14', marginTop: 6 },
  permissionText: { fontSize: 14, color: '#5F6B66', textAlign: 'center' },
  permissionButton: {
    marginTop: 8, height: 46, borderRadius: 12, backgroundColor: ACCENT,
    paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center',
  },
  permissionButtonText: { color: '#fff', fontSize: 15.5, fontWeight: '900' },

  /* ===== Sheet (Bottom) ===== */
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 16,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: '#E7EFEA',
  },
  grabber: {
    alignSelf: 'center',
    width: 44, height: 4, borderRadius: 2,
    backgroundColor: '#DDE7E2', marginBottom: 10,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  sheetImage: { width: 150, height: 150, borderRadius: 14, backgroundColor: '#EAF5EF' },
  sheetTitle: { fontSize: 20, fontWeight: '900', color: '#0F1A14', letterSpacing: 0.2 },
  sheetSubtitle: { fontSize: 13.5, color: '#6F7B74' },

  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#E6EEE9', marginVertical: 12 },

  infoRow: { marginTop: 8 },
  infoLabel: { fontSize: 12.5, fontWeight: '900', color: ACCENT, marginBottom: 3, letterSpacing: 0.3, textTransform: 'uppercase' },
  infoValue: { fontSize: 15, color: '#21372D', lineHeight: 22 },

  primaryBtn: {
    marginTop: 14,
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
});
