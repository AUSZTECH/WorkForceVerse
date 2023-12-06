import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Svg, Circle, Path, Text } from 'react-native-svg';

const CircularProgress = ({ total, current, radius, strokeWidth, color = "#4CAF50" }) => {
    const viewBox = radius * 2.5;
    const circumference = 2 * Math.PI * radius;
    const progress = (current / total) * circumference;

    // Function to calculate the stroke dash offset
    const strokeDashoffset = circumference - progress;

    // Function to calculate the path for the progress
    const getPath = () => {
        const startAngle = 0;
        const endAngle = Math.PI * 2 * (current / total);
        const x = radius + radius * Math.sin(startAngle);
        const y = radius - radius * Math.cos(startAngle);
        const xEnd = radius + radius * Math.sin(endAngle);
        const yEnd = radius - radius * Math.cos(endAngle);
        const largeArcFlag = current > total / 2 ? 1 : 0;

        return `M ${x} ${y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${xEnd} ${yEnd}`;
    };

    return (
        <View style={styles.container}>
            <Svg width={viewBox} height={viewBox} viewBox={`-10 -10 ${viewBox} ${viewBox}`}>
                {/* Background circle */}
                <Circle
                    cx={radius}
                    cy={radius}
                    r={radius}
                    fill="none"
                    stroke={'#e6e6e6'}
                    strokeWidth={strokeWidth}
                />
                {/* Foreground progress */}
                <Path
                    d={getPath()}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
                <Text
                    x={radius}
                    y={radius + 2} // Adjust this number for proper vertical alignment
                    fill={color}
                    fontSize={radius / 2.5} // Adjust font size as needed
                    textAnchor="middle" // Centers the text horizontally
                    alignmentBaseline="middle" // Centers the text vertically
                >
                    {`${current}/${total}`}
                </Text>
            </Svg>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CircularProgress;
