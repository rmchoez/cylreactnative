// screens/PouchDBScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const PouchDBScreen = () => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Ejercicio de PouchDB Adapter</Text>
            <Button title="Agregar/Leer Datos de PouchDB" onPress={() => { /* Agrega lógica CRUD aquí */ }} />
        </View>
    );
};

export default PouchDBScreen;
