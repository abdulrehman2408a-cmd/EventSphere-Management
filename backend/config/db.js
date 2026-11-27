import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set. Please configure backend/.env');
  }
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
  });
  console.log(`[MongoDB] Connected to: ${conn.connection.host} / ${conn.connection.name}`);
  return conn;
};

export const closeDB = async () => {
  await mongoose.disconnect();
};
