import express from "express";
import { getSales, getDailySales } from "../controllers/sales.js";

const router = express.Router();

// Route to get general sales data
router.get('/sales', getSales);

// Route to get daily sales data
router.get('/daily', getDailySales);

export default router;
