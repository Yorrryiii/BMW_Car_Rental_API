import { Router, Request, Response } from 'express';

const router = Router();

// Basic endpoint
router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to BMW Car Rental Service API - Home Page');
});

export default router;
