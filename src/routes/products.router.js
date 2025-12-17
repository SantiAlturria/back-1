import { Router } from "express"; 
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/ping", (req, res) => {
  res.send("pong productos");
});

// Crear producto
router.post("/", async (req, res) => {
  try {
    const product = req.body;
    await productManager.addProduct(product);
    res.status(201).json({ message: "Producto agregado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// Obtener producto por ID
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product);
});

// Actualizar producto
router.put("/:pid", async (req, res) => { 
  try {
    const { pid } = req.params;
    const updated = await productManager.updateProduct(pid, req.body);

    if (!updated) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado", product: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar producto
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const deleted = await productManager.deleteProduct(pid);

  if (!deleted) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json({ message: "Producto eliminado" });
});


export default router;
