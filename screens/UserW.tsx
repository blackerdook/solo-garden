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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Guide from '../components/Guide';
import SkipButton from '../components/SkipButton';
import scq1 from '../assets/sc1.png';
import scq3 from '../assets/sc3.png';

const { width } = Dimensions.get('window');

type UserWProps = {
  onSkip: () => void;
};

const UserW: React.FC<UserWProps> = ({ onSkip }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const guides = [
    {
      key: 1,
      title: 'Welcome',
      description: 'Earn XP, discover new plants, and become a garden master!',
      image: require('../assets/bg1.jpg'),
      buttonText: "Let’s get growing.",
    },
    {
      key: 2,
      title: '',
      description: '',
      image: require('../assets/sc1.png'),
    },
    {
      key: 3,
      title: '',
      description: '',
      image: require('../assets/sc1.png'),

    },
    {
      key: 4,
      title: '',
      description: '',
      image: require('../assets/sc3.png'),
    },
    {
      key: 5,
      title: '',
      description: '',
      image: require('../assets/sc1.png'),

    }
  ];

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenGuide', 'true');
    onSkip();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };

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
          <Guide item={item} onNext={index === 0 ? handleNext : undefined} />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.indicatorContainer}>
        {guides.map((item, index) => (
          <View
            key={item.key.toString()}
            style={[
              styles.indicator,
              index === activeIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

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
  container: {
    flex: 1,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: 'black',
  },
  continueButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
