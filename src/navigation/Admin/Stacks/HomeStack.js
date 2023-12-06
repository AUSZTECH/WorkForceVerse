import React from 'react'

// React Navigation
import { createStackNavigator } from '@react-navigation/stack'

// Screens
import HomeScreen from '../Screens/Home/HomeScreen'
import AttendanceScreen from '../Screens/AttendanceScreen'
import AttendanceStats from '../Screens/Home/AttendanceStats'

const Stack = createStackNavigator()

const HomeStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown: false,
            }}
        >
            {/* Dashboard */}
            <Stack.Screen name='Home Screen' component={HomeScreen} />
            <Stack.Screen name='Attendance Stats' component={AttendanceStats} />

        </Stack.Navigator>
    )
}

export default HomeStack