import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

interface SpaceshipProps {
  rotation: number;
}

const Spaceship: React.FC<SpaceshipProps> = ({ rotation }) => {
  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" viewBox="0 0 100 100">
        <Polygon
          points="50,30 60,50 50,70 40,50" // Centered points
          fill="yellow"
          origin="50,50" // Center point of the SVG canvas
          rotation={rotation} // Rotate around the center
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100, // Set size for the spaceship
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Spaceship;
