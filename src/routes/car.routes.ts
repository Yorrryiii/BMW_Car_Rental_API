import { Router, Request, Response } from 'express';
import { initializeDatabase } from '../database';
import { Car } from '../models/car.model';
import { validateUniqueCar } from '../middleware/validators';

const router = Router();

// GET cars with dynamic filtering
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, plate, model, status, location } = req.query;

    const db = await initializeDatabase();

    // Start building the dynamic SQL query
    let query = 'SELECT * FROM Cars WHERE 1=1';
    const params: any[] = [];

    // Add filters based on the query parameters that are provided
    if (id) {
      query += ' AND id = ?';
      params.push(id);
    }
    if (plate) {
      query += ' AND plate LIKE ?';
      params.push(`%${plate}%`);
    }
    if (model) {
      query += ' AND model LIKE ?';
      params.push(`%${model}%`);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (location) {
      query += ' AND parkingLocationId = ?';
      params.push(location);
    }

    // Execute the dynamic query
    const cars: Car[] = await db.all(query, params);
    if (cars.length === 0) {
      res.status(404).send('No matching cars found');
      return;
    }
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error retrieving cars:', error);
    res.status(500).send('Failed to retrieve cars');
  }
});

// POST add a new car (with validation middleware)
router.post('/', validateUniqueCar, async (req: Request, res: Response) => {
  try {
    const { plate, model, status, parkingLocationId } = req.body;

    const db = await initializeDatabase();
    await db.run('INSERT INTO Cars (plate, model, status, parkingLocationId) VALUES (?, ?, ?, ?)', [plate, model, status, parkingLocationId]);
    res.status(201).send('Car added successfully');
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).send('Failed to add car');
  }
});

// PUT update a car (updates the entire resource)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { plate, model, status, parkingLocationId } = req.body;

    if (!plate || !model || !status || parkingLocationId === undefined) {
      res.status(400).send('Invalid request: All fields (plate, model, status, parkingLocationId) are required for PUT.');
      return;
    }

    if (status !== 'available' && status !== 'rented') {
      res.status(400).send('Invalid request: Status must be either "available" or "rented".');
      return;
    }

    const db = await initializeDatabase();
    await db.run('UPDATE Cars SET plate = ?, model = ?, status = ?, parkingLocationId = ? WHERE id = ?', [plate, model, status, parkingLocationId, id]);
    res.status(200).send('Car updated successfully');
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).send('Failed to update car');
  }
});

// PATCH update a car (partial updates)
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { plate, model, status, parkingLocationId } = req.body;
    const db = await initializeDatabase();

    let updateFields: string[] = [];
    const params: any[] = [];

    if (plate) {
      updateFields.push('plate = ?');
      params.push(plate);
    }
    if (model) {
      updateFields.push('model = ?');
      params.push(model);
    }
    if (status) {
      if (status !== 'available' && status !== 'rented') {
        res.status(400).send('Invalid request: Status must be either "available" or "rented".');
        return;
      }
      updateFields.push('status = ?');
      params.push(status);
    }
    if (parkingLocationId !== undefined) {
      updateFields.push('parkingLocationId = ?');
      params.push(parkingLocationId);
    }

    if (updateFields.length === 0) {
      res.status(400).send('No fields provided for updating');
      return;
    }

    params.push(id);
    const query = `UPDATE Cars SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.run(query, params);
    res.status(200).send('Car partially updated successfully');
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).send('Failed to update car');
  }
});

// DELETE a car
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await initializeDatabase();
    await db.run('DELETE FROM Cars WHERE id = ?', [id]);
    res.status(200).send('Car deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to delete car');
  }
});

export default router;
