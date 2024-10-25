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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = require("./database");
const car_routes_1 = __importDefault(require("./routes/car.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const parking_routes_1 = __importDefault(require("./routes/parking.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, morgan_1.default)('dev')); // Logs HTTP requests
app.use(body_parser_1.default.json()); // Parses incoming requests with JSON payloads
app.use(body_parser_1.default.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads
app.use(express_1.default.urlencoded({ extended: true })); //middleware to parse URL-encoded bodies
// Initialize database on startup before any request
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Initialize the database before responding
        yield (0, database_1.initializeDatabase)();
        res.send('Welcome to BMW Car Rental Service API - Home Page');
    }
    catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).send('Failed to initialize database');
    }
}));
// Routes
app.use('/cars', car_routes_1.default); // Routes related to car rental service
app.use('/users', user_routes_1.default); // Routes related to user management
app.use('/parkings', parking_routes_1.default); // Routes related to parking locations
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
