import { Router } from "express"; 
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/ping", (req, res) => {
  res.send("pong productos");
});

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

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;

  const product = await productManager.getProductById(pid);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product);
});

export default router;
