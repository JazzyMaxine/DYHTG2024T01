import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, LayoutChangeEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../../contexts/GameContext';
import Hexagon from '../../components/Hexagon';
import Spaceship from '../../components/Spaceship';
import Asteroid from '../../components/Asteroid';
import { generateAsteroids, moveAsteroids, checkCollisions } from '../../utils/gameLogic';

const HEXAGON_SIDES = 6;

export default function GameScreen() {
  const router = useRouter();
  const { score, updateScore } = useGame();
  const [shipRotation, setShipRotation] = useState(0);
  const [asteroids, setAsteroids] = useState<Array<{ id: string, direction: number, distance: number }>>([]);
  const [centerX, setCenterX] = useState<number | null>(null);
  const [centerY, setCenterY] = useState<number | null>(null);

  const gameLoop = useCallback(() => {
    setAsteroids(prevAsteroids => {
      const movedAsteroids = moveAsteroids(prevAsteroids);
      const newAsteroids = generateAsteroids(movedAsteroids);
      const { remainingAsteroids, collided } = checkCollisions(newAsteroids);
      
      if (collided) {
        router.push('/scores');
      }
      
      return remainingAsteroids;
    });
  }, [router]);

  useEffect(() => {
    if (centerX !== null && centerY !== null) {
      const intervalId = setInterval(gameLoop, 50);
      return () => clearInterval(intervalId);
    }
  }, [centerX, centerY, gameLoop]);

const handlePress = (event: any) => {
  if (centerX === null || centerY === null) return;

  const { pageX, pageY } = event.nativeEvent;
  console.log(event.nativeEvent.pageX,event.nativeEvent.pageY)
  // Calculate the angle and ensure the result is valid
  let angle = Math.atan2(pageY - centerY, pageX - centerX);

  // Ensure that `direction` is a valid number and handle edge cases
  const direction = Math.round(angle / (2 * Math.PI / HEXAGON_SIDES) + HEXAGON_SIDES) % HEXAGON_SIDES;

  // Calculate the ship's rotation safely, defaulting to 0 if there's any issue
  const newRotation = (direction * (360 / HEXAGON_SIDES)) - 90;

  // Ensure it's not NaN
  if (!isNaN(newRotation)) {
    setShipRotation(newRotation);
  } else {
    console.error('Invalid rotation value:', newRotation);
    setShipRotation(0); // Fallback to 0 or any default value
  }
};

  const handleAsteroidPress = useCallback((id: string) => {
    setAsteroids(prevAsteroids => {
      const asteroid = prevAsteroids.find(a => a.id === id);
      if (asteroid && asteroid.distance > 80) {
        updateScore(prevScore => prevScore + 1);
        return prevAsteroids.filter(a => a.id !== id);
      }
      return prevAsteroids;
    });
  }, [updateScore]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCenterX(width / 2);
    setCenterY(height / 2);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container} onLayout={handleLayout}>
        {centerX !== null && centerY !== null && (
          <>
            <Hexagon />
            <Spaceship rotation={shipRotation} />
            {asteroids.map((asteroid) => (
              <Asteroid
                key={asteroid.id}
                {...asteroid}
                spaceshipX={centerX}
                spaceshipY={centerY}
                onPress={() => handleAsteroidPress(asteroid.id)}
              />
            ))}
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
