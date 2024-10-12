import React from 'react';
import { TouchableOpacity } from 'react-native';
import Svg, { Polygon, Circle } from 'react-native-svg';
import { generatePolygon } from '../utils/asteroidGeneration';

export interface IAsteroid {
  id: string;
  direction: number;
  distance: number;
  spaceshipX: number;
  spaceshipY: number;
  points: string;
  onPress: () => void;
}

const Asteroid: React.FC<IAsteroid> = ({ direction, distance, spaceshipX, spaceshipY, points, onPress }) => {
  const angle = direction * Math.PI / 3;
  const x = spaceshipX + Math.cos(angle) * distance;
  const y = spaceshipY + Math.sin(angle) * distance;

  return (
    <TouchableOpacity onPress={onPress} style={{ position: 'absolute', left: x - 10, top: y - 10 }}>
      <Svg height="40" width="40" viewBox='-20,-20,40,40'>
        <Polygon 
          points={points}
          fill="none"
          stroke="white"
          strokeWidth="1"
          origin="0,0"
          // rotation={rotation} // Rotate around the center
        />
        <Circle 
          cx={0}
          cy={0}
          r={1}
          fill="white"
        />
      </Svg>
    </TouchableOpacity>
  );
};

export default Asteroid;
