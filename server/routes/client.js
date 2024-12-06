import express from "express";
import { getProducts } from "../controllers/client.js"
import { getCustomers } from "../controllers/client.js";
import { getTransactions } from "../controllers/client.js";
import { getGeography } from "../controllers/client.js";
import { addProduct } from "../controllers/client.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.get("/geography", getGeography);
router.post("/products", addProduct);


export default router;