import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.router.js";

dotenv.config();
connectDB();

const app = express();
const PORT = 8090;

app.use(express.json());

app.use("/api/products", productsRouter);

app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});