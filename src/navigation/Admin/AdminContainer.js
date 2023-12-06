import React from 'react'

// Navigation 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons'

// Stacks
import HomeStack from './Stacks/HomeStack'
import SettingStack from './Stacks/SettingStack'
import AttendanceScreen from './Screens/AttendanceScreen'
import EmployeeStack from './Stacks/EmployeeStack'

const Tab = createBottomTabNavigator()

const AdminContainer = () => {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#810be7',
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === 'Home') {
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (rn === 'Attendance') {
                        iconName = focused ? 'calendar' : 'calendar-outline'
                    }
                    else if (rn === 'Employees') {
                        iconName = focused ? 'people-sharp' : 'people-outline'
                    } else if (rn === 'Setting') {
                        iconName = focused ? 'settings' : 'settings-outline'

                    }

                    return <Ionicons name={iconName} color={color} size={focused ? size + 5 : size} />
                },
            })}
        >
            <Tab.Screen name='Home' component={HomeStack} />
            <Tab.Screen name='Attendance' component={AttendanceScreen} options={{
                tabBarStyle: {
                    display: 'none'
                }
            }} />
            <Tab.Screen name='Employees' component={EmployeeStack} />
            <Tab.Screen name='Setting' component={SettingStack} />
        </Tab.Navigator>
    )
}

export default AdminContainer