import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';

interface TracerProps {
    x1: number  // tracer is drawn as a line from (x1,y1) to (x2,y2)
    y1: number
    x2: number
    y2: number
    duration?: number  // Optional duration for how long the tracer remains visible
      createdAt: Date // Add createdAt timestamp
}

const Tracer: React.FC<TracerProps> = ({ x1, y1, x2, y2, duration = 100, createdAt }) => {
    const [visible, setVisible] = useState(true);
    const minx = Math.min(x1, x2)
    const miny = Math.min(y1, y2)

    // Automatically remove the explosion after the specified duration
    useEffect(() => {
        const timer = setTimeout(() => {
        setVisible(false);
        }, duration);

        return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
    }, [duration]);

    if (!visible) return null; // Don't render if the explosion is no longer visible
    
    return (
        <View style={[styles.tracer, { left: minx, top: miny }]}>
            <Svg height="100" width="100" viewBox="0 0 100 100">
                <Line x1={x1-minx} y1={y1-miny} x2={x2-minx} y2={y2-miny} stroke="white" strokeWidth="1" />
            </Svg>
        </View>
    )
}

const styles = StyleSheet.create({
    tracer: {
        position: 'absolute',
    },
});

export default Tracer;
