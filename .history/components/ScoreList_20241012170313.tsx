import React from 'react';
import { View, Text} from 'react-native';

interface 

const SortedScores: React.FC<SortedScoresProps> = ({ highScoreList }) => {
    const sortedScores = highScoreList.sort((a, b) => b - a);

    return (
        <View>
            {sortedScores.map((score, index) => (
                <Text  key={index}>
                    {score}
                </Text>
            ))}
        </View>
    );
};

export default SortedScores;