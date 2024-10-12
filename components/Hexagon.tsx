import React from 'react';
import Svg, { Polygon } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

const Hexagon: React.FC = () => {
  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" viewBox="0 0 100 100">
        <Polygon
          points="50,3 97,25 97,75 50,97 3,75 3,25"
          fill="none"
          stroke="white"
          strokeWidth="1"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Hexagon;
