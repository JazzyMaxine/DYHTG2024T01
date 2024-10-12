import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

interface SpaceshipProps {
  rotation: number;
}

const Spaceship: React.FC<SpaceshipProps> = ({ rotation }) => {
  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" viewBox="-12.5 -12.5 25 25"> 
        <Polygon
          points="0,4 -3,-4 0,-3 3,-4" // Scaled-down points
          fill="empty"
          stroke="white"
          strokeWidth="1"
          origin="0,0"
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
