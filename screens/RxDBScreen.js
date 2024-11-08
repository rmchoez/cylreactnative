import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { createRxDatabase } from 'rxdb';
import PouchDBAdapter from 'pouchdb-adapter-node-websql';
import MapView, { Marker } from 'react-native-maps';

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
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Obtener una referencia a la colección de ubicaciones
  const [locationCollection, setLocationCollection] = useState(null);

  useEffect(() => {
    const init = async () => {
      const collection = await createDatabase();
      setLocationCollection(collection);
      console.log(collection)

      // Obtener todas las ubicaciones existentes
      console.log('Inicia sincronizacion...')
      const allLocations = await collection.find().exec();
      setLocations(allLocations);
      console.log('Cambio de estado...')
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

  const handleMarkerPress = (e) => {
    setSelectedLocation(e.nativeEvent.coordinate);
  };

  const saveLocation = () => {
    if (selectedLocation) {
      addLocation('Selected Location', selectedLocation.latitude, selectedLocation.longitude);
      setSelectedLocation(null); // Clear the selected location
    }
  };

  return (
    <View>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: -2.18085,
              longitude: -79.8927,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onRegionChangeComplete={handleMarkerPress}
          >
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                title="Ubicación seleccionada"
              />
            )}
            {locations.map((location, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title={location.name}
              />
            ))}
          </MapView>
          <Button title="Guardar ubicación" onPress={saveLocation} />
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