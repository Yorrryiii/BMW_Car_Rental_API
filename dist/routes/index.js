"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Basic endpoint
router.get('/', (req, res) => {
    res.send('Welcome to BMW Car Rental Service API - Home Page');
});
exports.default = router;
