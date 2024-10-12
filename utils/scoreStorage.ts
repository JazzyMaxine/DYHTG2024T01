import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SCORE_KEY = 'gameScores';
const isWeb = Platform.OS === 'web';

// function saving scores to AsyncStorage
export const saveScores = async (scores: number[]) => {

    const jsonScores = JSON.stringify(scores);
    if (isWeb) {
        localStorage.setItem(SCORE_KEY, jsonScores);
    }   else {
          await AsyncStorage.setItem(SCORE_KEY, jsonScores);
    }
};

// function to get scores from AsyncStorage
export const getStoredScores = async (): Promise<number[]> => {

  if (isWeb) {
    const storedScores = localStorage.getItem(SCORE_KEY);
    return storedScores ? JSON.parse(storedScores) : [];
  } else {
    const storedScores = await AsyncStorage.getItem(SCORE_KEY);
    return storedScores ? JSON.parse(storedScores) : [];
  } 
};
