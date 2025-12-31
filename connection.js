import { MongoClient } from 'mongodb';
import 'dotenv/config';

export async function connectMongo() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.DB_NAME);
  console.log('MongoDB connected:', db.databaseName);
  return db;
}