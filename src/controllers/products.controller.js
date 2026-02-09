export const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, status } = req.body;

    if (!title || !description || price == null || stock == null || !category) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios"
      });
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        status: "error",
        message: "El precio debe ser un número mayor a 0"
      });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({
        status: "error",
        message: "El stock debe ser un entero mayor o igual a 0"
      });
    }

    const newProduct = await Product.create({
      title,
      description,
      price,
      stock,
      category,
      status: status ?? true
    });

    res.status(201).json({
      status: "success",
      payload: newProduct
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(pid);

    if (!deletedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    res.json({
      status: "success",
      message: "Producto eliminado"
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await Product.findById(pid);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    res.json({
      status: "success",
      payload: product
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      query
    } = req.query;

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
      lean: true
    };

    const result = await Product.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}&limit=${limit}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}&limit=${limit}`
        : null
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No hay datos para actualizar"
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      pid,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    res.json({
      status: "success",
      payload: updatedProduct
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    });
  }
};
