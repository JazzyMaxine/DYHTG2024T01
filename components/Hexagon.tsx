import React from 'react';
import Svg, { Polygon, Line } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

interface HexagonProps {
  shipRotation: number; // Pass the spaceship's rotation
}

const Hexagon: React.FC<HexagonProps> = ({ shipRotation }) => {
  // Hexagon points (calculated for a 100x100 viewbox)
  const hexagonPoints = [
    { x1: 50, y1: 10, x2: 90, y2: 35 }, // Top-right
    { x1: 90, y1: 35, x2: 90, y2: 65 }, // Right
    { x1: 90, y1: 65, x2: 50, y2: 90 }, // Bottom-right
    { x1: 50, y1: 90, x2: 10, y2: 65 }, // Bottom-left
    { x1: 10, y1: 65, x2: 10, y2: 35 }, // Left
    { x1: 10, y1: 35, x2: 50, y2: 10 }, // Top-left
  ];

  // Determine which side to highlight based on ship rotation
  const sideIndex = Math.floor((shipRotation + 360) % 360 / 60); // 60 degrees per side

  return (
    <View style={styles.container}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        {/* Hexagon outline */}
        <Polygon
          points="50,10 90,35 90,65 50,90 10,65 10,35"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Red line over the side the spaceship points to */}
        {hexagonPoints[sideIndex] && (
          <Line
            x1={hexagonPoints[sideIndex].x1}
            y1={hexagonPoints[sideIndex].y1}
            x2={hexagonPoints[sideIndex].x2}
            y2={hexagonPoints[sideIndex].y2}
            stroke="red"
            strokeWidth="4"
          />
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Hexagon;
