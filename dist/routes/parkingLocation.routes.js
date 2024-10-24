"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const database_1 = require("../database");
const router = (0, express_1.Router)();
// Middleware to parse URL-enconded request bodies
router.use(express_1.default.urlencoded({ extended: true }));
// GET all parking locations
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, database_1.initializeDatabase)();
        const locations = yield db.all('SELECT * FROM ParkingLocations');
        res.status(200).json(locations);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Failed to retrieve parking locations');
    }
}));
// POST add a new parking location
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, location, capacity } = req.body;
        const db = yield (0, database_1.initializeDatabase)();
        yield db.run('INSERT INTO ParkingLocations (name, location, capacity) VALUES (?, ?, ?)', [name, location, capacity]);
        res.status(201).send('Parking location added successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Failed to add parking location');
    }
}));
// PUT update a parking location
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, location, capacity } = req.body;
        const db = yield (0, database_1.initializeDatabase)();
        yield db.run('UPDATE ParkingLocations SET name = ?, location = ?, capacity = ? WHERE id = ?', [name, location, capacity, id]);
        res.status(200).send('Parking location updated successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Failed to update parking location');
    }
}));
// DELETE a parking location
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const db = yield (0, database_1.initializeDatabase)();
        yield db.run('DELETE FROM ParkingLocations WHERE id = ?', [id]);
        res.status(200).send('Parking location deleted successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Failed to delete parking location');
    }
}));
exports.default = router;
