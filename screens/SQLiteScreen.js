import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

// Configuración inicial de SQLite
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const SQLiteScreen = () => {
    const [db, setDb] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');

    // Inicializa la base de datos y crea una tabla
    useEffect(() => {
        const initDB = async () => {
            const database = await SQLite.openDatabase({ name: 'TasksDB', location: 'default' });
            setDb(database);
            
            database.transaction(tx => {
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)',
                    [],
                    () => console.log('Tabla creada con éxito'),
                    error => console.log('Error creando tabla', error)
                );
            });
        };

        initDB();

        // Cierra la base de datos al desmontar el componente
        return () => {
            if (db) {
                db.close().then(() => console.log('Base de datos cerrada.'));
            }
        };
    }, []);

    // Función para agregar tarea
    const addTask = () => {
        if (!title) return alert("Por favor, ingresa un título");

        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO tasks (title) VALUES (?)',
                [title],
                () => {
                    console.log('Tarea agregada');
                    fetchTasks(); // Actualiza la lista después de agregar
                },
                error => console.log('Error al insertar tarea', error)
            );
        });
        setTitle('');
    };

    // Función para leer tareas
    const fetchTasks = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM tasks',
                [],
                (_, { rows }) => {
                    const tasksList = [];
                    for (let i = 0; i < rows.length; i++) {
                        tasksList.push(rows.item(i));
                    }
                    setTasks(tasksList);
                },
                error => console.log('Error al leer tareas', error)
            );
        });
    };

    // Función para eliminar todas las tareas
    const clearTasks = () => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM tasks',
                [],
                () => {
                    console.log('Todas las tareas eliminadas');
                    setTasks([]);
                },
                error => console.log('Error al eliminar tareas', error)
            );
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Ejercicio de SQLite</Text>

            <TextInput
                style={styles.input}
                placeholder="Título de la tarea"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="gray"
            />
            <Button title="Agregar Tarea" onPress={addTask} />
            <Button title="Cargar Tareas" onPress={fetchTasks} />
            <Button title="Eliminar Todas las Tareas" onPress={clearTasks} color="red" />

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskContainer}>
                        <Text style={styles.taskTitle}>{item.title}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    taskContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    taskTitle: {
        fontSize: 18,
    },
});

export default SQLiteScreen;
