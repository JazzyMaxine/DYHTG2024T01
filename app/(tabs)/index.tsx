import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../../contexts/GameContext';
import '../../styles/fonts.css';

export default function HomeScreen() {
  const router = useRouter();
  const { highScore } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hexagon Rhythm</Text>
      <Text style={styles.highScore}>High Score: {highScore}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/game')}
      >
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontFamily: 'AsteroidsDisplay',
    fontSize: 32,
    color: '#fff',
    marginBottom: 20,
  },
  highScore: {
    fontFamily: 'AsteroidsDisplay',
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: 'AsteroidsDisplay',
    color: '#fff',
    fontSize: 18,
  },
});
