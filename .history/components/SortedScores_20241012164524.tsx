import React from 'react';
import { View } from 'react-native';

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

            </Text>
                
            </ul>
        </View>
    );
};

export default SortedScores;