// // src/screens/RxDBScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
// import setupDatabase from '../db';
// import TaskItem from '../components/TaskItem';
// import { v4 as uuidv4 } from 'uuid';

// const RxDBScreen = () => {
//     const [db, setDb] = useState(null);
//     const [tasks, setTasks] = useState([]);
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');

//     useEffect(() => {
//         const initDB = async () => {
//             const database = await setupDatabase();
//             setDb(database);

//             // Observa los cambios en la colección de tareas y actualiza el estado
//         const subscription = database.tasks.find().$.subscribe((tasksDocs) => {
//           const tasksArray = tasksDocs.map((taskDoc) => taskDoc.toJSON());
//           setTasks(tasksArray);
//       });

//       // Asegúrate de limpiar la suscripción al desmontar el componente
//       return () => subscription.unsubscribe();
//         };

//         initDB();
//     }, []);

//     const addTask = async () => {
//         if (!title) return alert("El título es obligatorio");

//         await db.tasks.insert({
//             id: uuidv4(),
//             title,
//             description,
//             completed: false,
//             createdAt: new Date().toISOString(),
//         });

//         setTitle('');
//         setDescription('');
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>RxDB Task Manager</Text>

//             <TextInput
//                 style={styles.input}
//                 placeholder="Título de la tarea"
//                 value={title}
//                 onChangeText={setTitle}
//                 placeholderTextColor={'gray'}
//             />
//             <TextInput
//                 style={styles.input}
//                 placeholder="Descripción"
//                 value={description}
//                 onChangeText={setDescription}
//                 placeholderTextColor={'gray'}
//             />
//             <Button title="Agregar Tarea" onPress={addTask} />

//             <FlatList
//                 data={tasks}
//                 keyExtractor={(item) => item.id}
//                 renderItem={({ item }) => <TaskItem task={item} />}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#fff',
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     input: {
//         height: 40,
//         borderColor: '#ccc',
//         borderWidth: 1,
//         paddingHorizontal: 10,
//         marginBottom: 10,
//     },
// });

// export default RxDBScreen;




// // import React, { useState, useEffect } from 'react';
// // import { View, Text, TextInput, Button, FlatList } from 'react-native';
// // import { RxDB } from 'rxdb';
// // import { noteSchema } from './models/Note';
// // import PouchDB from 'pouchdb';
// // import 'pouchdb-adapter-leveldb';

// // const RxDBScreen = () => {
// //     const [notes, setNotes] = useState([]);
// //     const [newNoteTitle, setNewNoteTitle] = useState('');
// //     const [newNoteContent, setNewNoteContent] = useState('');

// //     useEffect(() => {
// //         const createDb = async () => {
// //             const db = await RxDB.create({
// //                 name: 'notesdb',
// //                 adapter: 'leveldb',
// //             });

// //             const noteCollection = await db.collection({
// //                 name: 'notes',
// //                 schema: noteSchema,
// //             });

// //             const allNotes = await noteCollection.find().exec();
// //             setNotes(allNotes);

// //             // Suscribirse a cambios en la colección
// //             noteCollection.$.subscribe(updatedNotes => {
// //                 setNotes(updatedNotes);
// //             });
// //         };

// //         createDb();
// //     }, []);

// //     const handleCreateNote = async () => {
// //         const noteCollection = await db.collection('notes');
// //         await noteCollection.insert({
// //             title: newNoteTitle,
// //             content: newNoteContent,
// //             createdAt: new Date(),
// //         });
// //         setNewNoteTitle('');
// //         setNewNoteContent('');
// //     };

// //     const handleUpdateNote = async (id, newTitle, newContent) => {
// //         const noteCollection = await db.collection('notes');
// //         await noteCollection.findOne({ _id: id }).update({
// //             title: newTitle,
// //             content: newContent,
// //         });
// //     };

// //     const handleDeleteNote = async (id) => {
// //         const noteCollection = await db.collection('notes');
// //         await noteCollection.findOne({ _id: id }).remove();
// //     };

// //     return (
// //         <View>
// //             <TextInput
// //                 placeholder="Título"
// //                 value={newNoteTitle}
// //                 onChangeText={setNewNoteTitle}
// //             />
// //             <TextInput
// //                 placeholder="Contenido"
// //                 value={newNoteContent}
// //                 onChangeText={setNewNoteContent}
// //             />
// //             <Button title="Crear Nota" onPress={handleCreateNote} />
// //             <FlatList
// //                 data={notes}
// //                 keyExtractor={(item) => item._id}
// //                 renderItem={({ item }) => (
// //                     <View>
// //                         <Text>{item.title}</Text>
// //                         <Text>{item.content}</Text>
// //                         {/* Botones para editar y eliminar (implementarlos) */}
// //                     </View>
// //                 )}
// //             />
// //         </View>
// //     );
// // };

// // export default RxDBScreen; 
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { createRxDatabase } from 'rxdb';
import PouchDBAdapter from 'pouchdb-adapter-node-websql';
import { GoogleMaps } from 'expo';

// Crear la base de datos RxDB
const createDatabase = async () => {
  const db = await createRxDatabase({
    name: 'myAppDatabase',
    adapter: new PouchDBAdapter(),
  });

  // Definir el esquema de un documento de ubicación
  const locationSchema = {
    version: 1,
    type: 'object',
    properties: {
      timestamp: { type: 'string' },
      latitude: { type: 'number' },
      longitude: { type: 'number' },
      name: { type: 'string' },
    },
    primaryKey: 'timestamp',
  };

  // Crear la colección de ubicaciones
  return db.collection({
    name: 'locations',
    schema: locationSchema,
  });
};

const RxDBScreen = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener una referencia a la colección de ubicaciones
  const [locationCollection, setLocationCollection] = useState(null);

  useEffect(() => {
    const init = async () => {
      const collection = await createDatabase();
      setLocationCollection(collection);

      // Obtener todas las ubicaciones existentes
      const allLocations = await collection.find().exec();
      setLocations(allLocations);
      setLoading(false);

      // Crear una suscripción para escuchar cambios en la colección
      const liveQuery = collection.find().$.subscribe(updatedLocations => {
        setLocations(updatedLocations);
      });

      return () => {
        liveQuery.unsubscribe();
      };
    };
    init();
  }, []);

  // Función para agregar una nueva ubicación
  const addLocation = async (name, latitude, longitude) => {
    const newLocation = {
      timestamp: new Date().toISOString(),
      latitude: latitude,
      longitude: longitude,
      name: name,
    };

    await locationCollection.insert(newLocation);
  };

  return (
    <View>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <>
          <GoogleMaps
            style={{ height: 400 }}
            initialRegion={{
              latitude: -2.18085,
              longitude: -79.8927,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onMarkerPress={(e) => {
              const place = e.nativeEvent.coordinate;
              addLocation(e.nativeEvent.title, place.latitude, place.longitude);
            }}
          />
          <FlatList
            data={locations}
            keyExtractor={item => item.timestamp}
            renderItem={({ item }) => (
              <Text>Nombre: {item.name}, Latitud: {item.latitude}, Longitud: {item.longitude}</Text>
            )}
          />
        </>
      )}
    </View>
  );
};

export default RxDBScreen;