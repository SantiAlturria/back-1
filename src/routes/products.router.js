import { Router } from "express";
import Product from "../models/Product.model.js";

const router = Router();

// Ping
router.get("/ping", (req, res) => {
  res.send("pong productos");
});

// Crear producto
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Obtener producto por ID
router.get("/:pid", async (req, res) => {
  const product = await Product.findById(req.params.pid);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product);
});

// Actualizar producto
router.put("/:pid", async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.pid,
    req.body,
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(updated);
});

// Eliminar producto
router.delete("/:pid", async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.pid);

  if (!deleted) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json({ message: "Producto eliminado" });
});

export default router;
