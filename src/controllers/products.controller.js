import Product from "../models/Product.model.js";

// CREAR PRODUCTO
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, status } = req.body;

    if (!title || !description || price == null || stock == null || !category) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios",
      });
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        status: "error",
        message: "El precio debe ser un número mayor a 0",
      });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({
        status: "error",
        message: "El stock debe ser un entero mayor o igual a 0",
      });
    }

    const newProduct = await Product.create({
      title,
      description,
      price,
      stock,
      category,
      status: status ?? true,
    });

    res.status(201).json({
      status: "success",
      payload: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ELIMINAR PRODUCTO
export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(pid);

    if (!deletedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.json({
      status: "success",
      message: "Producto eliminado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// OBTENER PRODUCTO POR ID
export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await Product.findById(pid);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// OBTENER TODOS LOS PRODUCTOS
export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    let sortOption = {};
    if (sort === "asc") sortOption = { price: 1 };
    if (sort === "desc") sortOption = { price: -1 };

    const options = {
      limit: Number(limit),
      page: Number(page),
      sort: sortOption,
      lean: true,
    };

    const result = await Product.paginate(filter, options);

    // prevLink y nextLink
    const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;
    const prevLink = result.hasPrevPage
      ? `${baseUrl}?page=${result.page - 1}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
      : null;
    const nextLink = result.hasNextPage
      ? `${baseUrl}?page=${result.page + 1}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
      : null;

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ACTUALIZAR PRODUCTO
export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No hay datos para actualizar",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(pid, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.json({
      status: "success",
      payload: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
