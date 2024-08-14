import { Client } from 'pg';

let client;

// Function to get the singleton client
export async function getClient() {
  if (!client) {
    client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    await client.connect();
    console.log('Connected to PostgreSQL database!');
  }
  return client;
}
