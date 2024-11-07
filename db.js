// src/db.js
import { addRxPlugin, createRxDatabase } from 'rxdb';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBValidatePlugin } from 'rxdb/plugins/validate';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import PouchDB from 'pouchdb-core';

// Importa los adaptadores de PouchDB y plugins específicos de PouchDB
import PouchdbAdapterAsyncStorage from 'pouchdb-adapter-asyncstorage';

import taskSchema from './schemas/taskSchema';

// Usa PouchDB.plugin() para los adaptadores de PouchDB
PouchDB.plugin(PouchdbAdapterAsyncStorage);

// Usa addRxPlugin solo para los plugins de RxDB
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBValidatePlugin);
addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

const setupDatabase = async () => {
    const db = await createRxDatabase({
        name: 'myappdb',
        adapter: 'asyncstorage', // Esto usa el adaptador de AsyncStorage configurado en PouchDB
        multiInstance: false,
    });

    await db.addCollections({
        tasks: {
            schema: taskSchema,
        },
    });

    return db;
};

export default setupDatabase;
