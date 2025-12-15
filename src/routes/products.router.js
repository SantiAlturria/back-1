import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.post("/", async (req, res) => {
  try {
    const product = req.body;
    await productManager.addProduct(product);
    res.status(201).json({ message: "Producto agregado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

export default router;
