import React from 'react';
import { TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface AsteroidProps {
  id: string;
  direction: number;
  distance: number;
  spaceshipX: number;
  spaceshipY: number;
  onPress: () => void;
}

const Asteroid: React.FC<AsteroidProps> = ({ direction, distance, spaceshipX, spaceshipY, onPress }) => {
  const angle = direction * Math.PI / 3;
  const x = spaceshipX + Math.cos(angle) * distance;
  const y = spaceshipY + Math.sin(angle) * distance;

  return (
    <TouchableOpacity onPress={onPress} style={{ position: 'absolute', left: x - 10, top: y - 10 }}>
      <Svg height="20" width="20">
        <Circle cx="10" cy="10" r="5" fill="white" />
      </Svg>
    </TouchableOpacity>
  );
};

export default Asteroid;
