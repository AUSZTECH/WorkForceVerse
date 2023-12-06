import React from 'react'

// React Navigation
import { createStackNavigator } from '@react-navigation/stack'

// Screens
import SettingScreen from '../Screens/Setting/SettingScreen'
import LoanScreen from '../../Employee/Screens/Setting/Loan/LoanScreen'
import AddLoanScreen from '../Screens/Setting/Loan/AddLoanScreen'
import Biometric from '../../../components/Biometric'
import LoanDetail from '../../Admin/Screens/Setting/Loan/LoanDetail'



const Stack = createStackNavigator()

const SettingStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Employee Setting Screen'
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name='Employee Setting Screen' component={SettingScreen} />

            {/* Loan */}
            <Stack.Screen name='Employee Loan Screen' component={LoanScreen} />
            <Stack.Screen name='Employee Add Loan Screen' component={AddLoanScreen} />
            <Stack.Screen name='Loan Details Screen' component={LoanDetail} />
            
            <Stack.Screen name='Biometric Screen' component={Biometric} />

        </Stack.Navigator>
    )
}

export default SettingStack
