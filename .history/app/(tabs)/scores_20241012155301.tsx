import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../../contexts/GameContext';

let highScoreList: number[] = [100, 200, 300, 400, 500]; //placeholder scores

export default function ScoresScreen() {
  const { highScore } = useGame();

  return (
    <View style={styles.container}>
      <View style={styles.scoresContainer}>
        for 
      </View>
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
  scoresContainer: {
    borderColor: 'grey',
    borderWidth: 1,
    border radi
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
