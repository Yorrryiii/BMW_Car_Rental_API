import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// Function to initialize and return the database instance
export async function initializeDatabase(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  const db = await open({
    filename: './bmwCarRental.db',
    driver: sqlite3.Database
  });

  // Initialize tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Parkings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      capacity INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plate TEXT NOT NULL,
      model TEXT NOT NULL,
      status TEXT NOT NULL,
      parkingLocationId INTEGER,
      FOREIGN KEY (parkingLocationId) REFERENCES ParkingLocations(id)
    );

    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT
    );
  `);

  console.log('Database initialized successfully');
  return db;
}
