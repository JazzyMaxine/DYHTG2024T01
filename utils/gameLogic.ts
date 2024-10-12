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

    const newAsteroid: Asteroid = {
      id: uuidv4(),
      direction: Math.floor(Math.random() * 6), // Random direction
      distance: 200, // Start far enough from the center (increase this if needed)
    };
    return [...currentAsteroids, newAsteroid];
};git 

export function moveAsteroids(asteroids) {
  return asteroids.map(asteroid => ({
    ...asteroid,
    distance: asteroid.distance - 5, // Move inward by 5 units per frame
  }));
}

export function checkCollisions(asteroids) {
  const collided = asteroids.some(asteroid => asteroid.distance <= 10); // Check if any asteroid is too close to the center (spaceship)
  const remainingAsteroids = asteroids.filter(asteroid => asteroid.distance > 10); // Remove asteroids that reached the spaceship
  return { remainingAsteroids, collided };
}
