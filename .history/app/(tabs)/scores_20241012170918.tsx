import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../../contexts/GameContext';

let highScoreList: number[] = [100, 200, 300, 400, 500]; //placeholder scores

const ScoresScreen = () => {
  
}

export default function ScoresScreen() {
  const { highScore } = useGame();

  return (
    <View style={styles.container}>
      <View style={styles.scoresContainer}>
        <Text style={styles.title}>
          High Scores
        </Text>

        {highScoreList.sort().map((score, index) => (
          <Text key={index} style={styles.score}>
            {score}
          </Text>
        ))}
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    padding: 30,
  },
  title: {
    fontFamily: 'AsteroidsDisplay',
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  score: {
    fontFamily: 'AsteroidsDisplay',
    fontSize: 48,
    color: '#fff',
  },
});
