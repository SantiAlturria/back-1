import express from "express";
import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
    };

    if (sort === "asc") options.sort = { price: 1 };
    if (sort === "desc") options.sort = { price: -1 };

    const filter = {};

    if (query) {
      if (query === "available") {
        filter.status = true;
      } else {
        filter.category = query;
      }
    }

    const result = await Product.paginate(filter, options);

    res.render("index", {
      products: result.docs,
      cartId: "698c8fbd20e731bc85218b75",
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
    });
  } catch (error) {
    res.status(500).send("Error al cargar productos");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid).lean();
    if (!product) return res.status(404).render("404");
    res.render("productDetail", { product });
  } catch (error) {
    res.status(500).send("Error al cargar producto");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product").lean();

    if (!cart) return res.status(404).render("404");

    res.render("cartView", { cart });
  } catch (error) {
    res.status(500).send("Error al cargar carrito");
  }
});

export default router;