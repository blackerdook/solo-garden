// screens/UserW.tsx
import React, { useRef, useState } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import Guide from '../components/Guide';
import SkipButton from '../components/SkipButton';

const { width } = Dimensions.get('window');

type UserWProps = { onSkip: () => void };

type GuideItem = {
  key: number;
  title: string;
  description: string;
  image: any; // require(...)
  buttonText?: string;
};

const UserW: React.FC<UserWProps> = ({ onSkip }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<GuideItem>>(null);

  const guides: GuideItem[] = [
    {
      key: 1,
      title: 'Welcome',
      description: 'Earn XP, discover new plants, and become a garden master!',
      image: require('../assets/bg1.jpg'),
      buttonText: "Let’s get growing.",
    },
    { key: 2, title: '', description: '', image: require('../assets/Test.png') },
    { key: 3, title: '', description: '', image: require('../assets/g2.png') },
    { key: 4, title: '', description: '', image: require('../assets/g3.png') },
    { key: 5, title: '', description: '', image: require('../assets/g4.png') },
  ];

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenGuide', 'true');
    onSkip();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };

  // Optional checkbox — no gating
  const handleNext = () => {
    flatListRef.current?.scrollToIndex({ index: 1, animated: true });
  };

  return (
    <View style={styles.container}>
      <SkipButton onPress={handleSkip} />

      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={guides}
        keyExtractor={(item) => item.key.toString()}
        renderItem={({ item, index }) => (
          <View style={{ width, flex: 1 }}>
            <Guide
              item={item}
              onNext={index === 0 ? handleNext : undefined}
            />

            {/* Optional Terms & Conditions on slide 1 (does NOT block the button) */}
            {index === 0 && (
              <View style={styles.tcRowOuter} pointerEvents="box-none">
                <View style={styles.tcRowInner} pointerEvents="auto">
                  <Checkbox
                    value={acceptedTerms}
                    onValueChange={async (v) => {
                      setAcceptedTerms(v);
                      // store if you want to read later (optional)
                      try { await AsyncStorage.setItem('acceptedTerms', JSON.stringify(v)); } catch {}
                    }}
                    style={styles.checkbox}
                    accessibilityLabel="Accept Terms and Conditions"
                  />
                  <Text style={styles.tcText}>
                    I agree to the <Text style={styles.tcLink}>Terms & Conditions</Text>
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Page dots */}
      <View style={styles.indicatorContainer}>
        {guides.map((item, index) => (
          <View
            key={item.key.toString()}
            style={[styles.indicator, index === activeIndex && styles.activeIndicator]}
          />
        ))}
      </View>

      {/* Continue button on last slide */}
      {activeIndex === guides.length - 1 && (
        <TouchableOpacity style={styles.continueButton} onPress={handleSkip}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserW;

const styles = StyleSheet.create({
  container: { flex: 1 },

  // --- Page indicators
  indicatorContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    zIndex: 5,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeIndicator: { backgroundColor: 'black' },

  // --- Continue (last slide)
  continueButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    zIndex: 5,
  },
  continueText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // --- Terms & Conditions row (absolute, below CTA; optional only)
  tcRowOuter: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 80, // adjust to sit under your "Let’s get growing." button
    zIndex: 10,
  },
  tcRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    ...Platform.select({
      ios: { },
      android: { },
    }),
  },
  checkbox: { width: 20, height: 20, marginRight: 8 },
  tcText: { fontSize: 14 },
  tcLink: { textDecorationLine: 'underline' },
});
