import { Router } from "express";
import Product from "../models/Product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, status, limit = 10, page = 1, sort } = req.query;

    // Filtros dinámicos
    const query = {};
    if (category) query.category = category;
    if (status !== undefined) query.status = status === "true";

    // Orden
    const sortOption = {};
    if (sort === "price") sortOption.price = 1;
    if (sort === "-price") sortOption.price = -1;

    // Paginación
    const options = {
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      sort: sortOption
    };

    const products = await Product.find(query, null, options);
    const total = await Product.countDocuments(query);

    res.json({
      status: "success",
      total,
      page: Number(page),
      limit: Number(limit),
      products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;