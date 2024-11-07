// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import RxDBScreen from './screens/RxDBScreen';
import SQLiteScreen from './screens/SQLiteScreen';
import PouchDBScreen from './screens/PouchDBScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
                <Stack.Screen name="RxDB" component={RxDBScreen} />
                <Stack.Screen name="SQLite" component={SQLiteScreen} />
                <Stack.Screen name="PouchDB" component={PouchDBScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
