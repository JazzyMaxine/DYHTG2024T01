import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { useGame } from '../../contexts/GameContext';
import '../../styles/fonts.css';

export default function HomeScreen() {
  const router = useRouter();
  const { highScore } = useGame();
  const [beatmaps, setBeatmaps] = useState([]);
  const [downloading, setDownloading] = useState(null);

  // Directory paths (only for mobile)
  const beatmapDir = FileSystem.documentDirectory + 'beatmaps/';
  const audioDir = FileSystem.documentDirectory + 'audio/';
  const iP='localhost' // 172.20.10.4

  // Fetch available beatmaps from the server
  useEffect(() => {
    fetch(`http://${iP}:5000/list_beatmaps`)
      .then(response => response.json())
      .then(data => setBeatmaps(data.beatmaps))
      .catch(error => console.error('Error fetching beatmaps:', error));
  }, []);

  // Ensure beatmap and audio directories exist (only for mobile)
  useEffect(() => {
    if (Platform.OS !== 'web') {
      FileSystem.makeDirectoryAsync(beatmapDir, { intermediates: true }).catch(e => {});
      FileSystem.makeDirectoryAsync(audioDir, { intermediates: true }).catch(e => {});
    }
  }, []);

  // Download a beatmap and its corresponding audio file
const downloadBeatmap = async (beatmapName) => {
  try {
    setDownloading(beatmapName);

    // Fetch the beatmap JSON and audio URL from the server
    const response = await fetch(`http://${iP}:5000/download_beatmap/${beatmapName}`);
    const { beatmap_json, audio_file_url } = await response.json();

    // Add logging to ensure audio_file_url is not null

    if (!audio_file_url) {
      console.error('Error: audio_file_url is null or undefined');
      setDownloading(null);
      return;
    }

if (Platform.OS === 'web') {
  // Web: Log the received object and route directly
  const encodedBeatmapJson = encodeURIComponent(JSON.stringify(beatmap_json));

  // Pass beatmapJson and audioUrl via the router
  router.push({
    pathname: '/game',
    params: { beatmapName, beatmapJson: encodedBeatmapJson, audioUrl: audio_file_url }
  });
} else {
  // Mobile platform: Save files locally and pass the file URIs to the game screen
  try {
    // Define paths to store the beatmap JSON and audio files
    const sanitizedBeatmapName = beatmapName.replace('.osz', '');
    const beatmapFileUri = `${beatmapDir}${sanitizedBeatmapName}.json`;
    const audioFileUri = `${audioDir}${sanitizedBeatmapName}_padded.mp3`;

    // Save the beatmap JSON file
    await FileSystem.writeAsStringAsync(beatmapFileUri, JSON.stringify(beatmap_json));

    // Download and save the audio file
    const downloadedAudio = await FileSystem.downloadAsync(audio_file_url, audioFileUri);

    // Logging the file paths for debugging

    // Pass the local URIs to the game screen
    router.push({
      pathname: '/game',
      params: {
        beatmapName: sanitizedBeatmapName,
        beatmapUri: beatmapFileUri,
        audioUri: downloadedAudio.uri,  // Use the local file URI for audio
        audioUrl: audio_file_url
      }
    });

    // Reset the downloading state and show a confirmation alert
    setDownloading(null);
    alert('Download complete!');
  } catch (error) {
    console.error('Error saving files:', error);
    setDownloading(null);
  }
}
  } catch (error) {
    console.error('Error downloading beatmap:', error);
    setDownloading(null);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hexagon Rhythm</Text>
      <Text style={styles.highScore}>High Score: {highScore}</Text>
      <FlatList
        data={beatmaps}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.beatmapName}>{item}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => downloadBeatmap(item)}
              disabled={downloading === item}
            >
              <Text style={styles.buttonText}>
                {downloading === item ? 'Downloading...' : 'Download'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  beatmapName: {
    color: '#fff',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  highScore: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  }
});
