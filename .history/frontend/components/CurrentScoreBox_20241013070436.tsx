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
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
      
    },
    title: {
        fontFamily: 'AsteroidsDisplay',
        fontSize: 32,
    },
    score: {
        fontFamily: 'AsteroidsDisplay',
        fontSize: 48,
    },
});
