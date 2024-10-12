import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../../contexts/GameContext';



export default function ScoresScreen() {
  const { highScore } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Score</Text>
      <Text style={styles.score}>{highScore}</Text>
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
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  score: {
    fontSize: 48,
    color: '#fff',
  },
});
