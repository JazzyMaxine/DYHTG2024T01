import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../../contexts/GameContext';
import { getStoredScores, saveScores } from '../../utils/scoreStorage';
import { useFocusEffect } from '@react-navigation/native';

export type ScoreScreenProps = {
  highScoreList: number[];
};

const ScoresScreen: React.FC = () => {
    const [scores, setScores] = useState<number[]>([50,40,30,20,10]); // default scores

    const loadScores = async () => {
      try {
        const storedScores = await getStoredScores();
        console.warn(storedScores)
        if (storedScores.length > 0) {
          setScores(storedScores);
        }
      } catch (error) {
        console.error('Error loading scores:', error);
      }
    };

    useEffect(() => {
      loadScores();
    }, []);


    useFocusEffect(
      useCallback(() => {
        loadScores()
      }, [])
    );

    const topScores = scores.slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.scoresContainer}>
        <Text style={styles.title}>
          High Scores
        </Text>
        {topScores.map((score, index) => (
          <Text key={index} style={styles.score}>
            {score}
          </Text>
        ))}
        </View>
    </View>
  );
};

export default ScoresScreen;

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
