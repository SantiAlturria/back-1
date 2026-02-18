import bcrypt from "bcrypt";
import User from "../models/User.model.js";
import Cart from "../models/Cart.model.js";

export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email ya registrado" });
    }

    const cart = await Cart.create({ products: [] });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart: cart._id,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};