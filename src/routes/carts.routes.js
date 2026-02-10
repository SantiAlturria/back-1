import express from "express";
import {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  clearCart
} from "../controllers/carts.controller.js";

const router = express.Router();

router.post("/", createCart);

router.get("/:cid", getCartById);

router.post("/:cid/product/:productId", addProductToCart);

router.delete("/:cid/product/:productId", removeProductFromCart);

router.delete("/:cid", clearCart);

export default router;