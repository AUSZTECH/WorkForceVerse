import React from 'react'

// Navigation 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons'

// Stacks
import HomeStack from './Stacks/HomeStack'
import AttendanceScreen from './Screens/AttendanceScreen'
import LeaveStack from './Stacks/LeaveStack'
import SettingStack from './Stacks/SettingStack'

const Tab = createBottomTabNavigator()

const EmployeeContainer = () => {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#810be7',
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                // tabBarIcon: ({ focused, color, size }) => {

                //     let iconName;
                //     if (route.name === 'Employee Home') {
                //         iconName = focused ? 'md-home' : 'md-home-outline';
                //         return <Ionicons name={iconName} size={size} color={color} />;
                //     } else if (route.name === 'Attendance History') {
                //         iconName = focused ? 'user-clock' : 'user-clock';
                //         return <FontAwesome6 name={iconName} size={size} color={color} />;
                //     } else if (route.name === 'Leave Tab') {
                //         iconName = focused ? 'calendar-sharp' : 'calendar-outline';
                //         return <Ionicons name={iconName} size={size} color={color} />;
                //     } else if (route.name === 'Settings') {
                //         iconName = focused ? 'settings' : 'settings-outline';
                //         return <Ionicons name={iconName} size={size} color={color} />;
                //     }

                //     return null;


                // },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === 'Employee Home') {
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (rn === 'Employee Attendance History') {
                        iconName = focused ? 'calendar' : 'calendar-outline'
                    }
                    else if (rn === 'Employee Leave') {
                        iconName = focused ? 'today' : 'today-outline'
                    } else if (rn === 'Employee Setting') {
                        iconName = focused ? 'settings' : 'settings-outline'

                    }

                    return <Ionicons name={iconName} color={color} size={size} />
                },

                unmountOnBlur: true
            })}
        >
            <Tab.Screen name='Employee Home' component={HomeStack} options={{ title: 'Home' }} />
            <Tab.Screen name='Employee Attendance History' component={AttendanceScreen} options={{ title: 'Attendance' }} />
            <Tab.Screen name='Employee Leave' component={LeaveStack} options={{ title: 'Leave' }} />
            <Tab.Screen name='Employee Setting' component={SettingStack} options={{ title: 'Setting' }} />
        </Tab.Navigator>
    )
}

export default EmployeeContainer