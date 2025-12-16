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
  return products.find(p => p.id === Number(id));
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
}

export default ProductManager;
