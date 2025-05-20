// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import OTPVerification from './screens/OTPVerification';
import Table from './screens/Table';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="Table" component={Table} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


