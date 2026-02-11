import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

// CREAR CARRITO VACÍO
export const createCart = async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// OBTENER CARRITO POR ID
export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");

    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// AGREGAR PRODUCTO AL CARRITO
export const addProductToCart = async (req, res) => {
  try {
    const { cid, productId } = req.params;
    const { quantity = 1 } = req.body;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Cantidad inválida"
      });
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }

    const existingProduct = cart.products.find(
      p => p.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// REMOVER PRODUCTO DEL CARRITO
export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, productId } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    cart.products = cart.products.filter(
      p => p.product.toString() !== productId
    );

    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// VACIAR CARRITO
export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    cart.products = [];
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ACTUALIZAR CANTIDAD DE UN PRODUCTO
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ status: "error", message: "Cantidad inválida" });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const productInCart = cart.products.find(p => p.product.toString() === productId);
    if (!productInCart) {
      return res.status(404).json({ status: "error", message: "Producto no está en el carrito" });
    }

    productInCart.quantity = quantity;
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// REEMPLAZAR CARRITO COMPLETO
export const replaceCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        status: "error",
        message: "Products debe ser un array"
      });
    }

    const cart = await Cart.findByIdAndUpdate(
      cid,
      { products },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    res.json({
      status: "success",
      payload: cart
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};