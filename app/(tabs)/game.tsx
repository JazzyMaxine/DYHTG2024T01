import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../../contexts/GameContext';
import Hexagon from '../../components/Hexagon';
import Spaceship from '../../components/Spaceship';
import Asteroid from '../../components/Asteroid';
import GameControls from '../../components/GameControls';
import { generateAsteroids, moveAsteroids, checkCollisions } from '../../utils/gameLogic';

export default function GameScreen() {
  const router = useRouter();
  const { updateScore } = useGame();
  const [shipRotation, setShipRotation] = useState(0);
  const [asteroids, setAsteroids] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setAsteroids(prevAsteroids => {
        const movedAsteroids = moveAsteroids(prevAsteroids);
        const newAsteroids = generateAsteroids(movedAsteroids);
        const { remainingAsteroids, collided } = checkCollisions(newAsteroids, shipRotation);
        
        if (collided) {
          setGameOver(true);
          clearInterval(gameLoop);
          router.push('/scores');
        }

        updateScore(prevScore => prevScore + 1);
        return remainingAsteroids;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [shipRotation, router, updateScore]);

  const rotateShip = (direction: number) => {
    setShipRotation(direction * 60);
  };

  return (
    <View style={styles.container}>
      <Hexagon />
      <Spaceship rotation={shipRotation} />
      {asteroids.map((asteroid, index) => (
        <Asteroid key={index} {...asteroid} />
      ))}
      <GameControls onRotate={rotateShip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
