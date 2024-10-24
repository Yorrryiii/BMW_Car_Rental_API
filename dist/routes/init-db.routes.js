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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../database");
const router = (0, express_1.Router)();
router.get('/init-db', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.initializeDatabase)();
        res.status(200).send('Database initialized successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error initializing database');
    }
}));
exports.default = router;
