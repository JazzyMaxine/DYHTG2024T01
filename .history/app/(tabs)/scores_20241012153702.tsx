import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../../contexts/GameContext';

let highScoreList: number[] = [100, 200, 300, 400, 500]; //placeholder scores

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
    flex d
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
