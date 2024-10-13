import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

interface GameControlsProps {
  onRotate: (direction: number) => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onRotate }) => {
  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4, 5].map((direction) => (
        <TouchableOpacity
          key={direction}
          style={styles.button}
          onPress={() => onRotate(direction)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default GameControls;
