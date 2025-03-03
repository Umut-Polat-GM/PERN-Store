import express from "express";
import { createProduct, deleteProduct, getProducts, getProduct, updateProduct } from "../controller/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
