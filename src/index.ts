import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { initializeDatabase } from './database';
import carRoutes from './routes/car.routes';
import userRoutes from './routes/user.routes';
import parking from './routes/parking.routes';


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev')); // Logs HTTP requests
app.use(bodyParser.json()); // Parses incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true })); //middleware to parse URL-encoded bodies

// Initialize database on startup before any request
app.get('/', async (req, res) => {
  try {
    // Initialize the database before responding
    await initializeDatabase();
    res.send('Welcome to BMW Car Rental Service API - Home Page');
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).send('Failed to initialize database');
  }
});

// Routes
app.use('/cars', carRoutes); // Routes related to car rental service
app.use('/users', userRoutes); // Routes related to user management
app.use('/parkings', parking); // Routes related to parking locations

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
