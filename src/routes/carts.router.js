import { Router } from "express";
import Cart from "../models/Cart.model.js";

const router = Router();

// Crear carrito
router.post("/", async (req, res) => {
  const cart = await Cart.create({ products: [] });
  res.status(201).json(cart);
});

// Obtener carrito por ID
router.get("/:cid", async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate("products.product");

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart);
});

export default router;
