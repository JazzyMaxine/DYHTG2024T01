import React, { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native'
import { useIsFocused } from '@react-navigation/native'; // Import the useIsFocused hook
import { View, StyleSheet, TouchableWithoutFeedback, LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGame } from '../../contexts/GameContext';
import * as FileSystem from 'expo-file-system';
import Hexagon from '../../components/Hexagon';
import Spaceship from '../../components/Spaceship';
import { default as Asteroid, IAsteroid } from '../../components/Asteroid';
import Explosion from '../../components/Explosion'; // Import the Explosion component
import Tracer from '../../components/Tracer'; 
import { generateAsteroids, moveAsteroids, checkCollisions } from '../../utils/gameLogic';
import { Audio } from 'expo-av'; // Import Audio module from expo-av
import beatmapS from '../../beatmaps/beatmap.json'; // Statically import the beatmap
import audioS from '../../audio/beatmap.mp3';
import { getStoredScores, saveScores } from '../../utils/scoreStorage';
import CurrentScoreBox from '@/components/CurrentScoreBox';

const HEXAGON_SIDES = 6;
const BASE_BPM = beatmapS.bpm; // Define the base BPM (e.g., 120 BPM for the song)
const beatInterval = (60 / BASE_BPM) * 1000; // Convert BPM to milliseconds
const ASTEROID_SPAWN_INTERVAL = 2000000; // Spawn every 2 seconds (2000ms)

export default function GameScreen() {
  const params = useLocalSearchParams(); // Safely access the route parameters
  const beatmapName = params.beatmapName || 'defaultBeatmap'; // Add default fallback
  const beatmapUri = params.beatmapUri || null;
  const audioUri = params.audioUri || null;
  const beatmapJson = params.beatmapJson || null;
  const audioUrl = params.audioUrl || null;

  const router = useRouter();
  const {score, updateScore, resetScore } = useGame();
  const [shipRotation, setShipRotation] = useState(0);
  const [explosions, setExplosions] = useState<Array<{ x: number, y: number }>>([]); // Track active explosions
  const [tracers, setTracers] = useState<Array<{}>>([]);
  const [asteroids, setAsteroids] = useState<Array<IAsteroid>>([]);
  const [centerX, setCenterX] = useState<number | null>(null);
  const [centerY, setCenterY] = useState<number | null>(null);
  const [collision, setCollision] = useState(false); // Track if a collision occurred
  let [layout, setLayout] = useState({ x: 0, y: 0, left: 0, top: 0, width: 0, height: 0 });
  const [currentIndex, setCurrentIndex] = useState(0); // Track beatmap index
  const [sound, setSound] = useState<Audio.Sound | null>(null); // State for the sound object
  const isFocused = useIsFocused(); // Use the hook to track if the screen is focused
  
  // Access beatmap items
  const beatmapDir = FileSystem.documentDirectory + 'beatmaps/';
  const audioDir = FileSystem.documentDirectory + 'audio/';
  const [currentBeatmap, setCurrentBeatmap] = useState(null);
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
      playDeath()

      const handleSave = async () => {
        try {
          const storedScores = await getStoredScores();
          const newScores = [...storedScores, score].sort((a, b) => b - a);
  
          // Save the updated score list
          await saveScores(newScores);
          resetScore();

          router.push('/scores');
        } catch (error) {
          console.error('Error saving scores:', error);
        }
      };
  
      handleSave();
      setCollision(false); // Reset collision state after handling it
    }
}, [collision, score, router, resetScore]);

useEffect(() => {
  let soundInstance = null;

  const loadBeatmapAndPlaySound = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web logic for loading beatmap and audio

        // Parse beatmapJson if it's a string
        let parsedBeatmapJson;
        if (typeof beatmapJson === 'string') {
          try {
            parsedBeatmapJson = JSON.parse(beatmapJson); // Parse the JSON string into an object
          } catch (error) {
            console.error("Error parsing beatmapJson:", error);
            return; // Stop execution if parsing fails
          }
        } else {
          parsedBeatmapJson = beatmapJson; // Already an object, no need to parse
        }

        // Check if the parsed object contains a valid beatmap array
        if (parsedBeatmapJson && Array.isArray(parsedBeatmapJson.beatmap)) {
          setCurrentBeatmap(parsedBeatmapJson.beatmap);  // Extract the 'beatmap' array

          // Extract the BPM and calculate beatInterval
          const BASE_BPM = parsedBeatmapJson.bpm;
          const beatInterval = (60 / BASE_BPM) * 1000; // Convert BPM to milliseconds
        } else {
          console.error("Invalid beatmapJson format, expected an object with a 'beatmap' array:", parsedBeatmapJson);
          return;
        }

        const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
        soundInstance = sound;
        setSound(sound);
        await sound.playAsync();
      } else {
        // Mobile logic for loading beatmap and audio

        // Read the beatmap from the local file using beatmapUri
        const beatmapContent = await FileSystem.readAsStringAsync(beatmapUri); // Use the provided beatmapUri
        const parsedBeatmapJson = JSON.parse(beatmapContent); // Parse the JSON content

        // Set the current beatmap
        if (parsedBeatmapJson && Array.isArray(parsedBeatmapJson.beatmap)) {
          setCurrentBeatmap(parsedBeatmapJson.beatmap);

          // Extract the BPM and calculate beatInterval
          const BASE_BPM = parsedBeatmapJson.bpm;
          const beatInterval = (60 / BASE_BPM) * 1000; // Convert BPM to milliseconds
        } else {
          console.error("Invalid beatmap format");
          return;
        }

        // Play the audio from the local file using audioUri
        const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
        soundInstance = sound;
        setSound(sound);
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Failed to load beatmap or audio:', error);
    }
  };

  if (isFocused) {
    loadBeatmapAndPlaySound(); // Load and play sound when screen is focused
  }

  return () => {
    // Clean up: Stop and unload the sound when the screen is blurred or unmounted
    if (soundInstance) {
      soundInstance.stopAsync().then(() => soundInstance.unloadAsync());
    }
  };
}, [isFocused, beatmapUri, audioUri]);  // Use beatmapUri and audioUri instead of beatmapName

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

    if (centerX !== null && centerY !== null && currentBeatmap) {
      // Start the game loop when the screen is focused
      intervalId = setInterval(gameLoop, 50); // Run game logic every 50ms

      // Start asteroid spawning based on the beatmap
      const spawnAsteroid = () => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % currentBeatmap.length;
          setAsteroids(prevAsteroids => generateAsteroids(prevAsteroids)); // Generate asteroids

          const nextSpawnTime = beatInterval * currentBeatmap[prevIndex]; // Adjust timing based on beatmap value

          if (!isNaN(nextSpawnTime)) {
            timeoutId = setTimeout(spawnAsteroid, nextSpawnTime); // Schedule next spawn
          }
          return nextIndex;
        });
      };

      // Start spawning asteroids based on the beatmap
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
        setAsteroids(prevAsteroids => generateAsteroids(prevAsteroids, centerX, centerY)); // Generate new asteroids at a specific interval
      }, ASTEROID_SPAWN_INTERVAL); //TODO REMOVE
      
      return () => clearInterval(spawnInterval); // Clean up interval on unmount
    }
  }, [centerX, centerY]);

  const VICINITY_ANGLE = 30; // ±30 degrees around the hexagon side
  const MAX_DISTANCE = 120; // The max distance where a collision with the hexagon side can occur (adjust this based on the size of the hexagon)
  const PERF_DISTANCE = 87;

  const handlePress = (event: any) => {
  if (centerX === null || centerY === null) return;

  let { pageX, pageY } = event.nativeEvent;
  // Log touch event coordinates to debug

  // Adjust for the layout offset
  // Use Platform.OS to check if running on mobile or web
    pageX -= layout.left;
    pageY -= layout.top;
  // Calculate the angle of the touch event relative to the center
  let angle = Math.atan2(pageY - centerY, pageX - centerX);

  // Make sure the angle calculation is valid (log to debug)
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

  
  // Define explosion and tracer lifespans
  const EXPLOSION_LIFESPAN = 500; // 500ms
  const TRACER_LIFESPAN = 300; // 300ms
  const ASTEROID_LIFESPAN = 5000


  async function playFire() {
    const { sound } = await Audio.Sound.createAsync(
      require('../../audio/fire.wav')  // Ensure this file exists in the path
    );
    setSound(sound);
    await sound.playAsync();
  }

  async function playDeath() {
    const { sound } = await Audio.Sound.createAsync(
      require('../../audio/bangSmall.wav')  // Ensure this file exists in the path
    );
    setSound(sound);
    await sound.playAsync();
  }

const checkAndHandleAsteroidCollisions = useCallback((rotation: number) => {
  playFire();

  setAsteroids(prevAsteroids => {
    let scoreDelta = 0; // Track how many asteroids were removed to update the score
    let isUpdated = false;

    const updatedAsteroids = prevAsteroids.filter(asteroid => {
      const asteroidAngle = (asteroid.direction * (360 / HEXAGON_SIDES)) - 90;
      const isWithinVicinity = Math.abs((rotation - asteroidAngle + 360) % 360) <= VICINITY_ANGLE;
      const isWithinDistance = asteroid.distance <= MAX_DISTANCE;

      if (isWithinVicinity && isWithinDistance) {
        playDeath();
        isUpdated = true;

        const D = MAX_DISTANCE - PERF_DISTANCE;
        let d = Math.abs(asteroid.distance - PERF_DISTANCE);
        d = d > 33 ? 33 : d;
        scoreDelta += Math.round(100 * (1 - (d / D) ** 2));

        // Calculate asteroid position based on direction and distance
        const angle = asteroid.direction * Math.PI / 3;
        const asteroidX = centerX + Math.cos(angle) * asteroid.distance;
        const asteroidY = centerY + Math.sin(angle) * asteroid.distance;
        const tipX = centerX + Math.cos(angle) * 20;
        const tipY = centerY + Math.sin(angle) * 20;

        // Add explosion to state with timestamp
        setExplosions(prevExplosions => [
          ...prevExplosions, 
          { x: asteroidX, y: asteroidY, createdAt: Date.now() }
        ]);

        // Add tracer to state with timestamp
        setTracers(prevTracers => [
          ...prevTracers, 
          { x1: tipX, y1: tipY, x2: asteroidX, y2: asteroidY, createdAt: Date.now() }
        ]);

        return false; // Remove this asteroid
      }

      return true; // Keep this asteroid
    });

    if (!isUpdated) {
      // No asteroid collision, but we can create a tracer
      const direction = (rotation + 90) * HEXAGON_SIDES / 360;
      const angle = direction * Math.PI / 3;
      const tipX = centerX + Math.cos(angle) * 20;
      const tipY = centerY + Math.sin(angle) * 20;
      const tailX = centerX + Math.cos(angle) * MAX_DISTANCE;
      const tailY = centerY + Math.sin(angle) * MAX_DISTANCE;

      // Add tracer to state with timestamp
      setTracers(prevTracers => [
        ...prevTracers, 
        { x1: tipX, y1: tipY, x2: tailX, y2: tailY, createdAt: Date.now() }
      ]);
    }

    if (scoreDelta > 0) {
      setTimeout(() => {
        updateScore(score + scoreDelta); // Update score after the render phase
      }, 0);
    }

    return updatedAsteroids;
  });
}, [updateScore, score, centerX, centerY]);


const handleLayout = useCallback((event: LayoutChangeEvent) => {
  const { x, y, width, height } = event.nativeEvent.layout;

  // On mobile, `left` and `top` are usually undefined, so use `x` and `y` instead
  const left = Platform.OS === 'web' ? event.nativeEvent.layout.left : x;
  const top = Platform.OS === 'web' ? event.nativeEvent.layout.top : y;

  // Log to verify the layout values
  console.log('Layout:', { left, top, width, height });

  // Update layout state and calculate center coordinates
  setLayout({ x, y, left, top, width, height });
  setCenterX(width / 2);
  setCenterY(height / 2);
}, []);



// Remove expired explosions
useEffect(() => {
  const interval = setInterval(() => {
    setExplosions(prevExplosions =>
      prevExplosions.filter(explosion => {
        return explosion.createdAt && (Date.now() - explosion.createdAt < EXPLOSION_LIFESPAN);
      })
    );
  }, 100); // Check every 100ms

  return () => clearInterval(interval);
}, []);

// Remove expired asteroids
useEffect(() => {
  const interval = setInterval(() => {
    setAsteroids(prevAsteroids =>
      prevAsteroids.filter(asteroid => {
        return asteroid.createdAt && (Date.now() - asteroid.createdAt < ASTEROID_LIFESPAN);
      })
    );
  }, 100); // Check every 100ms

  return () => clearInterval(interval);
}, []);

// Remove expired tracers
useEffect(() => {
  const interval = setInterval(() => {
    setTracers(prevTracers =>
      prevTracers.filter(tracer => {
        return tracer.createdAt && (Date.now() - tracer.createdAt < TRACER_LIFESPAN);
      })
    );
  }, 100); // Check every 100ms

  return () => clearInterval(interval);
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
              />
            ))}
            {explosions.map((explosion, index) => (
              <Explosion key={index} x={explosion.x} y={explosion.y} />
            ))}
            {tracers.map((tracer, index) =>(
              <Tracer key={index} x1={tracer.x1} y1={tracer.y1} x2={tracer.x2} y2={tracer.y2} />
            ))}
          </>
        )}
        {/* Note, box doesn't expand to fit numbers in the thousands but it's fine */}
        <View style={styles.currentScoreBox}>
          <CurrentScoreBox score={score} />
        </View>
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
  currentScoreBox: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
});
