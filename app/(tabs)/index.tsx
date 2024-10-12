import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../../contexts/GameContext';
import '../../styles/fonts.css';

export default function HomeScreen() {
  const router = useRouter();
  const { highScore } = useGame();

  // Function to handle beatmap selection and navigate to GameScreen
  const selectBeatmap = (beatmapName) => {
    router.push({
      pathname: '/game',
      params: { beatmapName: beatmapName }, // Pass the selected beatmap as a parameter
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hexagon Rhythm</Text>
      <Text style={styles.highScore}>High Score: {highScore}</Text>

      {/* Buttons for selecting different beatmaps */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => selectBeatmap('beatmap')}
      >
        <Text style={styles.buttonText}>Play Beatmap 1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => selectBeatmap('beatmap')}
      >
        <Text style={styles.buttonText}>Play Beatmap 2</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => selectBeatmap('beatmap')}
      >
        <Text style={styles.buttonText}>Play Beatmap 3</Text>
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
