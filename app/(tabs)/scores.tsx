import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../../contexts/GameContext';
import { getStoredScores, saveScores } from '../../utils/scoreStorage';

export type ScoreScreenProps = {
  highScoreList: number[];
};

const ScoresScreen: React.FC<ScoreScreenProps> = ({highScoreList = [50,40,30,20,10]}) => {
    const [scores, setScores] = useState<number[]>(highScoreList);

    useEffect(() => {
        loadScores();
    }, []);

    // load scores 
    const loadScores = async () => {
        try {
            const storedScores = await getStoredScores();
            if (storedScores.length > 0) {
                setScores(storedScores);
            }
        } catch (error) {
            console.error('Error loading scores:', error);

        }
    };

      
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
