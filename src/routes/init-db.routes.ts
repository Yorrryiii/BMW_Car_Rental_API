import { Router, Request, Response } from 'express';
import { initializeDatabase } from '../database';

const router = Router();

router.get('/init-db', async (req: Request, res: Response) => {
  try {
    await initializeDatabase();
    res.status(200).send('Database initialized successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error initializing database');
  }
});

export default router;
