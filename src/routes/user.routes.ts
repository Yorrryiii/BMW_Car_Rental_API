import { Router, Request, Response } from 'express';
import { initializeDatabase } from '../database';
import { User } from '../models/user.model';
import { validateUniqueUser, validateUserFields } from '../middleware/validators';

const router = Router();

// Since creating an individual router.get method for each possible combination of user data is not practical and difficult to mantain. Instead I asked chatGPT for solutions and it suggested using Dynamic Filtering. This way, I can filter the data based on the query parameters provided in the URL. This is a more efficient way to handle the GET requests for user data. The same goes for cars and parkings for get and patch requests.

// GET users with dynamic filtering
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, name, email, phone } = req.query;

    const db = await initializeDatabase();

    // Start building the SQL query
    let query = 'SELECT * FROM Users WHERE 1=1';
    const params: any[] = [];

    // Add conditions based on the query parameters
    if (id) {
      query += ' AND id = ?';
      params.push(id);
    }
    if (name) {
      query += ' AND name = ?';
      params.push(name);
    }
    if (email) {
      query += ' AND email = ?';
      params.push(email);
    }
    if (phone) {
      if (!/^\d{9}$/.test(phone as string)) {
        res.status(400).send('Invalid phone number format (must be 9 digits)');
        return;
      }
      query += ' AND phone = ?';
      params.push(phone);
    }

    // Execute the dynamic query
    const users: User[] = await db.all(query, params);
    if (!users.length) {
      res.status(404).send('No matching users found');
      return;
    }
    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving the users', error);
    res.status(500).send('Failed to retrieve users');
  }
});

// POST add a new user (with validation middleware)
router.post('/', validateUserFields, validateUniqueUser, async (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;

    const db = await initializeDatabase();
    await db.run('INSERT INTO Users (name, email, phone) VALUES (?, ?, ?)', [name, email, phone]);
    res.status(201).send('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Failed to add user');
  }
});

// PUT update a user (with validation middleware for full update)
router.put('/:id', validateUserFields, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const db = await initializeDatabase();
    await db.run('UPDATE Users SET name = ?, email = ?, phone = ? WHERE id = ?', [name, email, phone, id]);
    res.status(200).send('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Failed to update user');
  }
});

// PATCH update a user (partial updates)
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const db = await initializeDatabase();

    let updateFields: string[] = [];
    const params: any[] = [];

    if (name) {
      updateFields.push('name = ?');
      params.push(name);
    }
    if (email) {
      updateFields.push('email = ?');
      params.push(email);
    }
    if (phone) {
      if (!/^\d{9}$/.test(phone)) {
        res.status(400).send('Invalid phone number format (must be 9 digits)');
        return;
      }
      updateFields.push('phone = ?');
      params.push(phone);
    }

    if (updateFields.length === 0) {
      res.status(400).send('No fields provided for updating');
      return;
    }

    params.push(id);
    const query = `UPDATE Users SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.run(query, params);
    res.status(200).send('User partially updated successfully');
  } catch (error) {
    console.error('Error updating user', error);
    res.status(500).send('Failed to update user');
  }
});

// DELETE a user by ID as a path parameter
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).send('Invalid request: User ID is required.');
      return;
    }

    const db = await initializeDatabase();
    const result = await db.run('DELETE FROM Users WHERE id = ?', [id]);

    if (result.changes === 0) {
      res.status(404).send('No user found with the given ID.');
      return;
    }

    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Failed to delete user');
  }
});

// DELETE a user by ID as a query parameter
router.delete('/', async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id) {
      res.status(400).send('Invalid request: User ID is required.');
      return;
    }

    const db = await initializeDatabase();
    const result = await db.run('DELETE FROM Users WHERE id = ?', [id]);

    if (result.changes === 0) {
      res.status(404).send('No user found with the given ID.');
      return;
    }

    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Failed to delete user');
  }
});

export default router;
