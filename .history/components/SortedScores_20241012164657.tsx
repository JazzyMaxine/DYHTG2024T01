import React from 'react';
import { View, Text} from 'react-native';

interface Score {
    id: number;
    name: string;
    score: number;
}

interface SortedScoresProps {
    scores: Score[];
}

const SortedScores: React.FC<SortedScoresProps> = ({ scores }) => {
    const sortedScores = scores.sort((a, b) => b.score - a.score);

    return (
        <View>
            {sortedScores.map(score => (
                <Text>
                    {score.name}: {score.score}
                </Text>
                </li>
            ))}
        </View>
    );
};

export default SortedScores;