import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Platform,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const SP = 12;
const RAD = 18;
const AVATAR = 120;
const HEADER_H = 240; // matches your mock

let gateShownThisSession = false; // stays true until the app fully restarts

const Profile = () => {
  const navigation = useNavigation();
  const [gateVisible, setGateVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (!gateShownThisSession) {
        gateShownThisSession = true;
        setGateVisible(true);
        setEmail('');
        setPassword('');
      }
    }, [])
  );

  const goToSettings = () => navigation.navigate('Settings' as never);
  const dismissGate = () => setGateVisible(false);

  const badgeImages = [
    { uri: 'https://static.wikia.nocookie.net/growagarden/images/a/a6/Care_taker_badge.webp/revision/latest/scale-to-width-down/70?cb=20250428224846' },
    { uri: 'https://static.wikia.nocookie.net/growagarden/images/6/6f/Colorful_badge.webp/revision/latest/scale-to-width-down/70?cb=20250428224823' },
    { uri: 'https://static.wikia.nocookie.net/growagarden/images/c/cb/Carrot_connoisseur_badge.webp/revision/latest/scale-to-width-down/70?cb=20250428224757' },
    { uri: 'https://static.wikia.nocookie.net/growagarden/images/c/ca/God_apple_badge.webp/revision/latest/scale-to-width-down/70?cb=20250428224612' },
  ];

  const plantImages = [
    { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe08_42VsSt0UaDuC6Eq-CMRlpqETyJif8tA&s' },
    { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8qjwjJybg3R1xxz8OpPEZ6zwdIO0SbNNjvA&s' },
    { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-qfKUakCc0tleWWEfBM8pK56UPxYD6LvRwA&s' },
    { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYVNx-ZZJwFyCPDeRrg782dDEsldefjpZXnw&s' },
  ];

  return (
    <View style={styles.root}>
      {/* Header image (flush to top) */}
      <View style={styles.headerWrap}>
        <ImageBackground
          source={require('../assets/bg1.jpg')}
          style={styles.header}
          resizeMode="cover"
        >
          {/* Settings */}
          <TouchableOpacity style={styles.settingsButton} onPress={goToSettings} hitSlop={8}>
            <View style={styles.settingsPill}>
              <Ionicons name="settings-outline" size={18} color="#111" />
            </View>
          </TouchableOpacity>

          {/* Avatar ring — ABSOLUTE so it doesn't leave a white block behind */}
          <View style={styles.avatarRing}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../assets/sc1.png')}
                style={styles.avatar}
                contentFit="cover"
              />
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Curved sheet (like your mock) */}
      <View style={styles.sheet}>
        <Text style={styles.name}>John Doe</Text>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <Text style={styles.metaSmall}>
            Class: <Text style={styles.metaStrong}>flowrest</Text>
          </Text>
          <Text style={styles.metaSmall}>
            Rank: <Text style={styles.metaStrong}>Gold</Text>
          </Text>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <TouchableOpacity hitSlop={8}>
              <Ionicons name="ellipsis-horizontal" size={18} color="#111" />
            </TouchableOpacity>
          </View>
          <View style={styles.badgesRow}>
            {badgeImages.map((src, i) => (
              <Pressable
                key={i}
                android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
                style={styles.badgeDot}
              >
                <Image source={src as any} style={styles.badgeImg} contentFit="cover" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* My Plants */}
        <View style={[styles.section, styles.sectionGrow]}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>My Plants</Text>
            <TouchableOpacity hitSlop={8} onPress={() => navigation.navigate('Journal' as never)}>
  <Ionicons name="ellipsis-horizontal" size={18} color="#111" />
</TouchableOpacity>


          </View>

          {/* 2x2 grid that fits without scroll */}
          <View style={styles.grid}>
            {plantImages.slice(0, 4).map((src, i) => (
              <Pressable
                key={i}
                style={styles.tile}
                android_ripple={{ color: 'rgba(255,255,255,0.12)' }}
              >
                <Image source={src as any} style={styles.tileImg} contentFit="cover" />
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* ===== AUTH GATE OVERLAY (shows on every focus) ===== */}
      {gateVisible && (
        <View style={styles.gateOverlay} pointerEvents="auto">
          <View style={styles.gateCard}>
            <Text style={styles.gateTitle}>Welcome</Text>
            <Text style={styles.gateSub}>Sign in or create an account to continue</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9A9A9A"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9A9A9A"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
              android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              onPress={dismissGate}
            >
              <Text style={styles.primaryBtnText}>Log In</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
              android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
              onPress={dismissGate}
            >
              <Text style={styles.secondaryBtnText}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      )}
      {/* ===== /AUTH GATE OVERLAY ===== */}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  /** Overall page background matches the light grey sheet so no white shows through */
  root: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },

  /** Header */
  headerWrap: {
    height: HEADER_H,
    overflow: 'visible',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 14,
    zIndex: 10,
  },
  settingsPill: {
    backgroundColor: '#f2f2f2',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 3 },
    }),
  },

  /** Avatar ring — absolute to prevent the "white square behind the green circle" */
  avatarRing: {
    position: 'absolute',
    bottom: 18, // sits higher
    alignSelf: 'center',
    width: AVATAR + 10,
    height: AVATAR + 10,
    borderRadius: (AVATAR + 10) / 2,
    backgroundColor: '#C6FF00',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },

  avatarContainer: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: AVATAR * 1, // fills container more
    height: AVATAR * 1,
    borderRadius: (AVATAR * 0.95) / 2,
  },

  /** Curved sheet */
  sheet: {
    flex: 1,
    marginTop: -AVATAR / 1.5 + 10, // aligns with avatar
    backgroundColor: '#F1F1F1',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: AVATAR / 2 + 5, // so name is under avatar
    paddingHorizontal: SP * 1.25,
    paddingBottom: SP,
  },

  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SP,
    marginBottom: SP,
  },
  metaSmall: { fontSize: 12, color: '#5a5a5a' },
  metaStrong: { fontWeight: '700', color: '#111' },

  /** Sections */
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: SP,
    marginTop: SP,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 3 },
    }),
  },
  sectionGrow: {
    flex: 1, // allows the grid to occupy remaining height without scrolling
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111' },

  /** Badges */
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  badgeDot: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#141014',
    overflow: 'hidden',
  },
  badgeImg: { width: '100%', height: '100%' },

  /** Plants grid (2×2 fits) */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SP,
  },
  tile: {
    width: '47.5%',
    aspectRatio: 1.2, // slightly shorter boxes
    borderRadius: RAD,
    overflow: 'hidden',
    backgroundColor: '#241A1E',
  },
  tileImg: { width: '100%', height: '100%' },

  /** Auth Gate Overlay */
  gateOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)', // dim background
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100, // above everything
  },
  gateCard: {
    width: '86%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 50, // aligns with avatar
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
    }),
  },
  gateTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  gateSub: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    marginBottom: 14,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    marginBottom: 10,
    fontSize: 14.5,
    color: '#111',
  },
  primaryBtn: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#141014',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15.5,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryBtnText: {
    color: '#111',
    fontSize: 15.5,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
});
