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
            <Text>
                {sortedScores.map(score => (
                    <li key={score.id}>
                        {score.name}: {score.score}
                    </li>
                ))}
            </Text>
        </View>
    );
};

export default SortedScores;