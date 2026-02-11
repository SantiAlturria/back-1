import express from "express";
import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";

const router = express.Router();

router.get('/products/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  if (!product) return res.status(404).render('404');
  res.render('productDetail', { product });
});

router.get('/carts/:cid', async (req, res) => {
  const { cid } = req.params;
  const cart = await Cart.findById(cid).populate('products.product');
  if (!cart) return res.status(404).render('404');
  res.render('cartView', { cart });
});
