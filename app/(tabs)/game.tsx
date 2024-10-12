import React, { useState, useEffect, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native'; // Import the useIsFocused hook
import { View, StyleSheet, TouchableWithoutFeedback, LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../../contexts/GameContext';
import Hexagon from '../../components/Hexagon';
import Spaceship from '../../components/Spaceship';
import { default as Asteroid, IAsteroid } from '../../components/Asteroid';
import Explosion from '../../components/Explosion'; // Import the Explosion component
import { generateAsteroids, moveAsteroids, checkCollisions } from '../../utils/gameLogic';
import beatmapS from '../../beatmaps/beatmap.json'; // Statically import the beatmap
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { getStoredScores, saveScores } from '../../utils/scoreStorage';

const HEXAGON_SIDES = 6;
const BASE_BPM = beatmapS.bpm; // Define the base BPM (e.g., 120 BPM for the song)
const beatInterval = (60 / BASE_BPM) * 1000; // Convert BPM to milliseconds
const ASTEROID_SPAWN_INTERVAL = 2000; // Spawn every 2 seconds (2000ms)

export default function GameScreen() {
  const router = useRouter();
  const { score, updateScore, resetScore } = useGame();
  const [shipRotation, setShipRotation] = useState(0);
  const [asteroids, setAsteroids] = useState<Array<IAsteroid>>([]);
  const [explosions, setExplosions] = useState<Array<{ x: number, y: number }>>([]); // Track active explosions
  const [centerX, setCenterX] = useState<number | null>(null);
  const [centerY, setCenterY] = useState<number | null>(null);
  const [collision, setCollision] = useState(false); // Track if a collision occurred
  let [layout, setLayout] = useState({ x: 0, y: 0, left: 0, top: 0, width: 0, height: 0 });
  const [currentIndex, setCurrentIndex] = useState(0); // Track beatmap index
  const isFocused = useIsFocused(); // Use the hook to track if the screen is focused
  
  // Access beatmap items
  const currentBeatmap = beatmapS.beatmap;
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
      const handleSave = async () => {
        try {
          const storedScores = await getStoredScores();
          const newScores = [...storedScores, score].sort((a, b) => b - a);
  
          // Save the updated score list
          await saveScores(newScores);
          router.push('/scores');
          resetScore();
        } catch (error) {
          console.error('Error saving scores:', error);
        }
      };
  
      handleSave();
    }
  }, [collision, score, router, resetScore]);
  
useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    let timeoutId: NodeJS.Timeout | undefined;

    if (isFocused) {
      // Reset state when the screen gains focus
      setAsteroids([]); // Clear asteroids
      setExplosions([]); // Clear explosions
      setCurrentIndex(0); // Reset the beatmap index
      resetScore(); // Reset the score
      setCollision(false); // Reset collision state

      if (centerX !== null && centerY !== null && beatmapS && currentBeatmap) {
        // Start the game loop when the screen is focused
        intervalId = setInterval(gameLoop, 50); // Run game logic every 50ms

        // Start asteroid spawning based on the beatmap
        const spawnAsteroid = () => {
          setAsteroids(prevAsteroids => generateAsteroids(prevAsteroids)); // Generate asteroids
          console.log('Asteroid spawned on beat subdivision:', currentBeatmap[currentIndex]);

          // Move to the next beat subdivision in the beatmap
          setCurrentIndex((prevIndex) => (prevIndex + 1) % currentBeatmap.length);
          const nextSpawnTime = beatInterval * currentBeatmap[currentIndex]; // Adjust timing based on beatmap value

          // Schedule the next asteroid spawn
          timeoutId = setTimeout(spawnAsteroid, nextSpawnTime);
        };

        // Start spawning asteroids
        const initialSpawnTime = beatInterval * currentBeatmap[currentIndex];
        timeoutId = setTimeout(spawnAsteroid, initialSpawnTime);
      }
    } else {
      // Screen is blurred, stop game logic and clear timers
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    }

    // Clean up when the component unmounts or screen loses focus
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isFocused, centerX, centerY, gameLoop, beatInterval, currentBeatmap]);

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

  const VICINITY_ANGLE = 30; // ±30 degrees around the hexagon side
  const MAX_DISTANCE = 90; // The max distance where a collision with the hexagon side can occur (adjust this based on the size of the hexagon)

  const handlePress = (event: any) => {
    if (centerX === null || centerY === null) return;

    let { pageX, pageY } = event.nativeEvent;
    pageX -= layout.left
    pageY -= layout.top
    let angle = Math.atan2(pageY - centerY, pageX - centerX);
    const direction = Math.floor((angle - Math.PI / HEXAGON_SIDES) / (2 * Math.PI / HEXAGON_SIDES) - 1) % HEXAGON_SIDES;
    const newRotation = (direction * (360 / HEXAGON_SIDES)) + 30;

    if (!isNaN(newRotation)) {
      setShipRotation(newRotation);
      // Update asteroids after the spaceship moves
      checkAndHandleAsteroidCollisions(newRotation);
    } else {
      console.error('Invalid rotation value:', newRotation);
      setShipRotation(0);
    }
  };

const checkAndHandleAsteroidCollisions = useCallback((rotation: number) => {
  setAsteroids(prevAsteroids => {
    let scoreDelta = 0; // Track how many asteroids were removed to update the score
    const updatedAsteroids = prevAsteroids.filter(asteroid => {
      const asteroidAngle = (asteroid.direction * (360 / HEXAGON_SIDES)) - 90;
      const isWithinVicinity = Math.abs((rotation - asteroidAngle + 360) % 360) <= VICINITY_ANGLE;
      const isWithinDistance = asteroid.distance <= MAX_DISTANCE;

      if (isWithinVicinity && isWithinDistance) {
        scoreDelta += 1; // Increment score for each removed asteroid

        // Calculate asteroid position based on direction and distance
        const angle = asteroid.direction * Math.PI / 3;
        const asteroidX = centerX + Math.cos(angle) * asteroid.distance;
        const asteroidY = centerY + Math.sin(angle) * asteroid.distance;

        // Trigger an explosion at the asteroid's position
        setExplosions(prevExplosions => [...prevExplosions, { x: asteroidX, y: asteroidY }]);

        return false; // Remove this asteroid
      }
      return true; // Keep this asteroid
    });

    if (scoreDelta > 0) {
      setTimeout(() => {
        updateScore(score + scoreDelta); // Update score after the render phase
      }, 0);
    }

    return updatedAsteroids;
  });
}, [updateScore, score, centerX, centerY]);


  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, left, top, width, height } = event.nativeEvent.layout;
    setLayout({ x, y, left, top, width, height });
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
                points={asteroid.points}
                onPress={() => {}}
              />
            ))}
            {explosions.map((explosion, index) => (
              <Explosion key={index} x={explosion.x} y={explosion.y} />
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
