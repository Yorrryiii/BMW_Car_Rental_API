"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
// Function to initialize and return the database instance
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, sqlite_1.open)({
            filename: './bmwCarRental.db',
            driver: sqlite3_1.default.Database
        });
        // Initialize tables if they don't exist
        yield db.exec(`
    CREATE TABLE IF NOT EXISTS ParkingLocations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      capacity INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      carId TEXT NOT NULL,
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
    });
}
