import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type SkipButtonProps = {
  onPress: () => void;
};

const SkipButton: React.FC<SkipButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.skipButton}>
      <Text style={styles.skipText}>Skip</Text>
    </TouchableOpacity>
  );
};

export default SkipButton;

const styles = StyleSheet.create({
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
  },
  skipText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
