import { v4 as uuidv4 } from 'uuid';

const ASTEROID_SPEED = 1;
const SPAWN_RATE = 0.05;
const MAX_ASTEROIDS = 10;

interface Asteroid {
  id: string;
  direction: number;
  distance: number;
}

export const generateAsteroids = (currentAsteroids: Asteroid[]): Asteroid[] => {
  if (currentAsteroids.length >= MAX_ASTEROIDS) return currentAsteroids;
  
  if (Math.random() < SPAWN_RATE) {
    const newAsteroid: Asteroid = {
      id: uuidv4(),
      direction: Math.floor(Math.random() * 6),
      distance: 0,
    };
    return [...currentAsteroids, newAsteroid];
  }
  return currentAsteroids;
};

export const moveAsteroids = (asteroids: Asteroid[]): Asteroid[] => {
  return asteroids
    .map(asteroid => ({
      ...asteroid,
      distance: asteroid.distance + ASTEROID_SPEED,
    }))
    .filter(asteroid => asteroid.distance < 100);
};

export const checkCollisions = (asteroids: Asteroid[]): { remainingAsteroids: Asteroid[], collided: boolean } => {
  const collidedAsteroids = asteroids.filter(asteroid => asteroid.distance > 90);
  
  return {
    remainingAsteroids: asteroids.filter(asteroid => asteroid.distance <= 90),
    collided: collidedAsteroids.length > 0,
  };
};
