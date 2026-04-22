import mongoose from 'mongoose';

export async function connectToMongo(uri, dbName) {
    if (!uri) throw new Error('Missing MONGO_URI');
    if (!dbName) throw new Error('Missing MONGO_DB');

    await mongoose.connect(uri, { dbName });
    mongoose.connection.on('connected', () => {
        console.log(`Mongo connected to ${dbName}`);
    });
    mongoose.connection.on('error', (err) => {
        console.error('Mongo connection error:', err.message);
    });
}