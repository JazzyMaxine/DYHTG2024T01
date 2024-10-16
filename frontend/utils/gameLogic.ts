import { v4 as uuidv4 } from 'uuid';
import { IAsteroid } from '../components/Asteroid';
import { generatePolygon } from './asteroidGeneration';

const ASTEROID_SPEED = 1;
const SPAWN_RATE = 0.05;
const MAX_ASTEROIDS = 10;

const generateUniqueID = () => {
  return Math.random().toString(36).substr(2, 9); // Generate a random string
};

export const generateAsteroids = (currentAsteroids: IAsteroid[], spaceshipX: number, spaceshipY: number, onPress: (id: string)=>void): IAsteroid[] => {
  if (currentAsteroids.length >= MAX_ASTEROIDS) return currentAsteroids;

  let id =  generateUniqueID()
    const newAsteroid: IAsteroid = {
      id:id,
      direction: Math.floor(Math.random() * 6), // Random direction
      distance: 200, // Start far enough from the center (increase this if needed)
      points: generatePolygon(10, 15, 7),
      spaceshipX,
      spaceshipY,
      onPress: ()=>onPress(id),
      createdAt: Date.now() // Add createdAt timestamp
    };
    console.log("New asteroid generated:", newAsteroid); // Logging here
    return [...currentAsteroids, newAsteroid];
};

export function moveAsteroids(asteroids: IAsteroid[]) {
  return asteroids.map(asteroid => ({
    ...asteroid,
    distance: asteroid.distance - 5, // Move inward by 5 units per frame
  }));
}

export function checkCollisions(asteroids: IAsteroid[]) {
  const collided = asteroids.some(asteroid => asteroid.distance <= 10); // Check if any asteroid is too close to the center (spaceship)
  const remainingAsteroids = asteroids.filter(asteroid => asteroid.distance > 10); // Remove asteroids that reached the spaceship
  return { remainingAsteroids, collided };
}
