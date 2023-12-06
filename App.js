import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

// Native Base
import { NativeBaseProvider, StatusBar } from 'native-base';
import theme from './src/theme/NativeBase';

// React Navigation
import { NavigationContainer } from '@react-navigation/native';

// Context API
import Auth from './src/context/store/Auth';
import AuthGlobal from './src/context/store/AuthGlobal';

// Redux
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

// Components
import AdminContainer from './src/navigation/Admin/AdminContainer';
import EmployeeContainer from './src/navigation/Employee/EmployeeContainer';
import AuthStack from './src/navigation/Auth/AuthStack';
import COLORS from './src/theme/COLORS';



const Container = () => {
  const context = useContext(AuthGlobal)

  return context.stateUser.isAuthenticated ? (
    context.stateUser.user.RoleCode == 'AD' ? (
      <AdminContainer />
    ) : (
      <EmployeeContainer />
    )
  ) : (
    <AuthStack />
  )
}

const App = () => {
  return (
    <View style={styles.container} >
      <Auth>
        <Provider store={store} >
          <NativeBaseProvider theme={theme} >
            <NavigationContainer>
              <StatusBar backgroundColor={COLORS.backgroundColor} barStyle={'dark-content'} />
              <Container />
            </NavigationContainer>
          </NativeBaseProvider>
        </Provider>
      </Auth>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});