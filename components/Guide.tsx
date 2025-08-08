import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

type GuideItem = {
  key: number;
  title: string;
  description: string;
  image: any;
  buttonText?: string;
};

type GuideProps = {
  item: GuideItem;
  onNext?: () => void;
};

const Guide: React.FC<GuideProps> = ({ item, onNext }) => {
  const isFirst = item.key === 1;

  return (
    <ImageBackground source={item.image} style={styles.slide} resizeMode="cover">
      {isFirst && (
        <View style={styles.contentBox}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

          {item.buttonText && (
            <TouchableOpacity style={styles.button} onPress={onNext}>
              <Text style={styles.buttonText}>{item.buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ImageBackground>
  );
};

export default Guide;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  slide: {
    width,
    height,
    justifyContent: 'flex-end',
  },
  contentBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 120,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
