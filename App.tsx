import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login';
import React from 'react';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import SignUp from "./src/screens/SignUp";
import QueueScreen from "./src/screens/QueueScreen";
import NotificationScreen from "./src/screens/NotificationScreen";

if (process.env.NODE_ENV === 'development') {
    whyDidYouRender(React, {
        trackAllPureComponents: false,
    });
}

const Stack = createStackNavigator();

const App: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name={'SignUp'} component={SignUp} />
                <Stack.Screen name={'Queue'} component={QueueScreen} />
                <Stack.Screen name={'Notification'} component={NotificationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
