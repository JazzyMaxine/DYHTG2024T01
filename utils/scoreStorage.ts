import AsyncStorage from '@react-native-async-storage/async-storage';

const SCORE_KEY = 'gameScores';

// function saving scores to AsyncStorage
export const saveScores = async (scores: number[]) => {
  try {
    const jsonScores = JSON.stringify(scores);
    await AsyncStorage.setItem(SCORE_KEY, jsonScores);
    console.log('scores have saved:', scores);

  } catch (error) {
    console.error('savings scores error', error);
  }
};

// function to get scores from AsyncStorage
export const getStoredScores = async (): Promise<number[]> => {
  try {
    const storedScores = await AsyncStorage.getItem(SCORE_KEY);
    return storedScores ? JSON.parse(storedScores) : [];
  } catch (error) {
    console.error('getting scores error', error);
    return [];
  }
};
