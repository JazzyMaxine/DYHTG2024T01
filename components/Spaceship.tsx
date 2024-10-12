import React from 'react';
import Svg, { Polygon } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

interface SpaceshipProps {
  rotation: number;
}

const Spaceship: React.FC<SpaceshipProps> = ({ rotation }) => {
  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" viewBox="0 0 100 100">
        <Polygon
          points="50,40 55,50 50,60 45,50"
          fill="yellow"
          origin="150, 50"
          rotation={rotation}
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

export default Spaceship;
