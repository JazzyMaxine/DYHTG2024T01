import React from 'react';

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
            <h2>Sorted Scores</h2>
            <ul>
                {sortedScores.map(score => (
                    <li key={score.id}>
                        {score.name}: {score.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SortedScores;