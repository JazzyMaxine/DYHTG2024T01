import React from 'react';
import { View, Text} from 'react-native';

interface Score {
    id: number;
    name: string;
    score: number;
}

interface SortedScoresProps {
    highScoreList: number[];
}

const SortedScores: React.FC<SortedScoresProps> = ({ highScoreList }) => {
    const sortedScores = high.sort((a, b) => b.score - a.score);

    return (
        <View>
            {sortedScores.map(score, index => (
                <Text>
                    key={index}
                </Text>
            ))}
        </View>
    );
};

export default SortedScores;