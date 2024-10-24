"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// GET all cars
router.get('/', (req, res) => {
    res.send('Retrieve all available BMW cars');
});
// POST add a new car
router.post('/', (req, res) => {
    const newCar = req.body;
    res.send(`Car added successfully: ${JSON.stringify(newCar)}`);
});
exports.default = router;
