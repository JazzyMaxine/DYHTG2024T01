import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, LayoutChangeEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../../contexts/GameContext';
import Hexagon from '../../components/Hexagon';
import Spaceship from '../../components/Spaceship';
import Asteroid from '../../components/Asteroid';
import { generateAsteroids, moveAsteroids, checkCollisions } from '../../utils/gameLogic';

const HEXAGON_SIDES = 6;
const ASTEROID_SPAWN_INTERVAL = 2000; // Spawn every 2 seconds (2000ms)

export default function GameScreen() {
  const router = useRouter();
  const { score, updateScore } = useGame();
  const [shipRotation, setShipRotation] = useState(0);
  const [asteroids, setAsteroids] = useState<Array<{ id: string, direction: number, distance: number }>>([]);
  const [centerX, setCenterX] = useState<number | null>(null);
  const [centerY, setCenterY] = useState<number | null>(null);
  const [collision, setCollision] = useState(false); // Track if a collision occurred

  // Move asteroids
  const moveAsteroidsInLoop = useCallback(() => {
    setAsteroids(prevAsteroids => moveAsteroids(prevAsteroids));
  }, []);

  // Check collisions
  const checkForCollisions = useCallback(() => {
    setAsteroids(prevAsteroids => {
      const { remainingAsteroids, collided } = checkCollisions(prevAsteroids);
      if (collided) {
        setCollision(true); // Set collision flag to true if a collision occurred
      }
      return remainingAsteroids;
    });
  }, []);

  // Game loop for movement and collision detection
  const gameLoop = useCallback(() => {
    moveAsteroidsInLoop();    // Move asteroids
    checkForCollisions();      // Check for collisions
  }, [moveAsteroidsInLoop, checkForCollisions]);

  // Effect to handle navigation on collision
  useEffect(() => {
    if (collision) {
      router.push('/scores'); // Navigate to the scores screen
    }
  }, [collision, router]);

  // Main game loop for moving and checking collisions
  useEffect(() => {
    if (centerX !== null && centerY !== null) {
      const intervalId = setInterval(gameLoop, 50);
      return () => clearInterval(intervalId);
    }
  }, [centerX, centerY, gameLoop]);

  // Asteroid spawning interval
  useEffect(() => {
    if (centerX !== null && centerY !== null) {
      const spawnInterval = setInterval(() => {
        setAsteroids(prevAsteroids => generateAsteroids(prevAsteroids)); // Generate new asteroids at a specific interval
        console.log('Asteroid spawned');
      }, ASTEROID_SPAWN_INTERVAL);
      
      return () => clearInterval(spawnInterval); // Clean up interval on unmount
    }
  }, [centerX, centerY]);

  const handlePress = (event: any) => {
    if (centerX === null || centerY === null) return;

    const { pageX, pageY } = event.nativeEvent;
    let angle = Math.atan2(pageY - centerY, pageX - centerX);
    const direction = Math.round(angle / (2 * Math.PI / HEXAGON_SIDES) + HEXAGON_SIDES) % HEXAGON_SIDES;
    const newRotation = (direction * (360 / HEXAGON_SIDES)) - 90;

    if (!isNaN(newRotation)) {
      setShipRotation(newRotation);
    } else {
      console.error('Invalid rotation value:', newRotation);
      setShipRotation(0);
    }
  };

  const handleAsteroidPress = useCallback((id: string) => {
    setAsteroids(prevAsteroids => {
      const asteroid = prevAsteroids.find(a => a.id === id);
      if (asteroid && asteroid.distance > 80) { // Assuming 80 is the minimum safe distance
        updateScore(score + 1); // Increment the score
        return prevAsteroids.filter(a => a.id !== id); // Remove the asteroid
      }
      return prevAsteroids;
    });
  }, [updateScore, score]);

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
            <Hexagon shipRotation={shipRotation} />
            <Spaceship rotation={shipRotation} />
            {asteroids.map((asteroid) => (
              <Asteroid
                key={asteroid.id}
                id={asteroid.id}
                direction={asteroid.direction}
                distance={asteroid.distance}
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
