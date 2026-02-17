import express from "express";
import {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  clearCart,
  replaceCart,
  updateProductQuantity,
} from "../controllers/carts.controller.js";

const router = express.Router();

router.post("/", createCart);
router.get("/:cid", getCartById);
router.post("/:cid/products/:productId", addProductToCart);
router.put("/:cid/products/:productId", updateProductQuantity);
router.put("/:cid", replaceCart);
router.delete("/:cid/products/:productId", removeProductFromCart);
router.delete("/:cid", clearCart);

export default router;
