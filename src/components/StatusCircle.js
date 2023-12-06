import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Circle, Text } from 'react-native-svg';

// Function to calculate the circumference for each status
const calculateCircumference = (value, total) => {
    const radius = 80; // Radius of the circle
    const circumference = 2 * Math.PI * radius;
    return (value / total) * circumference;
};

const StatusCircle = ({ present, absent, late, leave }) => {
    const total = present + absent + late + leave;
    const presentCircumference = calculateCircumference(present, total);
    const absentCircumference = calculateCircumference(absent, total);
    const lateCircumference = calculateCircumference(late, total);
    const leaveCircumference = calculateCircumference(leave, total);

    // Assume that we are just dividing the circle into equal parts for simplicity
    // You would adjust the angles and the lengths to match the actual data
    const strokeWidth = 15;
    const radius = 80; // Same as in the calculateCircumference function

    return (
        <View style={styles.container}>
            <Svg height="250" width="250" viewBox="0 0 250 250">
                {/* Present Segment */}
                <Circle
                    cx="125"
                    cy="125"
                    r={radius}
                    stroke="#4CAF50"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${presentCircumference} ${2 * Math.PI * radius - presentCircumference}`}
                    strokeDashoffset={0}
                    fill="none"
                    rotation="-90"
                    origin="125, 125"
                />
                {/* Absent Segment */}
                <Circle
                    cx="125"
                    cy="125"
                    r={radius}
                    stroke="#F44336"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${absentCircumference} ${2 * Math.PI * radius - absentCircumference}`}
                    strokeDashoffset={presentCircumference}
                    fill="none"
                    rotation="-90"
                    origin="125, 125"
                />
                {/* Late Segment */}
                <Circle
                    cx="125"
                    cy="125"
                    r={radius}
                    stroke="#FFC107"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${lateCircumference} ${2 * Math.PI * radius - lateCircumference}`}
                    strokeDashoffset={presentCircumference + absentCircumference}
                    fill="none"
                    rotation="-90"
                    origin="125, 125"
                />
                {/* Leave Segment */}
                <Circle
                    cx="125"
                    cy="125"
                    r={radius}
                    stroke="#2196F3"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${leaveCircumference} ${2 * Math.PI * radius - leaveCircumference}`}
                    strokeDashoffset={presentCircumference + absentCircumference + lateCircumference}
                    fill="none"
                    rotation="-90"
                    origin="125, 125"
                />
                {/* Center Text */}
                <Text
                    x="50%"
                    y="50%"
                    fill="black"
                    fontSize="20"
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="central"
                >
                    {`Total: ${total}`}
                </Text>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
});

export default StatusCircle;
