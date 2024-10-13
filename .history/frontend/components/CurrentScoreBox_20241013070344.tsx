import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

interface CurrentScoreBoxProps {
    score: number;
}

const CurrentScoreBox: React.FC<CurrentScoreBoxProps> = ({ score }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Score</Text>
            <Text style={styles.score}>{score}</Text>
        </View>
    );
};

export default CurrentScoreBox;

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
        fontFamily: 'AsteroidsDisplay',
        fontSize: 20,
        marginBottom: 5,
    },
    score: {
        fontSize: 16,
    },
});
