import React, { useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

interface SpaceshipProps {
  rotation: number;
}

const kickbackXAnim = useRef(new Animated.Value(0)).current;
const kickbackYAnim = useRef(new Animated.Value(0)).current;

export const handleShoot = ( rotation: number ) => {

  console.warn(rotation)

  const angle = (((rotation + 450) % 360) / 360) * 2 * Math.PI;
  // Kickback animation (move polygon back a little, then forward)
  Animated.parallel([
    Animated.sequence([
      // Kickback (move backward)
      Animated.timing(kickbackXAnim, {
        toValue: -6 * Math.cos(angle), // Move back by 20 pixels (can be adjusted)
        duration: 30, // Quick kickback duration
        useNativeDriver: true,
      }),
      // Spring forward back to the original position
      Animated.spring(kickbackXAnim, {
        toValue: 0, // Return to original position
        useNativeDriver: true,
      }),
    ]),
    Animated.sequence([
      // Kickback (move backward)
      Animated.timing(kickbackYAnim, {
        toValue: -6 * Math.sin(angle), // Move back by 20 pixels (can be adjusted)
        duration: 30, // Quick kickback duration
        useNativeDriver: true,
      }),
      // Spring forward back to the original position
      Animated.spring(kickbackYAnim, {
        toValue: 0, // Return to original position
        useNativeDriver: true,
      }),
    ]),
  ]).start();
};

const Spaceship: React.FC<SpaceshipProps> = ({ rotation }) => {
  return (
    <Animated.View 
          style = {[ 
            {
              transform: [
                { translateX: kickbackXAnim },
                { translateY: kickbackYAnim },
              ],
            },
          ]}
    >
    <View style={styles.container}>
      <Svg height="100%" width="100%" viewBox="-12.5 -12.5 25 25"> 
        <Polygon
          points="0,4 -3,-4 0,-3 3,-4" // Scaled-down points
          fill="black"
          stroke="white"
          strokeWidth="1"
          origin="0,0"
          rotation={rotation} // Rotate around the center
        />
      </Svg>
    </View>
    </Animated.View>
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
