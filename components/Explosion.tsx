import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';

interface ExplosionProps {
  x: number; // X position of the explosion
  y: number; // Y position of the explosion
  duration?: number; // Optional duration for how long the explosion lasts
}

const Explosion: React.FC<ExplosionProps> = ({ x, y, duration = 500 }) => {
  const [visible, setVisible] = useState(true);

  // Automatically remove the explosion after the specified duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
  }, [duration]);

  if (!visible) return null; // Don't render if the explosion is no longer visible

  return (
<View style={[styles.explosion, { left: x - 20, top: y - 20 }]}>
  <Svg height="40" width="40" viewBox="-20 -20 40 40">
    {/* 6 lines radiating outward from the center, starting 10 units away from center to create a gap */}
    <Line x1="10" y1="0" x2="20" y2="0" stroke="white" strokeWidth="2" />
    <Line x1="5" y1="5" x2="10" y2="10" stroke="white" strokeWidth="2" />
    <Line x1="0" y1="10" x2="0" y2="20" stroke="white" strokeWidth="2" />
    <Line x1="-5" y1="5" x2="-10" y2="10" stroke="white" strokeWidth="2" />
    <Line x1="-10" y1="0" x2="-20" y2="0" stroke="white" strokeWidth="2" />
    <Line x1="-5" y1="-5" x2="-10" y2="-10" stroke="white" strokeWidth="2" />
    <Line x1="0" y1="-10" x2="0" y2="-20" stroke="white" strokeWidth="2" />
    <Line x1="5" y1="-5" x2="10" y2="-10" stroke="white" strokeWidth="2" />
  </Svg>
</View>
  );
};

const styles = StyleSheet.create({
  explosion: {
    position: 'absolute',
  },
});

export default Explosion;

