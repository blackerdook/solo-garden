import React from 'react';
import { View, StyleSheet } from 'react-native';

type SlideIndicatorsProps = {
  total: number;
  activeIndex: number;
};

const SlideIndicators: React.FC<SlideIndicatorsProps> = ({ total, activeIndex }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            index === activeIndex && styles.activeIndicator,
          ]}
        />
      ))}
    </View>
  );
};

export default SlideIndicators;

const styles = StyleSheet.create({
  container: {
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
});
