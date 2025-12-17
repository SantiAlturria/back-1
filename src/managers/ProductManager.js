import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // Obtener un producto //
  async getProducts() {
    try {
      if (!fs.existsSync(this.path)) {
        return [];
      }

      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error leyendo productos:", error);
      return [];
    }
  }

  // Obtener un producto por ID //
  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id === Number(id));
  }

  // Actualizar un producto //
  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === Number(id));

    if (index === -1) return null;

    const { id: _, ...safeUpdates } = updates;

    if (Object.keys(safeUpdates).length === 0) {
      throw new Error("No hay campos válidos para actualizar");
    }

    const allowedFields = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
      "thumbnails",
    ];

    for (let field of Object.keys(safeUpdates)) {
      if (!allowedFields.includes(field)) {
        throw new Error(`El campo ${field} no se puede actualizar`);
      }
    }

    products[index] = {
      ...products[index],
      ...safeUpdates,
    };

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

    return products[index];
  }

  // Agregar un producto //
  async addProduct(product) {
    try {
      const products = await this.getProducts();
      const lastId = products.length > 0 ? products[products.length - 1].id : 0;
      const newProduct = { id: lastId + 1, ...product };

      // Validación //
      const requiredFields = [
        "title",
        "description",
        "code",
        "price",
        "status",
        "stock",
        "category",
        "thumbnails",
      ];
      for (let field of requiredFields) {
        if (newProduct[field] === undefined) {
          throw new Error(`El campo ${field} es obligatorio`);
        }
      }

      // Guardar //
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

      console.log("Producto agregado correctamente:", newProduct);
    } catch (error) {
      console.error("Error agregando producto:", error);
    }
  }

  // Eliminar un producto //
  async deleteProduct(id) {
    const products = await this.getProducts();
    const newProducts = products.filter((p) => p.id !== Number(id));

    if (products.length === newProducts.length) return false;

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(newProducts, null, 2)
    );
    return true;
  }
}

export default ProductManager;
