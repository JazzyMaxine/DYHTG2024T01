import React from 'react';
import Svg, { Polygon, Line } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

interface HexagonProps {
  shipRotation: number; // Pass the spaceship's rotation
}

const Hexagon: React.FC<HexagonProps> = ({ shipRotation }) => {
  // Hexagon points (calculated for a 100x100 viewbox)
  let hexagonPoints: any[] = [];
  const rot_step = 2*Math.PI / 6
  const radius = 100
  for (let i = 0; i < 6; i ++) {
    const theta = rot_step * (i + 0.5)
    const point = {
      x: Math.cos(theta) * radius,
      y: Math.sin(theta) * radius,
    }
    hexagonPoints.push(point)
  }

  // TODO: FIX THE MATHS HERE THIS IS SO CURSED
  // Calculate the correct hexagon side the spaceship is pointing to
  const sideIndex = (Math.floor((shipRotation % 360) / 60)+2) % 6;

  return (
    <View style={styles.container}>
      <Svg height="200" width="200" viewBox="-100 -100 200 200">
        {/* Hexagon outline */}
        <Polygon
          points={ 
            hexagonPoints[0].x + "," + hexagonPoints[0].y + " "
            + hexagonPoints[1].x + "," + hexagonPoints[1].y + " "
            + hexagonPoints[2].x + "," + hexagonPoints[2].y + " "
            + hexagonPoints[3].x + "," + hexagonPoints[3].y + " "
            + hexagonPoints[4].x + "," + hexagonPoints[4].y + " "
            + hexagonPoints[5].x + "," + hexagonPoints[5].y
          }
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Red line over the side the spaceship points to */}
        {hexagonPoints[sideIndex] && (
          <Line
            x1={hexagonPoints[(sideIndex+5) % 6].x}
            y1={hexagonPoints[(sideIndex+5) % 6].y}
            x2={hexagonPoints[(sideIndex) % 6].x}
            y2={hexagonPoints[(sideIndex) % 6].y}
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
