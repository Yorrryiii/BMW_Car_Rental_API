import { Router, Request, Response } from 'express';
import { initializeDatabase } from '../database';
import { Parking } from '../models/parking.model';
import { validateUniqueParking } from '../middleware/validators';

const router = Router();

// GET parking locations with dynamic filtering
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, name, location, capacity } = req.query;
    
    const db = await initializeDatabase();

    // Start building the SQL query
    let query = 'SELECT * FROM Parkings WHERE 1=1';
    const params: any[] = [];

    // Add filters based on the query parameters that are provided
    if (id) {
      query += ' AND id = ?';
      params.push(id);
    }
    if (name) {
      query += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }
    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }
    if (capacity) {
      query += ' AND capacity = ?';
      params.push(capacity);
    }

    // Execute the dynamic query
    const parking: Parking[]  = await db.all(query, params);
    if (parking.length === 0) {
      res.status(404).send('No matching parking locations found');
      return;
    }
    res.status(200).json(parking);
  } catch (error) {
    console.error('Error retrieving parking locations:', error);
    res.status(500).send('Failed to retrieve parking locations');
  }
});

// POST add a new parking location (with validation middleware)
router.post('/', validateUniqueParking, async (req: Request, res: Response) => {
  try {
    const { name, location, capacity } = req.body;

    const db = await initializeDatabase();
    await db.run('INSERT INTO Parkings (name, location, capacity) VALUES (?, ?, ?)', [name, location, capacity]);
    res.status(201).send('Parking location added successfully');
  } catch (error) {
    console.error('Error adding parking location:', error);
    res.status(500).send('Failed to add parking location');
  }
});

// PUT update a parking location (updates the entire resource)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, location, capacity } = req.body;

    if (!name || !location || capacity === undefined) {
      res.status(400).send('Invalid request: All fields (name, location, capacity) are required for PUT');
      return;
    }

    if (capacity <= 0) {
      res.status(400).send('Invalid request: Capacity must be a positive integer');
      return;
    }

    const db = await initializeDatabase();
    await db.run('UPDATE Parkings SET name = ?, location = ?, capacity = ? WHERE id = ?', [name, location, capacity, id]);
    res.status(200).send('Parking location updated successfully');
  } catch (error) {
    console.error('Error updating parking location:', error);
    res.status(500).send('Failed to update parking location');
  }
});

// PATCH update a parking location (partial updates)
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, location, capacity } = req.body;
    const db = await initializeDatabase();

    let updateFields: string[] = [];
    const params: any[] = [];

    if (name) {
      updateFields.push('name = ?');
      params.push(name);
    }
    if (location) {
      updateFields.push('location = ?');
      params.push(location);
    }
    if (capacity !== undefined) {
      if (capacity <= 0) {
        res.status(400).send('Invalid request: Capacity must be a positive integer');
        return;
      }
      updateFields.push('capacity = ?');
      params.push(capacity);
    }

    if (updateFields.length === 0) {
      res.status(400).send('No fields provided for updating');
      return;
    }

    params.push(id);
    const query = `UPDATE Parkings SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.run(query, params);
    res.status(200).send('Parking location partially updated successfully');
  } catch (error) {
    console.error('Error updating parking location:', error);
    res.status(500).send('Failed to update parking location');
  }
});

// DELETE a parking location by ID as a path parameter
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).send('Invalid request: Parking location ID is required.');
      return;
    }

    const db = await initializeDatabase();
    const result = await db.run('DELETE FROM Parkings WHERE id = ?', [id]);

    if (result.changes === 0) {
      res.status(404).send('No parking location found with the given ID.');
      return;
    }

    res.status(200).send('Parking location deleted successfully');
  } catch (error) {
    console.error('Error deleting parking location:', error);
    res.status(500).send('Failed to delete parking location');
  }
});

// DELETE a parking location by ID as a query parameter
router.delete('/', async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id) {
      res.status(400).send('Invalid request: Parking location ID is required.');
      return;
    }

    const db = await initializeDatabase();
    const result = await db.run('DELETE FROM Parkings WHERE id = ?', [id]);

    if (result.changes === 0) {
      res.status(404).send('No parking location found with the given ID.');
      return;
    }

    res.status(200).send('Parking location deleted successfully');
  } catch (error) {
    console.error('Error deleting parking location:', error);
    res.status(500).send('Failed to delete parking location');
  }
});

export default router;
