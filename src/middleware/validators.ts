import { Request, Response, NextFunction } from 'express';
import { initializeDatabase } from '../database';

// Middleware to validate uniqueness of user
export const validateUniqueUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      res.status(400).send('Invalid request: Both email and phone are required for validation.');
      return;
    }

    const db = await initializeDatabase();
    const existingUser = await db.get('SELECT * FROM Users WHERE email = ? OR phone = ?', [email, phone]);

    if (existingUser) {
      res.status(409).send('Conflict: A user with this email or phone number already exists.');
      return;
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error validating user:', error);
    res.status(500).send('Failed to validate user');
  }
};

// Middleware to validate uniqueness of car
export const validateUniqueCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { plate } = req.body;

    if (!plate) {
      res.status(400).send('Invalid request: Plate is required for validation.');
      return;
    }

    const db = await initializeDatabase();
    const existingCar = await db.get('SELECT * FROM Cars WHERE plate = ?', [plate]);

    if (existingCar) {
      res.status(409).send('Conflict: A car with this plate number already exists.');
      return;
    }

    next();
  } catch (error) {
    console.error('Error validating car:', error);
    res.status(500).send('Failed to validate car');
  }
};

// Middleware to validate uniqueness of parking
export const validateUniqueParking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      res.status(400).send('Invalid request: Both name and location are required for validation.');
      return;
    }

    const db = await initializeDatabase();
    const existingParking = await db.get('SELECT * FROM Parkings WHERE name = ? AND location = ?', [name, location]);

    if (existingParking) {
      res.status(409).send('Conflict: A parking location with this name and address already exists.');
      return;
    }

    next();
  } catch (error) {
    console.error('Error validating parking:', error);
    res.status(500).send('Failed to validate parking');
  }

};

// Middleware to validate user data format and mandatory fields
export const validateUserFields = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, phone } = req.body;

  // Check for required fields
  if (!name || !email || !phone) {
    res.status(400).send('Invalid request: All fields (name, email, phone) are required.');
    return;
  }

  // Check for valid phone number format
  if (!/^\d{9}$/.test(phone)) {
    res.status(400).send('Invalid request: Phone number must be exactly 9 digits.');
    return;
  }

  next(); // Proceed to the next middleware or route handler
};

// Middleware to validate car data format and mandatory fields
export const validateCarFields = (req: Request, res: Response, next: NextFunction) => {
  const { plate, model, status, parkingLocationId } = req.body;

  // Check for required fields
  if (!plate || !model || !status || parkingLocationId === undefined) {
    res.status(400).send('Invalid request: All fields (plate, model, status, parkingLocationId) are required.');
    return;
  }

  // Check for valid status
  if (status !== 'available' && status !== 'rented') {
    res.status(400).send('Invalid request: Status must be either "available" or "rented".');
    return;
  }

  next(); // Proceed to the next middleware or route handler
};

